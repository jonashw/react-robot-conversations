import Avatar from "./Avatar";
import VoiceBadges from "./VoiceBadges";

import {Utterance, Voice} from "../Model";
export default ({
  voices,
  phrases,
  active,
  playSequence,
}: {
  voices: Voice[];
  phrases: string[];
  active: Utterance | undefined;
  playSequence: (utterances: Utterance[]) => void;
}) => (
  <>
    {voices.map((v, primaryIndex) => (
      <div>
        <div
          onClick={() =>
            playSequence(phrases.map((p) => ({ voice: v, phrase: p })))
          }
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
                  onClick={() => playSequence([{ voice: v, phrase: p }])}
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