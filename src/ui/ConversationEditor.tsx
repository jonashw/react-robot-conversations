import React from "react";
import {
  Utterance,
  UtteranceMoment,
  Conversation,
  Character,
  VoiceIndex,
} from "../Model";
import ConversationAudio from "../ConversationAudio";
import ConversationSideEffects from "./ConversationSideEffects";
import AudioOutput from "../AudioOutput";

export default ({
  voiceIndex,
  conversation,
  activeUtteranceMoment,
  setActiveUtteranceMoment,
  effect,
}: {
  voiceIndex: VoiceIndex;
  conversation: Conversation;
  activeUtteranceMoment: UtteranceMoment | undefined;
  setActiveUtteranceMoment: (aum: UtteranceMoment | undefined) => void;
  effect: ConversationSideEffects;
}) => {
  let characterIds = Object.keys(conversation.characters);

  return (
    <div>
      <input
        type="text"
        className="form-control"
        defaultValue={conversation.name}
        onBlur={(e) => {
          effect.updateConversation(conversation, {
            ...conversation,
            name: e.target.value,
          });
        }}
      />
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
          <tr style={{ position: "sticky", top: "4em" }} className="bg-success">
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
                  defaultValue={character.name}
                  onBlur={(e) =>
                    effect.updateCharacter(c, {
                      ...character,
                      name: e.target.value,
                    })
                  }
                  className="form-control"
                  style={{ textAlign: "center" }}
                />
              </td>
            ))}
            <td>
              <button
                className="btn btn-success"
                onClick={() => {
                  let newId = Math.random().toString();
                  let newCharacter = {
                    name: (
                      Object.keys(conversation.characters).length + 1
                    ).toString(),
                    voice: "Brian",
                  };
                  effect.updateConversation(conversation, {
                    ...conversation,
                    characters: {
                      ...conversation.characters,
                      [newId]: newCharacter,
                    },
                  });
                }}
              >
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
                  defaultValue={character.emoji}
                  className="form-control form-control-lg"
                  style={{
                    textAlign: "center",
                    fontSize: "calc(1.375rem + 1.5vw)",
                  }}
                  onChange={(e) =>
                    effect.updateCharacter(c, {
                      ...character,
                      emoji: e.target.value,
                    })
                  }
                />
              </td>
            ))}
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <td key={character.name}>
                <select
                  className="form-control"
                  defaultValue={character.voice}
                  onChange={(e) =>
                    effect.updateCharacter(c, {
                      ...character,
                      voice: e.target.value,
                    })
                  }
                >
                  {voiceIndex.getAll().map((v) => (
                    <option value={v.name}>{v.name}</option>
                  ))}
                </select>
              </td>
            ))}
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <td key={character.name}>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      if (confirm("Are you sure?")) {
                        effect.removeCharacter(c);
                      }
                    }}
                  >
                    &times;
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      AudioOutput.play([character.voice, character.name]);
                    }}
                  >
                    <img src="/icons/play.svg" style={{ height: "1em" }} />
                  </button>
                </div>
              </td>
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
              key={moment.id}
              className={
                activeUtteranceMoment === moment ? "table-primary" : ""
              }
            >
              <td>
                <div className="d-grid">
                  <div className="btn-group-vertical">
                    <button
                      disabled={mi === 0}
                      className="btn btn-secondary"
                      onClick={() => effect.moveMoment(moment, "up")}
                    >
                      ↑
                    </button>
                    <button
                      disabled={mi === conversation.utteranceMoments.length - 1}
                      className="btn btn-secondary"
                      onClick={() => effect.moveMoment(moment, "down")}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </td>
              {characterIds.map((c) => (
                <td key={c}>
                  <div
                    className="text-align-center text-muted"
                    style={{ fontSize: "0.75em" }}
                  >
                    <textarea
                      defaultValue={moment.utteranceByCharacter[c]?.phrase}
                      onBlur={(e) =>
                        effect.setCharacterUtterance(c, moment, e.target.value)
                      }
                      rows={3}
                      className="form-control form-control-sm"
                    />
                  </div>
                </td>
              ))}
              <td>
                <div className="d-grid">
                  <div className="btn-group-vertical">
                    {activeUtteranceMoment === moment ? (
                      <button
                        className="btn"
                        onClick={() => {
                          ConversationAudio.stopMoment(
                            conversation,
                            moment
                          ).then(() => setActiveUtteranceMoment(undefined));
                        }}
                      >
                        <img src="/icons/stop.svg" style={{ height: "1em" }} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setActiveUtteranceMoment(moment);
                          ConversationAudio.playMoment(
                            conversation,
                            moment
                          ).then(() => setActiveUtteranceMoment(undefined));
                        }}
                      >
                        <img src="/icons/play.svg" style={{ height: "1em" }} />
                      </button>
                    )}
                    {/*
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          removeMoment(moment);
                        }
                      }}
                    >
                      &times;
                    </button>
                    */}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-grid">
        <button className="btn btn-primary" onClick={effect.addMoment}>
          Add to the conversation
        </button>
      </div>
    </div>
  );
};
