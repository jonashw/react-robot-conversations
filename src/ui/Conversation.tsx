import React from "react";
import AudioOutput from "../AudioOutput";
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
  let characterIds = Object.keys(conversation.characters);

  return (
    <div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th
              className="py-3 text-align-start"
              colSpan={2 + characterIds.length}
            >
              Characters
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>&nbsp;</td>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <td
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
              </td>
            ))}
            <td>
              <button className="btn" onClick={() => alert("not implemented")}>
                +
              </button>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <td key={character.name}>
                <input
                  type="text"
                  value={character.emoji}
                  className="form-control form-control-lg"
                  style={{
                    textAlign: "center",
                    fontSize: "calc(1.375rem + 1.5vw)",
                  }}
                />
              </td>
            ))}
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <td key={character.name}>{character.voice}</td>
            ))}
            <td>&nbsp;</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th
              className="py-3 text-align-start"
              colSpan={2 + characterIds.length}
            >
              Conversation
            </th>
          </tr>
        </tbody>
        <tbody className="py-1">
          {conversation.utteranceMoments.map((moment, mi) => (
            <tr
              key={mi}
              className={
                activeUtteranceMoment === moment ? "table-primary" : ""
              }
            >
              <td>
                <button className="btn">↑</button>
                <button className="btn">↓</button>
              </td>
              {characterIds.map((c) => (
                <td key={c}>
                  <div
                    className="text-align-center text-muted"
                    style={{ fontSize: "0.75em" }}
                  >
                    <textarea
                      value={moment.utteranceByCharacter[c]?.label}
                      rows={3}
                      className="form-control form-control-sm"
                    />
                  </div>
                </td>
              ))}
              <td>
                {activeUtteranceMoment === moment ? (
                  <button
                    className="btn"
                    onClick={() => conversation.playMoment(moment)}
                  >
                    <img src="/icons/stop.svg" style={{ height: "1em" }} />
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => conversation.playMoment(moment)}
                  >
                    <img src="/icons/play.svg" style={{ height: "1em" }} />
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
