import React from "react";
import AudioRepository from "../AudioRepository";
import { UtteranceMoment, Character } from "../Model";
import Avatar from "./Avatar";

export default ({
  focusOnSpeakers,
  activeUtteranceMoment,
  characters,
}: {
  focusOnSpeakers: boolean;
  activeUtteranceMoment: UtteranceMoment | undefined;
  characters: { [v: string]: Character };
}) => {
  let characterIds = Object.keys(characters);

  if (focusOnSpeakers && activeUtteranceMoment !== undefined) {
    return (
      <div>
        <div className="d-flex justify-content-evenly text-center">
          {Object.keys(activeUtteranceMoment.utteranceByCharacter).map((c) => (
            <div>
              <Avatar
                emoji={characters[c].emoji}
                name={characters[c].name}
                size={"lg"}
              />
              {activeUtteranceMoment !== undefined &&
                c in activeUtteranceMoment.utteranceByCharacter && (
                  <div className="alert alert-primary mt-3">
                    {activeUtteranceMoment.utteranceByCharacter[c].label}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const characterSaysItsOwnVoice = (character: Character) => {
    AudioRepository.getAudioBlob([character.voice, character.name]).then(
      (blob) => {
        let a = new Audio(URL.createObjectURL(blob));
        a.play();
      }
    );
  };
  return (
    <div>
      <div className="d-flex justify-content-evenly text-center">
        {Object.entries(characters).map(([c, character]) => (
          <div
            style={{
              width: `${Math.floor(100 / characterIds.length)}%`,
            }}
            key={c}
          >
            <div onClick={() => characterSaysItsOwnVoice(character)}>
              <div className="me-2">
                <div className="h1">{character.emoji || "👤"}</div>
                {character.name}
              </div>
              {activeUtteranceMoment !== undefined &&
                c in activeUtteranceMoment.utteranceByCharacter && (
                  <div className="alert alert-primary mt-3">
                    {activeUtteranceMoment.utteranceByCharacter[c].label}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
