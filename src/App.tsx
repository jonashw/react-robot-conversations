import "./styles.css";
import React from "react";

type Voice = {
  name: string;
  lang: string;
  age: string;
  gender: string;
};

type VoiceIndex = { [name: string]: Voice };

type VoiceBoardSpec = {
  voices: string[];
  domain: { [lang: string]: string[] };
};

type VoiceBoard = {
  id: number;
  utterances: { [voice: string]: VoiceUtterances };
};
type VoiceUtterances = {
  [lang: string]: Utterance[];
};
type Utterance = {
  label: string;
  play: () => void;
  stop: () => void;
};

const loadVoiceBoard = (id: number, vbs: VoiceBoardSpec): VoiceBoard => {
  let utterances = Object.fromEntries(
    vbs.voices.map((voice) => {
      let uts = Object.fromEntries(
        Object.entries(vbs.domain).map(([lang, words]) => [
          lang,
          words.map((w) => {
            let url = `https://us-west1-jonashw-dev-personal-website.cloudfunctions.net/jonashw-dev-speech-synthesis-proxy?voice=${voice}&msg=${w}`;
            let a = new Audio(url);
            return {
              label: w,
              stop: () => {
                a.pause();
                a.currentTime = 0;
              },
              play: () => {
                a.load();
                a.play();
              }
            };
          })
        ])
      );
      return [voice, uts];
    })
  );

  return {
    id,
    utterances
  };
};

const VoiceBoardControls = ({
  voices,
  voiceBoard,
  preventUtteranceOverlap
}: {
  voices: VoiceIndex;
  voiceBoard: VoiceBoard;
  preventUtteranceOverlap: boolean;
}) => {
  let vb = voiceBoard;
  const [lastUtterance, setLastUtterance] = React.useState<Utterance | null>(
    null
  );
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
      <table className="table table-bordered">
        <tbody>
          {Object.entries(vb.utterances).map(([voice, voiceUtterances]) => (
            <tr
              className={activeVoice === voices[voice] ? "table-primary" : ""}
              onClick={() => setActiveVoice(voices[voice])}
            >
              <td>{voice}</td>
              {["age", "gender", "lang"].map((key) => (
                <td>
                  <span className="badge text-bg-secondary">
                    {voices[voice][key]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!!activeVoice && activeVoice.name in vb.utterances && (
        <div style={{ marginTop: "1em" }}>
          <div>
            {Object.entries(vb.utterances[activeVoice.name])
              .filter(
                ([lang, voiceLangUtterances]) => lang === activeVoice.lang
              )
              .map(([lang, voiceLangUtterances]) => (
                <div
                  style={{ marginTop: "1em", width: "90%" }}
                  className="btn-group-vertical"
                >
                  {voiceLangUtterances.map((u) => (
                    <button
                      className="btn btn-outline-primary"
                      style={{ display: "block", width: "100%" }}
                      onClick={() => {
                        if (preventUtteranceOverlap && !!lastUtterance) {
                          lastUtterance.stop();
                        }
                        u.play();
                        setLastUtterance(u);
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
};

export default function App() {
  const [preventUtteranceOverlap, setPreventUtteranceOverlap] = React.useState(
    true
  );
  const [voices, setVoices] = React.useState<VoiceIndex>({});
  const [
    activeVoiceBoard,
    setActiveVoiceBoard
  ] = React.useState<VoiceBoard | null>(null);

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
          marginTop: "1em"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {voiceBoardSpecs.map((spec, i) => (
            <button
              className={
                "btn " +
                (!!activeVoiceBoard && i + 1 === activeVoiceBoard.id
                  ? "btn-primary"
                  : "btn-outline-primary")
              }
              onClick={() => {
                if (!!activeVoiceBoard && activeVoiceBoard.id === i + 1) {
                  setActiveVoiceBoard(null);
                } else {
                  setActiveVoiceBoard(loadVoiceBoard(i + 1, spec));
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
