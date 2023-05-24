import React from "react";
import {
  Voice,
  VoiceBoardSpec,
  VoiceBoard,
  VoiceIndex,
  Utterance,
  UtteranceMoment,
  Conversation,
} from "../Model";

export default ({
  conversation,
  activeUtteranceMoment,
  setActiveUtteranceMoment,
}: {
  conversation: Conversation;
  activeUtteranceMoment: UtteranceMoment | undefined;
  setActiveUtteranceMoment: (aum: UtteranceMoment | undefined) => void;
}) => {
  let preventUtteranceOverlap = true;
  let voiceAbbrevs = Object.keys(conversation.voices);
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            {Object.values(conversation.voices).map((v) => (
              <th style={{ width: Math.floor(100 / 3) + "%" }} key={v}>
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {conversation.utteranceMoments.map((moment, mi) => (
            <tr key={mi}>
              {voiceAbbrevs.map((v) =>
                v in moment.utteranceByVoice ? (
                  <td key={v}>
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
                            activeUtteranceMoment.stop(activeUtteranceMoment);
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
                  <td key={v}></td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
