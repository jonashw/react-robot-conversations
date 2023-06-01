import React from "react";
import {
  UtteranceMoment,
  Conversation,
  Character,
  VoiceIndex,
  Voice,
  FacetedSpecification,
  Audition,
  UtteranceId,
} from "../Model";
import Avatar from "./Avatar";
import "./AuditionControls.scss";
import Audio from "../CrossAudio";
import VoiceBadges from "./VoiceBadges";
import AudioOutput from "../AudioOutput";

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

const AuditionByPhrase = ({
  phrases,
  voices,
  say,
  active,
  setActive,
}: {
  phrases: string[];
  voices: Voice[];
  say: (voiceId: Voice, phrase: string) => void;
  active: Utterance | undefined;
  setActive: (a: Utterance | undefined) => void;
}) => (
  <>
    {phrases.map((p, primaryIndex) => (
      <div>
        <div
          className="d-grid"
          style={{
            position: "sticky",
            top: "8em",
            zIndex: 1000 + primaryIndex,
            marginBottom: "-20px",
          }}
        >
          <button
            className="btn btn-primary btn-lg speech-bubble speech-bubble-top speech-bubble-primary"
            onClick={() => {
              let ids = voices.map((v) => [v.name, p] as UtteranceId);
              AudioOutput.playInSequence(ids, (i) => {
                if (i === undefined) {
                  setActive(undefined);
                } else {
                  setActive({ voice: voices[i], phrase: p });
                }
              });
            }}
          >
            {p}
          </button>
        </div>

        <div className="list-group mb-4">
          {voices.map((v) => (
            <div
              className={
                (!!active && active.voice === v && active.phrase === p
                  ? "active "
                  : "") +
                "list-group-item d-flex justify-content-between align-items-center"
              }
              onClick={() => say(v, p)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <div className="d-flex align-items-center gap-2">
                  <Avatar emoji={""} size="md" />
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
      </div>
    ))}
  </>
);

const ByVoice = ({
  voices,
  phrases,
  say,
  active,
  setActive,
}: {
  voices: Voice[];
  phrases: string[];
  say: (voiceId: Voice, phrase: string) => void;
  active: Utterance | undefined;
  setActive: (a: Utterance | undefined) => void;
}) => (
  <>
    {voices.map((v, primaryIndex) => (
      <div>
        <div
          onClick={() => {
            let ids = phrases.map((p) => [v.name, p] as UtteranceId);
            AudioOutput.playInSequence(ids, (i) => {
              if (i === undefined) {
                setActive(undefined);
              } else {
                setActive({ voice: v, phrase: phrases[i] });
              }
            });
          }}
          className="text-center"
          style={{
            background: "var(--bs-body-bg)",
            position: "sticky",
            top: "8em",
            zIndex: 1000 + primaryIndex,
            cursor: "pointer",
          }}
        >
          <Avatar emoji={""} name={v.name} />
          <VoiceBadges voice={v} />
        </div>
        <div>
          <div>
            {phrases.map((p) => (
              <div>
                <button
                  className={
                    (!!active && active.voice === v && active.phrase === p
                      ? "active "
                      : "") +
                    "btn btn-primary btn-lg speech-bubble speech-bubble-right speech-bubble-primary mb-2"
                  }
                  onClick={() => say(v, p)}
                >
                  {p}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </>
);

type Utterance = {
  voice: Voice;
  phrase: string;
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
  const [active, setActive] = React.useState<Utterance | undefined>(undefined);
  const settings = {
    voices: auditioningVoices,
    phrases: audition.phrases,
    say: (voice: Voice, phrase: string) => {
      setActive({ voice, phrase });
      Audio.playUtterance({ voice: voice.name, label: phrase }).then(() =>
        setActive(undefined)
      );
    },
    active,
    setActive,
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
          <ByVoice {...settings} />
        ) : (
          <AuditionByPhrase {...settings} />
        )}
      </div>
    </div>
  );
};
