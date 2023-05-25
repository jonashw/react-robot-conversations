import AudioRepository from "./AudioRepository";
import {
  VoiceBoardSpec,
  VoiceBoard,
  CharacterLangUtterances,
  Utterance,
  UtteranceMoment,
  UtteranceByCharacter,
} from "./Model";

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
              //console.log({ line, v, msg, voice });
              let a = new Audio();

              AudioRepository.getAudioBlob([
                character.voice,
                interpolateCharacterNamesInMessage(msg),
              ]).then((blob) => {
                a.src = URL.createObjectURL(blob);
              });
              let utt: Utterance = {
                label: interpolateCharacterNamesInMessage(msg),
                voice: character.voice,
                audio: a,
                stop: () => {
                  a.pause();
                  a.currentTime = 0;
                  setActiveUtterance(undefined);
                },
                play: (self: Utterance) => {
                  a.currentTime = 0;
                  a.play();
                  setActiveUtterance(self);
                },
              };
              return [c, utt] as [string, Utterance];
            })
            .filter((u) => u !== undefined)
            .map((u) => u as [string, Utterance])
        );
        let endObservers: (() => void)[] = [
          () => {
            //console.log("ended: " + line);
          },
        ];
        return {
          utteranceByCharacter,
          onEnd: (observer: () => void) => endObservers.push(observer),
          stop: (um: UtteranceMoment) => {
            setActiveUtteranceMoment(undefined);
            let us = Object.values(um.utteranceByCharacter);
            for (let u of us) {
              u.audio.pause();
              u.audio.currentTime = 0;
            }
          },
          play: (um: UtteranceMoment) => {
            //console.log("started: " + line);
            setActiveUtteranceMoment(um);
            let us = Object.values(um.utteranceByCharacter);
            let ended = [];
            for (let u of us) {
              const listener = () => {
                console.log("ended");
                u.audio.removeEventListener("ended", listener);
                ended.push(u);
                if (ended.length === us.length) {
                  setActiveUtteranceMoment(undefined);
                  for (let o of endObservers) {
                    o();
                  }
                }
              };

              u.audio.addEventListener("ended", listener);
              u.audio.currentTime = 0;
              u.audio.play();
            }
          },
        };
      });

      for (let i = 0; i < utteranceMoments.length - 1; i++) {
        console.log(`adding listener on ${i} for ${i + 1}`);
        let um = utteranceMoments[i];
        let nextUm = utteranceMoments[i + 1];
        um.onEnd(() => nextUm.play(nextUm));
      }

      return {
        id,
        characters: vbs.characters,
        type: "conversation",
        utteranceMoments,
        play: () => {
          alert("not implemented");
        },
        stop: () => {
          alert("not implemented");
        },
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
                  audio: a,
                  stop: () => {
                    a.pause();
                    a.currentTime = 0;
                  },
                  play: () => {
                    a.currentTime = 0;
                    a.play();
                  },
                };
                return utterance;
              }),
            ])
          );
          return [voice, uts];
        })
      );

      return {
        id,
        utterances: boardUtterances,
        type: "board",
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
