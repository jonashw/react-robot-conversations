import { unmountComponentAtNode } from "react-dom";
import {
  Voice,
  VoiceBoardSpec,
  VoiceBoard,
  VoiceIndex,
  VoiceLangUtterances,
  Utterance,
  UtteranceMoment,
  UtteranceByVoice,
} from "./Model";

export default (
  id: number,
  vbs: VoiceBoardSpec,
  setActiveUtterance: (u: Utterance | undefined) => void,
  setActiveUtteranceMoment: (um: UtteranceMoment | undefined) => void
): VoiceBoard => {
  switch (vbs.type) {
    case "script":
      let utteranceMoments: UtteranceMoment[] = vbs.script
        .split("\n")
        .map((line) => {
          let utteranceByVoice: UtteranceByVoice = Object.fromEntries(
            line
              .split("|")
              .map((u) => {
                let [v, msg] = u.split(":");
                let voice = vbs.voices[v];
                console.log({ line, v, msg, voice });
                let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${voice}&msg=${msg}`;
                let a = new Audio(url);
                let utt: Utterance = {
                  label: msg,
                  voice,
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
                return [v, utt];
              })
              .filter((u) => !!u)
          );
          let endObservers: (() => void)[] = [
            () => {
              console.log("ended: " + line);
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
              console.log("started: " + line);
              setActiveUtteranceMoment(um);
              let us = Object.values(um.utteranceByVoice);
              let ended = [];
              for (let u of us) {
                const listener = () => {
                  console.log("ended");
                  u.audio.removeEventListener("ended", listener);
                  ended.push(u);
                  if (ended.length === us.length) {
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
        voices: vbs.voices,
        type: "conversation",
        utteranceMoments,
      };
    case "conversation":
      let utteranceMomentss: UtteranceMoment[] = vbs.utterances.map(
        ([v, msg]) => {
          let voice = vbs.voices[v];
          let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${voice}&msg=${msg}`;
          let a = new Audio(url);
          let utt = {
            label: msg,
            voice,
            audio: a,
            stop: () => {
              a.pause();
              a.currentTime = 0;
            },
            play: (self: Utterance) => {
              a.load();
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
      return {
        id,
        voices: vbs.voices,
        utteranceMoments: utteranceMomentss,
        type: vbs.type,
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
                    a.load();
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
