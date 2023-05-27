import AudioRepository from "./AudioRepository";
import {
  SketchSpecification,
  VoiceBoard,
  Utterance,
  UtteranceMoment,
  UtteranceByCharacter,
} from "./Model";

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

    case "cross":
      return {
        name: vbs.name,
        id,
        voices: vbs.voices,
        phrases: vbs.phrases,
        type: "cross",
      };
  }
};
