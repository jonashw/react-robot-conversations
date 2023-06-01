import React from "react";
import {
  Utterance,
  UtteranceMoment,
  Conversation,
  Character,
  VoiceIndex,
  Voice,
  FacetedSpecification,
  Audition,
} from "../Model";
import Avatar from "./Avatar";
import "./AuditionControls.scss";
import Audio from "../CrossAudio";
import VoiceBadges from "./VoiceBadges";

const getMatchingVoices = (
  voiceIndex: VoiceIndex,
  voiceSpecifications: FacetedSpecification
): Voice[] => {
  let facetedPredicates = Object.entries(voiceSpecifications).map(
    ([facetId, matchingAnyOfValues]: [string, string[]]) =>
      (item: FacetedSpecification) => {
        let values = item[facetId] || [];
        return (
          values.length > 0 &&
          values.some((value) => matchingAnyOfValues.indexOf(value) > -1)
        );
      }
  );
  let auditioningVoiceIds = Object.values(voiceIndex)
    .map((voice) => ({
      name: voice.name,
      tags: {
        ["lang"]: [voice.lang],
        ["gender"]: [voice.gender],
        ["age"]: [voice.age],
      },
    }))
    .reduce(
      (matches, voice) => {
        let isMatch = facetedPredicates.every((predicate) =>
          predicate(voice.tags)
        );
        console.log({ isMatch, voice, voiceSpecifications });
        return isMatch ? matches.add(voice.name) : matches;
      },

      new Set<string>()
    );
  return Array.from(auditioningVoiceIds)
    .map((voiceId) => voiceIndex[voiceId])
    .filter((v) => v !== undefined);
};

export default ({
  audition,
  setAudition,
  voiceIndex,
}: {
  audition: Audition;
  setAudition: (oldAudition: Audition, newAudition: Audition) => void;
  voiceIndex: VoiceIndex;
}) => {
  let auditioningVoices = getMatchingVoices(
    voiceIndex,
    audition.voiceSpecifications
  );
  const [primaryDimension, setPrimaryDimension] =
    React.useState<string>("phrase");

  const byVoice = () => (
    <>
      {auditioningVoices.map((v, primaryIndex) => (
        <>
          <div className="row">
            <div className="col text-center">
              <Avatar emoji={"😊"} name={v.name} />
              <VoiceBadges voice={v} />
            </div>
            <div className="col">
              <div>
                {audition.phrases.map((p) => (
                  <div className="row">
                    <div className="col">
                      <button
                        className="btn btn-primary btn-lg speech-bubble speech-bubble-right speech-bubble-primary mb-3"
                        onClick={() =>
                          Audio.playUtterance({ voice: v.name, label: p })
                        }
                      >
                        {p}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {primaryIndex < auditioningVoices.length - 1 && <hr className="hr" />}
        </>
      ))}
    </>
  );

  const byPhrase = () => (
    <div>
      {audition.phrases.map((p, primaryIndex) => (
        <>
          {primaryIndex > 0 && <hr className="hr border-0" />}
          <div className="d-grid mb-4">
            <div className="btn btn-primary btn-lg speech-bubble speech-bubble-top speech-bubble-primary">
              {p}
            </div>
          </div>

          <div className="list-group">
            {auditioningVoices.map((v) => (
              <div
                className="list-group-item d-flex justify-content-between align-items-center"
                onClick={() => Audio.playUtterance({ voice: v.name, label: p })}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <Avatar emoji={"😊"} size="md" />
                    <div>{v.name}</div>
                  </div>
                </div>
                <div>
                  <VoiceBadges
                    voice={v}
                    asTable={false}
                    vertical={true}
                    variant={"secondary"}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  );

  return (
    <div>
      <ul className="nav nav-pills nav-fill">
        {(
          [
            { label: "By Voice", value: "voice" },
            { label: "By Phrase", value: "phrase" },
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
      <div className="mt-2">
        {primaryDimension === "voice" ? byVoice() : byPhrase()}
      </div>
    </div>
  );
};
