import React, { DependencyList, EffectCallback } from "react";
import VoiceList from "./VoiceList";
import { Voice, VoiceIndex, Utterance, Cross } from "../Model";
import CrossAudio from "../CrossAudio";

const reactTo = (deps: DependencyList, effect: EffectCallback) => {
  React.useEffect(effect, deps);
};

export default ({
  voices,
  cross,
  preventUtteranceOverlap,
  activeUtterance,
  setActiveUtterance,
}: {
  voices: VoiceIndex;
  cross: Cross;
  preventUtteranceOverlap: boolean;
  activeUtterance: Utterance | undefined;
  setActiveUtterance: (u: Utterance | undefined) => void;
}) => {
  const [activeVoice, setActiveVoice] = React.useState<Voice | undefined>(
    undefined
  );

  reactTo([cross, voices], () => {
    setActiveVoice(undefined);
    let voiceNames = cross.voices;
    if (cross.voices.length === 0) {
      return;
    }
    if (!(voiceNames[0] in voices)) {
      return;
    }
    setActiveVoice(voices[voiceNames[0]]);
  });

  return (
    <>
      <div>
        <VoiceList
          voices={Object.fromEntries(cross.voices.map((v) => [v, voices[v]]))}
          selected={activeVoice}
          setSelected={(s: Voice | undefined) => setActiveVoice(s)}
        />
      </div>
      {!!activeVoice && (
        <div style={{ marginTop: "1em" }}>
          <div style={{ marginTop: "1em" }} className="d-flex flex-wrap">
            {cross.phrases.map((phrase) => (
              <button
                className="btn btn-lg btn-outline-primary"
                style={{
                  display: "block",
                  width: "48%",
                  margin: "1%",
                }}
                onClick={() => {
                  let u = {
                    voice: activeVoice.name,
                    label: phrase,
                  };
                  if (preventUtteranceOverlap && !!activeUtterance) {
                    CrossAudio.stopUtterance(activeUtterance);
                  }
                  CrossAudio.playUtterance(u);
                  setActiveUtterance(u);
                }}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
