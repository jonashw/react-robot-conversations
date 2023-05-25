import React from "react";
import { UtteranceMoment, Conversation } from "../Model";

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
  let characterIds = Object.keys(conversation.characters);
  const [looping, setLooping] = React.useState<boolean>(false);
  return (
    <div>
      <table className="table table-sm">
        <thead>
          <tr>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <th
                style={{
                  width:
                    Math.floor(
                      100 / Object.entries(conversation.characters).length
                    ) + "%",
                }}
                key={character.name}
              >
                <input
                  type="text"
                  value={character.name}
                  className="form-control"
                  style={{ textAlign: "center" }}
                />
              </th>
            ))}
            <th>
              <button className="btn" onClick={() => alert("not implemented")}>
                +
              </button>
            </th>
          </tr>
          <tr>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <th key={character.name} style={{ fontWeight: "normal" }}>
                <input
                  type="text"
                  value={character.emoji}
                  className="form-control form-control-lg"
                  style={{
                    textAlign: "center",
                    fontSize: "calc(1.375rem + 1.5vw)",
                  }}
                />
              </th>
            ))}
            <th>&nbsp;</th>
          </tr>
          <tr>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <th key={character.name} style={{ fontWeight: "normal" }}>
                {character.voice}
              </th>
            ))}
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {conversation.utteranceMoments.map((moment, mi) => (
            <tr
              key={mi}
              className={
                activeUtteranceMoment === moment ? "table-primary" : ""
              }
            >
              {characterIds.map((c) =>
                c in moment.utteranceByCharacter ? (
                  <td key={c}>
                    <div
                      className="text-align-center text-muted"
                      style={{ fontSize: "0.75em" }}
                    >
                      <textarea
                        value={moment.utteranceByCharacter[c].label}
                        rows={3}
                        className="form-control form-control-sm"
                      />
                    </div>
                  </td>
                ) : (
                  <td key={c}></td>
                )
              )}
              <td>
                {activeUtteranceMoment === moment ? (
                  <button className="btn" onClick={() => moment.stop(moment)}>
                    ⏹
                  </button>
                ) : (
                  <button className="btn" onClick={() => moment.play(moment)}>
                    ⏵
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
