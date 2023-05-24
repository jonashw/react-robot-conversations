import React from "react";
import Conversation from "./Conversation";
import VoiceList from "./VoiceList";
import {
  Voice,
  VoiceBoardSpec,
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
} from "../Model";

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
  React.useEffect(() => {
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
  }, [voiceBoard, voices]);
  return (
    <div>
      {(() => {
        switch (vb.type) {
          case "conversation":
            let conversation = vb;
            return (
              <Conversation
                {...{
                  conversation,
                  activeUtteranceMoment: activeUtteranceMoment,
                  setActiveUtteranceMoment: setActiveUtteranceMoment,
                }}
              />
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
