import React from "react";
import { Link } from "react-router-dom";
import {
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
  Conversation,
  Audition,
  Simple,
} from "../Model";
import PlayPause from "./PlayPause";
import SimpleControls from "./SimpleControls";
import AuditionControls from "./AuditionControls";
import ConversationControls from "./ConversationControls";
function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
export default ({
  sketch,
  voiceIndex,
  updateSketch,
}: {
  sketch: VoiceBoard;
  voiceIndex: VoiceIndex;
  updateSketch: (oldSketch: VoiceBoard, newSketch: VoiceBoard) => void;
}) => {
  const [activeUtteranceMoment, setActiveUtteranceMoment] = React.useState<
    UtteranceMoment | undefined
  >(undefined);
  return (
    <>
      <div style={{ flexGrow: 1 }}>
        <nav
          className="navbar bg-body-tertiary mb-2"
          style={{ position: "sticky", top: "0", zIndex: 3000 }}
        >
          <form
            className="container-fluid justify-content-between"
            style={{ flexWrap: "nowrap" }}
          >
            <Link className="btn btn-lg me-3" to="/">
              ‹
            </Link>
            <a
              className="navbar-brand flex-grow-1"
              style={{ textOverflow: "ellipsis", overflow: "hidden" }}
            >
              {sketch.name}
            </a>
          </form>
        </nav>

        <div className="container-fluid" style={{ paddingBottom: "4em" }}>
          {(() => {
            switch (sketch.type) {
              case "conversation":
                return (
                  <ConversationControls
                    conversation={sketch}
                    voiceIndex={voiceIndex!}
                    updateVoiceBoard={updateSketch}
                    activeUtteranceMoment={activeUtteranceMoment}
                    setActiveUtteranceMoment={setActiveUtteranceMoment}
                  />
                );
              case "simple":
                let simple: Simple = sketch;
                return <SimpleControls simple={simple} />;
              case "audition":
                return (
                  <AuditionControls
                    audition={sketch as Audition}
                    setAudition={(
                      oldAudition: Audition,
                      newAudition: Audition
                    ) => {
                      updateSketch(oldAudition, newAudition);
                    }}
                    voiceIndex={voiceIndex!}
                  />
                );
              default:
                assertUnreachable(sketch);
            }
          })()}
        </div>
        {!!sketch && sketch.type === "conversation" && (
          <div
            className="my-2 mx-5"
            style={{ position: "fixed", bottom: 0, right: 0, left: 0 }}
          >
            <PlayPause
              {...{
                conversation: sketch!,
                activeUtteranceMoment,
                setActiveUtteranceMoment,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};
