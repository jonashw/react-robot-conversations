import AudioRepository from "./AudioRepository";
import {
  SketchSpecification,
  VoiceBoard,
  Utterance,
  UtteranceMoment,
  UtteranceByCharacter,
  VoiceIndex,
  Character,
} from "./Model";

export const parseConversationText = (
  voiceIndex: VoiceIndex,
  rawScript: string
): VoiceBoard => {
  let sections = rawScript.split(/# ?begin script/);

  let voiceNames = Object.keys(voiceIndex);
  let randomVoice = () =>
    voiceNames[Math.floor(Math.random() * voiceNames.length)];

  let utterances = (sections.length === 2 ? sections[1] : rawScript)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((l) => l.split(":").filter((arr) => arr.length !== 2));

  let characters =
    sections.length === 2
      ? Object.fromEntries(
          sections[0]
            .split("\n")
            .map((l) => l.split(":").map((str) => str.trim()))
            .filter((arr) => arr.length === 2)
            .map(([characterId, voice]) => [characterId, voice.split(",")])
            .map(([characterId, characterProps]) => [
              characterId,
              {
                voice: characterProps[0],
                name: characterId,
                emoji:
                  characterProps.length === 2 ? characterProps[1] : undefined,
              },
            ])
        )
      : utterances.reduce((uniqueCharecters, [characterId, message]) => {
          if (!(characterId in uniqueCharecters)) {
            uniqueCharecters[characterId] = {
              name: characterId,
              emoji: undefined,
              voice: randomVoice(),
            };
          }
          return uniqueCharecters;
        }, {} as { [characterId: string]: Character });

  let script = utterances.map(([characterId, phrase]) => ({
    [characterId]: phrase,
  }));
  console.log({ sections, utterances, characters, script });
  let vb: VoiceBoard = loadVoiceBoard(900, {
    name: "pasted",
    type: "conversation",
    script,
    characters,
  });
  return vb;
};

export const loadVoiceBoard = (
  id: number,
  vbs: SketchSpecification
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
    case "simple":
      return {
        name: vbs.name,
        id,
        voice: vbs.voice,
        type: "simple",
        phrases: vbs.phrases,
      };
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
