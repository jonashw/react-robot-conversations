import "./styles.css";
import React from "react";
import Generator from "./Generator";
import useLocalStorage from "./useLocalStorage";
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
  const [darkMode, setDarkMode] = useLocalStorage(
    "darkMode",
    (b) => b.toString(),
    (str) => str === "true",
    false
  );
  const [activeUtterance, setActiveUtterance] = React.useState<
    Utterance | undefined
  >(undefined);
  const [activeUtteranceMoment, setActiveUtteranceMoment] = React.useState<
    UtteranceMoment | undefined
  >(undefined);
  const [voiceBoardSpecs, setVoiceBoardSpecs] = React.useState<
    VoiceBoardSpec[]
  >([]);
  React.useLayoutEffect(() => {
    let htmlElement = window.document.querySelector("html");
    if (!htmlElement) {
      return;
    }
    let [k, v] = ["data-bs-theme", "dark"];
    if (darkMode) {
      htmlElement.setAttribute(k, v);
    } else {
      htmlElement.removeAttribute(k);
    }
  }, [darkMode]);
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

  const updateVoiceBoard = (prev: VoiceBoard, next: VoiceBoard) => {
    //voiceB
    if (prev !== activeVoiceBoard) {
      return;
    }
    setActiveVoiceBoard(next);
    console.log("update", { prev, next });
  };

  return (
    <div className="App container">
      <button
        className="btn btn-sm"
        style={{ position: "fixed", bottom: "1em", left: "1em" }}
        onClick={() => setDarkMode(!darkMode)}
      >
        D/N
      </button>
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
              updateVoiceBoard={updateVoiceBoard}
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
