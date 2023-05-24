import {
  VoiceBoardSpec,
  VoiceBoard,
  VoiceLangUtterances,
  Utterance,
  UtteranceMoment,
  UtteranceByVoice,
} from "./Model";

const convert = (
  id: number,
  vbs: VoiceBoardSpec,
  setActiveUtterance: (u: Utterance | undefined) => void,
  setActiveUtteranceMoment: (um: UtteranceMoment | undefined) => void
): VoiceBoard => {
  switch (vbs.type) {
    case "script":
      const interpolateCharacterNamesInMessage: (msg: string) => string =
        (() => {
          let replacementFns = Object.entries(vbs.characters).map(
            ([c, character]) =>
              (msg: string) =>
                msg.replace(`{${c}}`, character.name)
          );
          return (msg: string) =>
            replacementFns.reduce((msg, replace) => replace(msg), msg);
        })();
      let utteranceMoments: UtteranceMoment[] = vbs.script.map((moment) => {
        let utteranceByVoice: UtteranceByVoice = Object.fromEntries(
          Object.entries(moment)
            .map(([v, msg]) => {
              if (!(v in vbs.characters)) {
                return undefined;
              }
              let character = vbs.characters[v];
              //console.log({ line, v, msg, voice });
              let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${
                character.voice
              }&msg=${interpolateCharacterNamesInMessage(msg)}`;
              let a = new Audio(url);
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
                  a.load();
                  a.play();
                  setActiveUtterance(self);
                },
              };
              return [v, utt] as [string, Utterance];
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
          utteranceByVoice,
          onEnd: (observer: () => void) => endObservers.push(observer),
          stop: (um: UtteranceMoment) => {
            setActiveUtteranceMoment(undefined);
            let us = Object.values(um.utteranceByVoice);
            for (let u of us) {
              u.audio.pause();
              u.audio.currentTime = 0;
            }
          },
          play: (um: UtteranceMoment) => {
            //console.log("started: " + line);
            setActiveUtteranceMoment(um);
            let us = Object.values(um.utteranceByVoice);
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
              u.audio.load();
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
    case "conversation":
      let utteranceMomentss: UtteranceMoment[] = vbs.utterances.map(
        ([v, msg]) => {
          let character = vbs.characters[v];
          let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${character.voice}&msg=${msg}`;
          let a = new Audio(url);
          let utt = {
            label: msg,
            voice: character.voice,
            audio: a,
            stop: () => {
              a.pause();
              a.currentTime = 0;
            },
            play: (self: Utterance) => {
              a.currentTime = 0;
              a.play();
              setActiveUtterance(self);
            },
          };
          let endObservers: (() => void)[] = [];
          utt.audio.addEventListener("ended", () => {
            for (let o of endObservers) {
              o();
            }
          });
          return {
            play: (um: UtteranceMoment) => {
              utt.play(utt);
              setActiveUtteranceMoment(um);
            },
            stop: (um: UtteranceMoment) => {
              utt.stop();
              setActiveUtteranceMoment(undefined);
            },
            onEnd: (ob: () => void) => {
              endObservers.push(ob);
            },
            utteranceByVoice: { [v]: utt },
          };
        }
      );

      for (let i = 0; i < utteranceMomentss.length - 1; i++) {
        console.log(`adding listener on ${i} for ${i + 1}`);
        let um = utteranceMomentss[i];
        let nextUm = utteranceMomentss[i + 1];
        um.onEnd(() => nextUm.play(nextUm));
      }
      utteranceMomentss[utteranceMomentss.length - 1].onEnd(() => {
        setActiveUtteranceMoment(undefined);
      });
      return {
        id,
        characters: vbs.characters,
        utteranceMoments: utteranceMomentss,
        type: "conversation",
        play: () => {
          alert("not implemented");
        },
        stop: () => {
          alert("not implemented");
        },
      };
    case "board":
      let boardUtterances: VoiceLangUtterances = Object.fromEntries(
        vbs.voices.map((voice) => {
          let uts = Object.fromEntries(
            Object.entries(vbs.domain).map(([lang, words]) => [
              lang,
              words.map((w) => {
                let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${voice}&msg=${w}`;
                let a = new Audio(url);
                let utterance: Utterance = {
                  label: w,
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
