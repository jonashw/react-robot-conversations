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
              {sketch.phrases.map((p, i) => (
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
              ))}
              <SortableListGroup
                items={sketch.phrases.map((p) => ({ id: p }))}
                setItems={(items) =>
                  setSketch({ ...sketch, phrases: items.map((i) => i.id) })
                }
                getItemLabel={(pi, i) => (
                  <input
                    onClick={() => false}
                    onMouseDown={() => false}
                    type="text"
                    className="form-control"
                    defaultValue={pi.id}
                    onChange={(e) => {
                      let s = {
                        ...sketch,
                        phrases: sketch.phrases.map((pp, ii) =>
                          i === ii ? e.target.value : pp
                        ),
                      };
                      setSketch(s);
                      //onEdit(s);
                    }}
                  />
                )}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
