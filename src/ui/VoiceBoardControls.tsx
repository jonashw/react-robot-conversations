import React, { DependencyList, EffectCallback } from "react";
import ConversationEditor from "./ConversationEditor";
import VoiceList from "./VoiceList";
import PlayPause from "./PlayPause";
import Stage from "./Stage";
import {
  Voice,
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
  Board,
  Conversation,
} from "../Model";
import ConversationAudio from "../ConversationAudio";

const reactTo = (deps: DependencyList, effect: EffectCallback) => {
  React.useEffect(effect, deps);
};

export default ({
  voices,
  voiceBoard,
  updateVoiceBoard,
  preventUtteranceOverlap,
  activeUtterance,
  setActiveUtterance,
  activeUtteranceMoment,
  setActiveUtteranceMoment,
}: {
  voices: VoiceIndex;
  updateVoiceBoard: (prev: VoiceBoard, next: VoiceBoard) => void;
  voiceBoard: VoiceBoard;
  preventUtteranceOverlap: boolean;
  activeUtterance: Utterance | undefined;
  setActiveUtterance: (u: Utterance | undefined) => void;
  activeUtteranceMoment: UtteranceMoment | undefined;
  setActiveUtteranceMoment: (u: UtteranceMoment | undefined) => void;
}) => {
  let vb = voiceBoard;

  const [activeVoice, setActiveVoice] = React.useState<Voice | undefined>(
    undefined
  );
  type BoardControlState = "editing" | "playing" | "script";

  const [controlState, setControlState] =
    React.useState<BoardControlState>("playing");
  const [focusOnSpeakers, setFocusOnSpeakers] = React.useState<boolean>(true);

  reactTo([voiceBoard], () => {
    //    setEditing(false);
    if (!!activeUtteranceMoment) {
      if (vb.type === "conversation") {
        ConversationAudio.stopMoment(vb, activeUtteranceMoment).then(() =>
          setActiveUtteranceMoment(undefined)
        );
      }
    }
  });

  reactTo([voiceBoard, voices], () => {
    setActiveVoice(undefined);
    if (voiceBoard.type === "board") {
      let voiceNames = Object.keys(voiceBoard.utterances);
      if (voiceNames.length === 0) {
        return;
      }
      if (!(voiceNames[0] in voices)) {
        return;
      }
      setActiveVoice(voices[voiceNames[0]]);
    }
  });

  return (
    <div>
      {(() => {
        switch (vb.type) {
          case "conversation":
            const conversation = vb;

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
                        className={
                          "nav-link" + (state === controlState ? " active" : "")
                        }
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
                                    ConversationAudio.playMoment(
                                      conversation,
                                      um
                                    ).then(() =>
                                      setActiveUtteranceMoment(undefined)
                                    );
                                  }}
                                >
                                  <th>{conversation.characters[c].name}</th>
                                  <td
                                    style={{ width: "70%", textAlign: "left" }}
                                  >
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
                            onChange={(e) =>
                              setFocusOnSpeakers(e.target.checked)
                            }
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
                      updateConversation: (
                        prev: Conversation,
                        next: Conversation
                      ) => updateVoiceBoard(prev, next),
                      activeUtteranceMoment: activeUtteranceMoment,
                      setActiveUtteranceMoment: setActiveUtteranceMoment,
                    }}
                  />
                )}
              </>
            );
          case "board":
            let board: Board = vb;
            return (
              <div>
                <VoiceList
                  voices={Object.fromEntries(
                    Object.keys(vb.utterances).map((v) => [v, voices[v]])
                  )}
                  selected={activeVoice}
                  setSelected={(s: Voice | undefined) => setActiveVoice(s)}
                />
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
                                    board.stop(activeUtterance);
                                    setActiveUtterance(undefined);
                                  }
                                  board.play(u);
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
