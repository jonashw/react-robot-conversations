import { Voice, Utterance } from "../Model";
import Avatar from "./Avatar";
import VoiceBadges from "./VoiceBadges";
export default ({
  phrases,
  voices,
  active,
  playSequence,
}: {
  phrases: string[];
  voices: Voice[];
  active: Utterance | undefined;
  playSequence: (utterances: Utterance[]) => void;
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
              playSequence(voices.map((voice) => ({ voice, phrase: p })));
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
              onClick={() => playSequence([{ voice: v, phrase: p }])}
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