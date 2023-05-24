import React, { DependencyList, EffectCallback } from "react";
import Conversation from "./Conversation";
import VoiceList from "./VoiceList";

import Stage from "./Stage";
import {
  Voice,
  VoiceBoardSpec,
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
} from "../Model";

const reactTo = (deps: DependencyList, effect: EffectCallback) => {
  React.useEffect(effect, deps);
};

export default ({
  voices,
  voiceBoard,
  preventUtteranceOverlap,
  activeUtterance,
  setActiveUtterance,
  activeUtteranceMoment,
  setActiveUtteranceMoment,
}: {
  voices: VoiceIndex;
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

  const [editing, setEditing] = React.useState<boolean>(false);

  reactTo([voiceBoard], () => {
    setEditing(false);
    if (!!activeUtteranceMoment) {
      activeUtteranceMoment.stop(activeUtteranceMoment);
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
            const play = () => {
              if (conversation.utteranceMoments.length > 0) {
                let um = conversation.utteranceMoments[0];
                um.play(um);
              }
            };
            const stop = () => {
              if (!!activeUtteranceMoment) {
                activeUtteranceMoment.stop(activeUtteranceMoment);
                setActiveUtteranceMoment(undefined);
              }
            };
            return (
              <>
                <ul className="nav nav-tabs">
                  {(
                    [
                      ["Viewing", !editing],
                      ["Editing", editing],
                    ] as [string, boolean][]
                  ).map(([label, active]) => (
                    <li className="nav-item">
                      <a
                        href="javascript:void(0)"
                        onClick={() => setEditing(!editing)}
                        className={"nav-link" + (active ? " active" : "")}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>

                {!editing && (
                  <>
                    <div className="btn-group my-5">
                      {(
                        [
                          [playing, play, "/icons/play.svg"],
                          [stopped, stop, "/icons/stop.svg"],
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
                    <Stage
                      characters={conversation.characters}
                      activeUtteranceMoment={activeUtteranceMoment}
                    />
                  </>
                )}
                {editing && (
                  <Conversation
                    {...{
                      conversation,
                      activeUtteranceMoment: activeUtteranceMoment,
                      setActiveUtteranceMoment: setActiveUtteranceMoment,
                    }}
                  />
                )}
              </>
            );
          case "board":
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
                                    activeUtterance.stop();
                                  }
                                  u.play(u);
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
