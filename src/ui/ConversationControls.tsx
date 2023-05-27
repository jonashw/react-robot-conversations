import React, { DependencyList, EffectCallback } from "react";
import ConversationEditor from "./ConversationEditor";
import Stage from "./Stage";
import {
  Voice,
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
  Conversation,
} from "../Model";
import ConversationAudio from "../ConversationAudio";

export default ({
  conversation,
  voices,
  updateVoiceBoard,
  activeUtteranceMoment,
  setActiveUtteranceMoment,
}: {
  conversation: Conversation;
  voices: VoiceIndex;
  updateVoiceBoard: (prev: VoiceBoard, next: VoiceBoard) => void;
  activeUtteranceMoment: UtteranceMoment | undefined;
  setActiveUtteranceMoment: (u: UtteranceMoment | undefined) => void;
}) => {
  React.useEffect(() => {
    //    setEditing(false);
    if (!!activeUtteranceMoment) {
      ConversationAudio.stopMoment(conversation, activeUtteranceMoment).then(
        () => setActiveUtteranceMoment(undefined)
      );
    }
  }, [conversation]);

  type BoardControlState = "editing" | "playing" | "script";

  const [controlState, setControlState] =
    React.useState<BoardControlState>("playing");
  const [focusOnSpeakers, setFocusOnSpeakers] = React.useState<boolean>(true);

  return (
    <>
      <ul className="nav nav-tabs nav-fill mb-2">
        {(
          [
            ["Viewing", "playing"],
            ["Editing", "editing"],
            ["Script", "script"],
          ] as [string, BoardControlState][]
        ).map(([label, state]) => (
          <li className="nav-item">
            <a
              href="javascript:void(0)"
              onClick={() => setControlState(state)}
              className={"nav-link" + (state === controlState ? " active" : "")}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      {controlState === "script" && (
        <div>
          {conversation.utteranceMoments.map((um, momentIndex) => (
            <div
              className={
                "card mb-2" +
                (activeUtteranceMoment === um
                  ? " bg-primary bg-gradient text-white"
                  : "")
              }
            >
              <table className="table table-borderless m-0">
                <tbody>
                  {Object.entries(um.utteranceByCharacter).map(
                    ([c, u], uIndex) => (
                      <tr
                        key={uIndex}
                        onClick={() => {
                          setActiveUtteranceMoment(um);
                          ConversationAudio.playMoment(conversation, um).then(
                            () => setActiveUtteranceMoment(undefined)
                          );
                        }}
                      >
                        <th>{conversation.characters[c].name}</th>
                        <td style={{ width: "70%", textAlign: "left" }}>
                          {u.label}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      {controlState === "playing" && (
        <>
          <div className="mt-5">
            <Stage
              focusOnSpeakers={focusOnSpeakers}
              characters={conversation.characters}
              activeUtteranceMoment={activeUtteranceMoment}
            />
          </div>
          <div
            style={{
              position: "fixed",
              bottom: "4em",
              left: 0,
              right: 0,
            }}
            className="my-2"
          >
            <div className="d-flex justify-content-center">
              <div className="form-check d-inline-block">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={focusOnSpeakers}
                  onChange={(e) => setFocusOnSpeakers(e.target.checked)}
                  id="focus_on_speakers_checkbox"
                />
                <label
                  className="form-check-label"
                  htmlFor="focus_on_speakers_checkbox"
                >
                  Focus on speaker(s)
                </label>
              </div>
            </div>
          </div>
        </>
      )}
      {controlState === "editing" && (
        <ConversationEditor
          {...{
            conversation,
            updateConversation: (prev: Conversation, next: Conversation) =>
              updateVoiceBoard(prev, next),
            activeUtteranceMoment: activeUtteranceMoment,
            setActiveUtteranceMoment: setActiveUtteranceMoment,
          }}
        />
      )}
    </>
  );
};
