import "./styles.css";
import React from "react";

type Voice = {
  name: string;
  lang: string;
  age: string;
  gender: string;
};

type VoiceIndex = { [name: string]: Voice };

type VoiceBoardSpec =
  | {
      type: "board";
      voices: string[];
      domain: { [lang: string]: string[] };
    }
  | {
      type: "conversation";
      voices: { [abbrev: string]: string };
      utterances: [string, string][];
    };
type Toolbox = {
  id: number;
  type: "board";
  utterances: { [voice: string]: VoiceUtterances };
};
type Conversation = {
  id: number;
  type: "conversation";
  utterances: Utterance[];
};
type VoiceBoard = Toolbox | Conversation;
type VoiceUtterances = {
  [lang: string]: Utterance[];
};
type Utterance = {
  voice: string;
  label: string;
  play: (self: Utterance) => void;
  stop: () => void;
};

const loadVoiceBoard = (
  id: number,
  vbs: VoiceBoardSpec,
  setActiveUtterance: (u: Utterance) => void
): VoiceBoard => {
  switch (vbs.type) {
    case "conversation":
      let utterances = vbs.utterances.map(([v, msg]) => {
        let voice = vbs.voices[v];
        let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${voice}&msg=${msg}`;
        let a = new Audio(url);
        return {
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
      });

      for (let i = 0; i < utterances.length - 1; i++) {
        console.log(`adding listener on ${i} for ${i + 1}`);
        utterances[i].audio.addEventListener("ended", () => {
          console.log("ended");
          let nextU = utterances[i + 1];
          nextU.play(nextU);
        });
      }

      return {
        id,
        utterances,
        type: vbs.type,
      };
    case "board":
      let boardUtterances = Object.fromEntries(
        vbs.voices.map((voice) => {
          let uts = Object.fromEntries(
            Object.entries(vbs.domain).map(([lang, words]) => [
              lang,
              words.map((w) => {
                let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${voice}&msg=${w}`;
                let a = new Audio(url);
                return {
                  label: w,
                  voice,
                  stop: () => {
                    a.pause();
                    a.currentTime = 0;
                  },
                  play: () => {
                    a.load();
                    a.play();
                  },
                };
              }),
            ])
          );
          return [voice, uts];
        })
      );

      return {
        id,
        utterances: boardUtterances,
        type: vbs.type,
      };
  }
};

