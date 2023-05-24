import React from "react";
import { UtteranceMoment, Character } from "../Model";

export default ({
  activeUtteranceMoment,
  characters,
}: {
  activeUtteranceMoment: UtteranceMoment | undefined;
  characters: { [v: string]: Character };
}) => {
  let voiceAbbreviations = Object.keys(characters);
  return (
    <div>
      <div className="d-flex justify-content-evenly">
        {Object.entries(characters).map(([v, character]) => (
          <div
            style={{
              width: `${Math.floor(100 / voiceAbbreviations.length)}%`,
            }}
            key={v}
          >
            <div>
              <div className="me-2">
                <h1>{character.emoji || "👤"}</h1>
                {character.name}
              </div>
              {activeUtteranceMoment !== undefined &&
                v in activeUtteranceMoment.utteranceByVoice && (
                  <div className="alert alert-primary">
                    {activeUtteranceMoment.utteranceByVoice[v].label}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
