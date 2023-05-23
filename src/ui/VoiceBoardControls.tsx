import React from "react";
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
  activeUtterance: Utterance | null;
  setActiveUtterance: (u: Utterance) => void;
  activeUtteranceMoment: UtteranceMoment | null;
  setActiveUtteranceMoment: (u: UtteranceMoment) => void;
}) => {
  let vb = voiceBoard;

  const [activeVoice, setActiveVoice] = React.useState<Voice | null>(null);
  React.useEffect(() => {
    setActiveVoice(null);
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
            let voiceAbbrevs = Object.keys(vb.voices);
            return (
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      {Object.values(vb.voices).map((v) => (
                        <th style={{ width: Math.floor(100 / 3) + "%" }}>
                          {v}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vb.utteranceMoments.map((moment) => (
                      <tr>
                        {voiceAbbrevs.map((v) =>
                          v in moment.utteranceByVoice ? (
                            <td>
                              <div className="d-grid">
                                <button
                                  className={
                                    "btn btn-lg " +
                                    (activeUtteranceMoment === moment
                                      ? "btn-primary"
                                      : "btn-outline-primary")
                                  }
                                  onClick={(e) => {
                                    e.currentTarget.blur();
                                    if (
                                      preventUtteranceOverlap &&
                                      !!activeUtteranceMoment
                                    ) {
                                      activeUtteranceMoment.stop(
                                        activeUtteranceMoment
                                      );
                                    }

                                    moment.play(moment);
                                    setActiveUtteranceMoment(moment);
                                  }}
                                >
                                  {moment.utteranceByVoice[v].label}
                                </button>
                              </div>
                            </td>
                          ) : (
                            <td></td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "board":
            return (
              <div>
                <table className="table table-bordered">
                  <tbody>
                    {Object.entries(vb.utterances).map(
                      ([voice, voiceUtterances]) => (
                        <tr
                          className={
                            activeVoice === voices[voice] ? "table-primary" : ""
                          }
                          onClick={() => setActiveVoice(voices[voice])}
                        >
                          <td>
                            <input
                              type="radio"
                              checked={activeVoice === voices[voice]}
                            />
                          </td>
                          <td>{voice}</td>
                          {[
                            (v: Voice) => v.age,
                            (v: Voice) => v.gender,
                            (v: Voice) => v.lang,
                          ].map((key) => (
                            <td>
                              <span className="badge text-bg-secondary">
                                {key(voices[voice])}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
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
