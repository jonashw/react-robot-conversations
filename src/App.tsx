import "./styles.css";
import React from "react";
import Generator from "./Generator";
import useLocalStorage from "./useLocalStorage";
import VoiceBoardSelector from "./ui/VoiceBoardSelector";
import {
  Voice,
  SketchSpecification,
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
  const [voiceBoards, setVoiceBoards] = React.useState<VoiceBoard[]>([]);
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
      let result = await fetch("/sketches.json");
      let specs: SketchSpecification[] = [
        Generator.rowYourBoat(true),
        Generator.rowYourBoat(false),
        ...(await result.json()),
      ];
      let voiceBoards = specs.map((spec, i) => loadVoiceBoard(i + 1, spec));
      setVoiceBoards(voiceBoards);
    }
    effect();
  }, []);

  const updateVoiceBoard = (prev: VoiceBoard, next: VoiceBoard) => {
    setVoiceBoards(voiceBoards.map((vb) => (vb === prev ? next : vb)));
    console.log("update", { prev, next });
    if (prev === activeVoiceBoard) {
      setActiveVoiceBoard(next);
    }
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
        {!activeVoiceBoard && (
          <VoiceBoardSelector
            {...{
              voiceBoards,
              setVoiceBoards,
              activeVoiceBoard,
              setActiveVoiceBoard,
            }}
          />
        )}

        {!!activeVoiceBoard && (
          <div style={{ flexGrow: 1, marginTop: "1em" }}>
            <div className="d-flex justify-content-between mb-3">
              <button
                className="btn"
                onClick={() => {
                  setActiveVoiceBoard(undefined);
                }}
              >
                &larr;
              </button>
              <div
                className="h6 flex-grow-1"
                style={{
                  padding: "0.375rem 0",
                }}
              >
                {activeVoiceBoard.name}
              </div>
            </div>

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
