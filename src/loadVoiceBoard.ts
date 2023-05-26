import AudioRepository from "./AudioRepository";
import {
  VoiceBoardSpec,
  VoiceBoard,
  CharacterLangUtterances,
  Utterance,
  UtteranceMoment,
  UtteranceByCharacter,
} from "./Model";
import AudioOutput from "./AudioOutput";
const convert = (
  id: number,
  vbs: VoiceBoardSpec,
  setActiveUtterance: (u: Utterance | undefined) => void,
  setActiveUtteranceMoment: (um: UtteranceMoment | undefined) => void
): VoiceBoard => {
  const interpolateCharacterNamesInMessage = (() => {
    let replacementFns =
      vbs.type === "conversation"
        ? Object.entries(vbs.characters).map(
            ([c, character]) =>
              (msg: string) =>
                msg.replace(`{${c}}`, character.name)
          )
        : [];
    return (msg: string) =>
      replacementFns.reduce((msg, replace) => replace(msg), msg);
  })();
  switch (vbs.type) {
    case "conversation":
      let utteranceMoments: UtteranceMoment[] = vbs.script.map((moment) => {
        let utteranceByCharacter: UtteranceByCharacter = Object.fromEntries(
          Object.entries(moment)
            .map(([c, msg]) => {
              if (!(c in vbs.characters)) {
                return undefined;
              }
              let character = vbs.characters[c];

              let finalMessage = interpolateCharacterNamesInMessage(msg);

              let utt: Utterance = {
                label: finalMessage,
                voice: character.voice,
              };
              return [c, utt] as [string, Utterance];
            })
            .filter((u) => u !== undefined)
            .map((u) => u as [string, Utterance])
        );

        return {
          utteranceByCharacter,
        };
      });

      return {
        id,
        spec: vbs,
        characters: vbs.characters,
        type: "conversation",
        utteranceMoments
      };

    case "board":
      let boardUtterances: CharacterLangUtterances = Object.fromEntries(
        vbs.voices.map((voice) => {
          let uts = Object.fromEntries(
            Object.entries(vbs.domain).map(([lang, words]) => [
              lang,
              words.map((w) => {
                let a = new Audio();
                AudioRepository.getAudioBlob([
                  voice,
                  interpolateCharacterNamesInMessage(w),
                ]).then((blob) => {
                  a.src = URL.createObjectURL(blob);
                });
                let utterance: Utterance = {
                  label: interpolateCharacterNamesInMessage(w),
                  voice,
                };
                return utterance;
              }),
            ])
          );
          return [voice, uts];
        })
      );
      let audioId = (u: Utterance): [string, string] => [u.voice, u.label];
      return {
        id,
        spec: vbs,
        utterances: boardUtterances,
        type: "board",
        play: (u: Utterance) => AudioOutput.play(audioId(u)),
        stop: (u: Utterance) => AudioOutput.pause(audioId(u)),
      };
  }
};

const cache: { [id: number]: VoiceBoard } = {};

export default (
  id: number,
  vbs: VoiceBoardSpec,
  setActiveUtterance: (u: Utterance | undefined) => void,
  setActiveUtteranceMoment: (um: UtteranceMoment | undefined) => void
): VoiceBoard => {
  console.log("getting " + id + " from cache", cache);
  if (id in cache) {
    return cache[id];
  }
  let sketch = convert(id, vbs, setActiveUtterance, setActiveUtteranceMoment);
  cache[id] = sketch;

  return sketch;
};
