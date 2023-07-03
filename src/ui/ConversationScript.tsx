import React from "react";

import { UtteranceMoment, Conversation } from "../Model";
import ConversationAudio from "../ConversationAudio";

export default ({
  conversation,
  activeUtteranceMoment,
  setActiveUtteranceMoment,
}: {
  conversation: Conversation;
  activeUtteranceMoment: UtteranceMoment | undefined;
  setActiveUtteranceMoment: (um: UtteranceMoment | undefined) => void;
}) => (
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
            {Object.entries(um.utteranceByCharacter).map(([c, u], uIndex) => (
              <tr
                key={uIndex}
                onClick={() => {
                  setActiveUtteranceMoment(um);
                  ConversationAudio.playMoment(conversation, um).then(() =>
                    setActiveUtteranceMoment(undefined)
                  );
                }}
              >
                <th>{conversation.characters[c].name}</th>
                <td style={{ width: "70%", textAlign: "left" }}>{u.phrase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);
