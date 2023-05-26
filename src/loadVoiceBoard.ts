import AudioRepository from "./AudioRepository";
import {
  SketchSpecification,
  VoiceBoard,
  CharacterLangUtterances,
  Utterance,
  UtteranceMoment,
  UtteranceByCharacter,
} from "./Model";
import AudioOutput from "./AudioOutput";

export default (id: number, vbs: SketchSpecification): VoiceBoard => {
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
          id: Math.random().toString(),
          utteranceByCharacter,
        };
      });

      return {
        name: vbs.name,
        id,
        characters: vbs.characters,
        type: "conversation",
        utteranceMoments,
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
        name: vbs.name,
        id,
        utterances: boardUtterances,
        type: "board",
        play: (u: Utterance) => AudioOutput.play(audioId(u)),
        stop: (u: Utterance) => AudioOutput.pause(audioId(u)),
      };
  }
};
