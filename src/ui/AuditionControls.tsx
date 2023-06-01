import React from "react";
import { VoiceIndex, Audition, UtteranceId, Utterance, Voice } from "../Model";
import "./AuditionControls.scss";

import AudioOutput from "../AudioOutput";
import AuditionByPhrase from "./AuditionByPhrase";
import AuditionMatrix from "./AuditionMatrix";
import AuditionByVoice from "./AuditionByVoice";

export default ({
  audition,
  setAudition,
  voiceIndex,
}: {
  audition: Audition;
  setAudition: (oldAudition: Audition, newAudition: Audition) => void;
  voiceIndex: VoiceIndex;
}) => {
  let auditioningVoices: Voice[] =
    audition.voices.type === "faceted-specification"
      ? voiceIndex.getMatchingVoices(
          voiceIndex,
          audition.voices.facetedSpecification
        )
      : audition.voices.array;
  console.log({ auditioningVoices, voices: audition.voices });
  const [primaryDimension, setPrimaryDimension] =
    React.useState<string>("phrase");
  const [active, setActive] = React.useState<Utterance | undefined>(undefined);
  const settings = {
    voices: auditioningVoices,
    phrases: audition.phrases,
    active,
    setActive,
    playSequence: (utterances: Utterance[]) => {
      let ids = utterances.map(
        ({ voice, phrase }) => [voice.name, phrase] as UtteranceId
      );
      AudioOutput.playInSequence(ids, (i) => {
        if (i === undefined) {
          setActive(undefined);
        } else {
          setActive(utterances[i]);
        }
      });
    },
  };

  return (
    <div>
      <ul
        className="nav nav-pills nav-fill"
        style={{
          position: "sticky",
          top: "4em",
          background: "var(--bs-body-bg)",
          padding: "0.5em 0  1em 0",
          margin: "-0.5em 0 -1em 0",
          zIndex: 2000,
        }}
      >
        {(
          [
            { label: "By Phrase", value: "phrase" },
            { label: "By Voice", value: "voice" },
            { label: "Matrix", value: "matrix" },
          ] as { label: string; value: "value" | "phrase" }[]
        ).map(({ label, value }) => (
          <li className="nav-item">
            <a
              onClick={(e) => {
                e.preventDefault();
                setPrimaryDimension(value);
              }}
              href="#"
              className={
                "nav-link" + (value === primaryDimension ? " active" : "")
              }
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-2" style={{ position: "relative" }}>
        {primaryDimension === "voice" ? (
          <AuditionByVoice {...settings} />
        ) : primaryDimension === "phrase" ? (
          <AuditionByPhrase {...settings} />
        ) : (
          <AuditionMatrix {...settings} />
        )}
      </div>
    </div>
  );
};
