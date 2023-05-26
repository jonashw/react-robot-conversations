import React from "react";
import { UtteranceMoment, Conversation, Character } from "../Model";
import ConversationAudio from "../ConversationAudio";
export default ({
  conversation,
  updateConversation,
  activeUtteranceMoment,
  setActiveUtteranceMoment,
}: {
  conversation: Conversation;
  updateConversation: (prev: Conversation, next: Conversation) => void;
  activeUtteranceMoment: UtteranceMoment | undefined;
  setActiveUtteranceMoment: (aum: UtteranceMoment | undefined) => void;
}) => {
  let characterIds = Object.keys(conversation.characters);
  const updateCharacter = (characterId: string, next: Character) => {
    updateConversation(conversation, {
      ...conversation,
      characters: { ...conversation.characters, [characterId]: next },
    });
  };
  const removeCharacter = (characterId: string) => {
    let updatedCharacters = { ...conversation.characters };
    delete updatedCharacters[characterId];
    let updatedMoments = [...conversation.utteranceMoments];
    for (let m of updatedMoments) {
      delete m.utteranceByCharacter[characterId];
    }
    updatedMoments = updatedMoments.filter(
      (m) => Object.keys(m.utteranceByCharacter).length > 0
    );
    updateConversation(conversation, {
      ...conversation,
      characters: updatedCharacters,
      utteranceMoments: updatedMoments,
    });
  };
  const removeMoment = (momentToRemove: UtteranceMoment) => {
    updateConversation(conversation, {
      ...conversation,
      utteranceMoments: conversation.utteranceMoments.filter(
        (moment) => moment !== momentToRemove
      ),
    });
  };
  const addMoment = () => {
    let updatedConversation = {
      ...conversation,
      utteranceMoments: [
        ...conversation.utteranceMoments,
        {
          utteranceByCharacter: {},
          id: Math.random().toString(),
        },
      ],
    };
    updateConversation(conversation, updatedConversation);
  };
  const moveMoment = (moment: UtteranceMoment, direction: "up" | "down") => {
    let prevIndex = conversation.utteranceMoments.indexOf(moment);
    if (prevIndex === -1) {
      return;
    }
    let indexOffset = direction === "up" ? -1 : 1;
    let nextIndex = prevIndex + indexOffset;
    if (nextIndex >= conversation.utteranceMoments.length) {
      nextIndex = prevIndex;
    }
    if (nextIndex < 0) {
      nextIndex = 0;
    }
    let updatedMoments = [...conversation.utteranceMoments];
    let otherMoment = updatedMoments[nextIndex];
    updatedMoments[nextIndex] = moment;
    updatedMoments[prevIndex] = otherMoment;
    updateConversation(conversation, {
      ...conversation,
      utteranceMoments: updatedMoments,
    });
  };
  const setCharacterUtterance = (
    characterId: string,
    moment: UtteranceMoment,
    message: string
  ) => {
    {
      let updatedMoment = {
        ...moment,
        utteranceByCharacter: {
          ...moment.utteranceByCharacter,
          [characterId]: {
            voice: conversation.characters[characterId].voice,
            label: message,
          },
        },
      };
      updateConversation(conversation, {
        ...conversation,
        utteranceMoments: conversation.utteranceMoments.map((um) =>
          um === moment ? updatedMoment : um
        ),
      });
    }
  };
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
                  defaultValue={character.name}
                  onBlur={(e) =>
                    updateCharacter(c, {
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
                className="btn"
                onClick={() => {
                  let newId = Math.random().toString();
                  let newCharacter = {
                    name: (
                      Object.keys(conversation.characters).length + 1
                    ).toString(),
                    voice: "Brian",
                  };
                  updateConversation(conversation, {
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
                    updateCharacter(c, {
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
              <td key={character.name}>{character.voice}</td>
            ))}
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            {Object.entries(conversation.characters).map(([c, character]) => (
              <td key={character.name}>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (confirm("Are you sure?")) {
                      removeCharacter(c);
                    }
                  }}
                >
                  &times;
                </button>
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
                <button
                  disabled={mi === 0}
                  className="btn"
                  onClick={() => moveMoment(moment, "up")}
                >
                  ↑
                </button>
                <button
                  disabled={mi === conversation.utteranceMoments.length - 1}
                  className="btn"
                  onClick={() => moveMoment(moment, "down")}
                >
                  ↓
                </button>
              </td>
              {characterIds.map((c) => (
                <td key={c}>
                  <div
                    className="text-align-center text-muted"
                    style={{ fontSize: "0.75em" }}
                  >
                    <textarea
                      defaultValue={moment.utteranceByCharacter[c]?.label}
                      onBlur={(e) =>
                        setCharacterUtterance(c, moment, e.target.value)
                      }
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
                    onClick={() => {
                      ConversationAudio.stopMoment(conversation, moment).then(
                        () => setActiveUtteranceMoment(undefined)
                      );
                    }}
                  >
                    <img src="/icons/stop.svg" style={{ height: "1em" }} />
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => {
                      setActiveUtteranceMoment(moment);
                      ConversationAudio.playMoment(conversation, moment).then(
                        () => setActiveUtteranceMoment(undefined)
                      );
                    }}
                  >
                    <img src="/icons/play.svg" style={{ height: "1em" }} />
                  </button>
                )}
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (confirm("Are you sure?")) {
                      removeMoment(moment);
                    }
                  }}
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-grid">
        <button className="btn btn-primary" onClick={addMoment}>
          Add to the conversation
        </button>
      </div>
    </div>
  );
};
