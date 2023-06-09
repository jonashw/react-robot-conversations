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
import ConversationControls from "./ui/ConversationControls";
import { loadVoiceBoard } from "./loadVoiceBoard";

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

export default function App() {
  const [preventUtteranceOverlap, setPreventUtteranceOverlap] =
    React.useState(true);
  const [voiceIndex, setVoiceIndex] = React.useState<VoiceIndex | undefined>(
    undefined
  );
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
      setVoiceIndex(new VoiceIndex(voices));
    }
    effect();
  }, []);

  React.useEffect(() => {
    if (voiceIndex === undefined) {
      return;
    }
    async function effect() {
      let result = await fetch("/sketches.json");
      let specs: SketchSpecification[] = [
        Generator.rowYourBoat(true),
        Generator.rowYourBoat(false),
        ...(await result.json()),
      ];
      console.log({ specs });
      let voiceBoards = specs.map((spec, i) =>
        loadVoiceBoard(i + 1, spec, voiceIndex!)
      );
      setVoiceBoards(voiceBoards);
    }
    effect();
  }, [voiceIndex]);

  const updateVoiceBoard = (prev: VoiceBoard, next: VoiceBoard) => {
    setVoiceBoards(voiceBoards.map((vb) => (vb === prev ? next : vb)));
    console.log("update", { prev, next });
    if (prev === activeVoiceBoard) {
      setActiveVoiceBoard(next);
    }
  };

  return (
    <div style={{ height: "100vw" }}>
      {!activeVoiceBoard && !!voiceIndex && (
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
            <div className="p-5">
              <img
                src="/roboco-bg-transparent.svg"
                className="col-6 mx-auto d-block img-fluid mb-5 pb-5"
              />
            </div>
          </div>
        </>
      )}

      {!!activeVoiceBoard && (
        <div style={{ flexGrow: 1 }}>
          <nav
            className="navbar bg-body-tertiary mb-2"
            style={{ position: "sticky", top: "0", zIndex: 3000 }}
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
                      voiceIndex={voiceIndex!}
                      updateVoiceBoard={updateVoiceBoard}
                      activeUtteranceMoment={activeUtteranceMoment}
                      setActiveUtteranceMoment={setActiveUtteranceMoment}
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
                      voiceIndex={voiceIndex!}
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
