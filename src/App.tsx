import "./styles.css";
import React from "react";
import Generator from "./Generator";
import {
  Voice,
  VoiceBoardSpec,
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
} from "./Model";

import loadVoiceBoard from "./loadVoiceBoard";
import VoiceBoardControls from "./ui/VoiceBoardControls";

export default function App() {
  const [preventUtteranceOverlap, setPreventUtteranceOverlap] =
    React.useState(true);
  const [voices, setVoices] = React.useState<VoiceIndex>({});
  const [activeVoiceBoard, setActiveVoiceBoard] = React.useState<
    VoiceBoard | undefined
  >(undefined);
  const [activeUtterance, setActiveUtterance] = React.useState<
    Utterance | undefined
  >(undefined);
  const [activeUtteranceMoment, setActiveUtteranceMoment] = React.useState<
    UtteranceMoment | undefined
  >(undefined);
  const [voiceBoardSpecs, setVoiceBoardSpecs] = React.useState<
    VoiceBoardSpec[]
  >([]);

  React.useEffect(() => {
    console.log({ activeVoiceBoard });
  }, [activeVoiceBoard]);

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
      setVoiceBoardSpecs([
        Generator.rowYourBoat(true),
        Generator.rowYourBoat(false),
        ...specs,
      ]);
    }
    effect();
  }, []);

  return (
    <div className="App container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          marginTop: "1em",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {voiceBoardSpecs.map((spec, i) => (
            <button
              key={i}
              className={
                "flex-grow-1 mx-1 btn " +
                (!!activeVoiceBoard && i + 1 === activeVoiceBoard.id
                  ? "btn-primary"
                  : "btn-outline-primary")
              }
              onClick={() => {
                if (!!activeVoiceBoard && activeVoiceBoard.id === i + 1) {
                  setActiveVoiceBoard(undefined);
                } else {
                  setActiveVoiceBoard(
                    loadVoiceBoard(
                      i + 1,
                      spec,
                      setActiveUtterance,
                      setActiveUtteranceMoment
                    )
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
              activeUtteranceMoment={activeUtteranceMoment}
              setActiveUtteranceMoment={setActiveUtteranceMoment}
              preventUtteranceOverlap={preventUtteranceOverlap}
            />
          </div>
        )}
      </div>
    </div>
  );
}