const VoiceBoardControls = ({
  voices,
  voiceBoard,
  preventUtteranceOverlap,
  activeUtterance,
  setActiveUtterance,
}: {
  voices: VoiceIndex;
  voiceBoard: VoiceBoard;
  preventUtteranceOverlap: boolean;
  activeUtterance: Utterance | null;
  setActiveUtterance: (u: Utterance) => void;
}) => {
  let vb = voiceBoard;

  const [activeVoice, setActiveVoice] = React.useState<Voice | null>(null);
  React.useEffect(() => {
    setActiveVoice(null);
    let voiceNames = Object.keys(voiceBoard.utterances);
    if (voiceNames.length === 0) {
      return;
    }
    if (!(voiceNames[0] in voices)) {
      return;
    }
    setActiveVoice(voices[voiceNames[0]]);
  }, [voiceBoard, voices]);
  return (
    <div>
      {(() => {
        switch (vb.type) {
          case "conversation":
            return (
              <div>
                {vb.utterances.map((u, i) => (
                  <div style={{ clear: "both" }}>
                    <span
                      className="btn btn-lg"
                      style={{
                        float: i % 2 !== 0 ? "left" : "right",
                        textAlign: i % 2 !== 0 ? "left" : "right",
                      }}
                    >
                      {u.voice}
                    </span>
                    <button
                      className={
                        "btn btn-lg " +
                        (activeUtterance === u
                          ? "btn-primary"
                          : "btn-outline-primary")
                      }
                      style={{
                        display: "inline-block",
                        margin: "1%",
                        width: "66%",
                        float: i % 2 === 0 ? "left" : "right",
                        textAlign: i % 2 === 0 ? "left" : "right",
                      }}
                      onClick={() => {
                        if (preventUtteranceOverlap && !!activeUtterance) {
                          activeUtterance.stop();
                        }
                        u.play(u);
                        setActiveUtterance(u);
                      }}
                    >
                      {u.label}
                    </button>
                  </div>
                ))}
              </div>
            );
          case "board":
            return (
              <div>
                <table className="table table-bordered">
                  <tbody>
                    {Object.entries(vb.utterances).map(
                      ([voice, voiceUtterances]) => (
                        <tr
                          className={
                            activeVoice === voices[voice] ? "table-primary" : ""
                          }
                          onClick={() => setActiveVoice(voices[voice])}
                        >
                          <td>
                            <input
                              type="radio"
                              checked={activeVoice === voices[voice]}
                            />
                          </td>
                          <td>{voice}</td>
                          {[
                            (v: Voice) => v.age,
                            (v: Voice) => v.gender,
                            (v: Voice) => v.lang,
                          ].map((key) => (
                            <td>
                              <span className="badge text-bg-secondary">
                                {key(voices[voice])}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                {!!activeVoice && activeVoice.name in vb.utterances && (
                  <div style={{ marginTop: "1em" }}>
                    <div>
                      {Object.entries(vb.utterances[activeVoice.name])
                        .filter(
                          ([lang, voiceLangUtterances]) =>
                            lang === activeVoice.lang
                        )
                        .map(([lang, voiceLangUtterances]) => (
                          <div
                            style={{ marginTop: "1em" }}
                            className="d-flex flex-wrap"
                          >
                            {voiceLangUtterances.map((u) => (
                              <button
                                className="btn btn-lg btn-outline-primary"
                                style={{
                                  display: "block",
                                  width: "48%",
                                  margin: "1%",
                                }}
                                onClick={() => {
                                  if (
                                    preventUtteranceOverlap &&
                                    !!activeUtterance
                                  ) {
                                    activeUtterance.stop();
                                  }
                                  u.play(u);
                                  setActiveUtterance(u);
                                }}
                              >
                                {u.label}
                              </button>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
        }
      })()}
    </div>
  );
};

export default function App() {
  const [preventUtteranceOverlap, setPreventUtteranceOverlap] =
    React.useState(true);
  const [voices, setVoices] = React.useState<VoiceIndex>({});
  const [activeVoiceBoard, setActiveVoiceBoard] =
    React.useState<VoiceBoard | null>(null);
  const [activeUtterance, setActiveUtterance] =
    React.useState<Utterance | null>(null);

  const [voiceBoardSpecs, setVoiceBoardSpecs] = React.useState<
    VoiceBoardSpec[]
  >([]);

  React.useEffect(() => {
    async function effect() {
      let result = await fetch(
        "https://storage.googleapis.com/jonashw-dev-speech-synthesis/index.json?v8"
      );
      let voices: Voice[] = await result.json();
      setVoices(Object.fromEntries(voices.map((v) => [v.name, v])));
    }
    effect();
  }, []);

  React.useEffect(() => {
    async function effect() {
      let result = await fetch("/voiceboards.json");
      let specs: VoiceBoardSpec[] = await result.json();
      setVoiceBoardSpecs(specs);
    }
    effect();
  }, []);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          marginTop: "1em",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {voiceBoardSpecs.map((spec, i) => (
            <button
              className={
                "flex-grow-1 mx-1 btn " +
                (!!activeVoiceBoard && i + 1 === activeVoiceBoard.id
                  ? "btn-primary"
                  : "btn-outline-primary")
              }
              onClick={() => {
                if (!!activeVoiceBoard && activeVoiceBoard.id === i + 1) {
                  setActiveVoiceBoard(null);
                } else {
                  setActiveVoiceBoard(
                    loadVoiceBoard(i + 1, spec, setActiveUtterance)
                  );
                }
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {!!activeVoiceBoard && (
          <div style={{ flexGrow: 1, marginTop: "1em" }}>
            <VoiceBoardControls
              activeUtterance={activeUtterance}
              setActiveUtterance={setActiveUtterance}
              voiceBoard={activeVoiceBoard}
              voices={voices}
              preventUtteranceOverlap={preventUtteranceOverlap}
            />
          </div>
        )}
      </div>
    </div>
  );
}
