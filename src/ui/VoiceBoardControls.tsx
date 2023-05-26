import React, { DependencyList, EffectCallback } from "react";
import ConversationEditor from "./ConversationEditor";
import VoiceList from "./VoiceList";
import AudioRepository from "../AudioRepository";

import Stage from "./Stage";
import {
  Voice,
  SketchSpecification,
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
  Character,
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
            const playing = !!activeUtteranceMoment;
            const stopped = !playing;

            return (
              <>
                <ul className="nav nav-tabs mb-2">
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
                    <div className="d-flex align-items-center justify-content-around my-5">
                      <div className="btn-group">
                        {(
                          [
                            [
                              playing,
                              () =>
                                ConversationAudio.play(
                                  conversation,
                                  setActiveUtteranceMoment
                                ),
                              "/icons/play.svg",
                            ],
                            [
                              stopped,
                              () =>
                                ConversationAudio.stop(conversation).then(() =>
                                  setActiveUtteranceMoment(undefined)
                                ),
                              "/icons/stop.svg",
                            ],
                          ] as [boolean, () => void, string][]
                        ).map(([active, onClick, iconSrc]) => (
                          <button
                            disabled={active}
                            className={
                              "btn btn-lg " +
                              (active
                                ? "btn-primary active"
                                : "btn-outline-primary")
                            }
                            onClick={onClick}
                          >
                            <img
                              src={iconSrc}
                              style={{
                                height: "1em",
                                filter: active ? "invert(1)" : "",
                              }}
                            />
                          </button>
                        ))}
                      </div>

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
                    <Stage
                      focusOnSpeakers={focusOnSpeakers}
                      characters={conversation.characters}
                      activeUtteranceMoment={activeUtteranceMoment}
                    />
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
