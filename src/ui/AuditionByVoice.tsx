import React from "react";
import Avatar from "./Avatar";
import VoiceBadges from "./VoiceBadges";
import { Utterance, Voice } from "../Model";
import SortableListGroup from "./SortableListGroup";
import { UniqueIdentifier } from "@dnd-kit/core";
import Modal from "./Modal";
export default ({
  voices,
  setVoices,
  phrases,
  active,
  playSequence,
}: {
  voices: Voice[];
  setVoices: (voices: Voice[]) => void;
  phrases: string[];
  active: Utterance | undefined;
  playSequence: (utterances: Utterance[]) => void;
}) => {
  const [sortModalShown, setSortModalShown] = React.useState<boolean>(false);

  return (
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
                <div className="text-end">
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
      <Modal
        title="Re-order the phrases"
        shown={sortModalShown}
        setShown={setSortModalShown}
      >
        <SortableListGroup
          items={voices}
          setItems={setVoices}
          getItemLabel={(v: Voice) => v.name}
        />
      </Modal>
      <button
        onClick={() => setSortModalShown(true)}
        className="btn btn-success"
      >
        ↕️ Re-order voices
      </button>
    </>
  );
};
