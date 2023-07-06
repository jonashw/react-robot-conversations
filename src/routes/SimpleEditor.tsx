import React from "react";
import { VoiceIndex, Simple, Voice } from "../Model";
import VoiceSelectorModal from "./VoiceSelectorModal";
import SortableListGroup from "../ui/SortableListGroup";

export default ({
  sketch,
  voiceIndex,
  setSketch,
}: {
  sketch: Simple;
  voiceIndex: VoiceIndex;
  setSketch: (s: Simple) => void;
}) => {
  const [voiceSelectorModalShown, setVoiceSelectorModalShown] =
    React.useState(false);
  return (
    <>
      <VoiceSelectorModal
        defaultSelected={sketch.voice}
        voiceIndex={voiceIndex}
        shown={voiceSelectorModalShown}
        setShown={setVoiceSelectorModalShown}
        onVoiceSelect={(v: Voice) => {
          let s = { ...sketch, voice: v };
          setSketch(s);
        }}
      />
      <table className="table">
        <tbody>
          <tr>
            <th>Voice</th>
            <td>
              <div className="d-grid">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setVoiceSelectorModalShown(true)}
                >
                  {sketch.voice.name}
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <th>Phrase(s)</th>
            <td>
              <div className="d-grid gap-1">
                {sketch.phrases.map((p, i) => (
                  <div key={p} className="d-flex justify-content-between">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={p}
                      onBlur={(e) => {
                        if (e.target.value === p) {
                          return;
                        }
                        let s = {
                          ...sketch,
                          phrases: sketch.phrases.map((pp, ii) =>
                            i === ii ? e.target.value : pp
                          ),
                        };
                        setSketch(s);
                      }}
                    />
                    <button
                      className="btn btn-danger ms-1"
                      onClick={() => {
                        let s = {
                          ...sketch,
                          phrases: sketch.phrases.filter((pp, ii) => i !== ii),
                        };
                        setSketch(s);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    setSketch({ ...sketch, phrases: [...sketch.phrases, ""] });
                  }}
                >
                  Add phrase
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <th>Phrase Order</th>
            <td>
              <SortableListGroup
                items={sketch.phrases.map((p) => ({ id: p }))}
                setItems={(items) =>
                  setSketch({ ...sketch, phrases: items.map((i) => i.id) })
                }
                getItemLabel={(pi, i) => <span>{pi.id}</span>}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
