import "./styles.css";
import React from "react";
import Generator from "./Generator";
import DarkModeToggle from "./ui/DarkModeToggle";
import VoiceBoardSelector from "./ui/VoiceBoardSelector";
import PlayPause from "./ui/PlayPause";
import SimpleControls from "./ui/SimpleControls";
import AuditionControls from "./ui/AuditionControls";
import {
  Voice,
  SketchSpecification,
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
  Simple,
  Audition,
} from "./Model";
import CrossControls from "./ui/CrossControls";
import ConversationControls from "./ui/ConversationControls";
import { loadVoiceBoard } from "./loadVoiceBoard";

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

export default function App() {
  const [preventUtteranceOverlap, setPreventUtteranceOverlap] =
    React.useState(true);
  const [voices, setVoices] = React.useState<VoiceIndex>({});
  const voiceIndex = voices;
  const [activeVoiceBoard, setActiveVoiceBoard] = React.useState<
    VoiceBoard | undefined
  >(undefined);

  const [activeUtterance, setActiveUtterance] = React.useState<
    Utterance | undefined
  >(undefined);
  const [activeUtteranceMoment, setActiveUtteranceMoment] = React.useState<
    UtteranceMoment | undefined
  >(undefined);
  const [voiceBoards, setVoiceBoards] = React.useState<VoiceBoard[]>([]);

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
    if (Object.keys(voices).length === 0) {
      return;
    }
    async function effect() {
      let result = await fetch("/sketches.json");
      let specs: SketchSpecification[] = [
        Generator.englishSpeakers(voices),
        Generator.rowYourBoat(true),
        Generator.rowYourBoat(false),
        ...(await result.json()),
      ];
      let voiceBoards = specs.map((spec, i) => loadVoiceBoard(i + 1, spec));
      setVoiceBoards(voiceBoards);
    }
    effect();
  }, [voices]);

  const updateVoiceBoard = (prev: VoiceBoard, next: VoiceBoard) => {
    setVoiceBoards(voiceBoards.map((vb) => (vb === prev ? next : vb)));
    console.log("update", { prev, next });
    if (prev === activeVoiceBoard) {
      setActiveVoiceBoard(next);
    }
  };

  return (
    <div style={{ height: "100vw" }}>
      {!activeVoiceBoard && (
        <>
          <nav className="navbar bg-body-tertiary mb-2">
            <div className="container-fluid">
              <a className="navbar-brand">Voice Sketches</a>
              <DarkModeToggle />
            </div>
          </nav>
          <div className="container-fluid">
            <VoiceBoardSelector
              {...{
                voiceBoards,
                voiceIndex,
                setVoiceBoards,
                activeVoiceBoard,
                setActiveVoiceBoard,
              }}
            />
          </div>
        </>
      )}

      {!!activeVoiceBoard && (
        <div style={{ flexGrow: 1 }}>
          <nav
            className="navbar bg-body-tertiary mb-2"
            style={{ position: "sticky", top: "0", zIndex: 1000 }}
          >
            <form
              className="container-fluid justify-content-between"
              style={{ flexWrap: "nowrap" }}
            >
              <button
                className="btn btn-lg me-3"
                type="button"
                onClick={() => {
                  setActiveVoiceBoard(undefined);
                }}
              >
                ‹
              </button>
              <a
                className="navbar-brand flex-grow-1"
                style={{ textOverflow: "ellipsis", overflow: "hidden" }}
              >
                {activeVoiceBoard.name}
              </a>
            </form>
          </nav>

          <div className="container-fluid" style={{ paddingBottom: "4em" }}>
            {(() => {
              switch (activeVoiceBoard.type) {
                case "conversation":
                  return (
                    <ConversationControls
                      conversation={activeVoiceBoard}
                      voices={voices}
                      updateVoiceBoard={updateVoiceBoard}
                      activeUtteranceMoment={activeUtteranceMoment}
                      setActiveUtteranceMoment={setActiveUtteranceMoment}
                    />
                  );
                case "cross":
                  return (
                    <CrossControls
                      voices={voices}
                      preventUtteranceOverlap={preventUtteranceOverlap}
                      cross={activeVoiceBoard}
                    />
                  );
                case "simple":
                  let simple: Simple = activeVoiceBoard;
                  return <SimpleControls simple={simple} />;
                case "audition":
                  return (
                    <AuditionControls
                      audition={activeVoiceBoard as Audition}
                      setAudition={(
                        oldAudition: Audition,
                        newAudition: Audition
                      ) => {
                        updateVoiceBoard(oldAudition, newAudition);
                      }}
                      voiceIndex={voices}
                    />
                  );
                default:
                  assertUnreachable(activeVoiceBoard);
                  break;
              }
            })()}
          </div>
          {!!activeVoiceBoard && activeVoiceBoard.type === "conversation" && (
            <div
              className="my-2 mx-5"
              style={{ position: "fixed", bottom: 0, right: 0, left: 0 }}
            >
              <PlayPause
                {...{
                  conversation: activeVoiceBoard,
                  activeUtteranceMoment,
                  setActiveUtteranceMoment,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
