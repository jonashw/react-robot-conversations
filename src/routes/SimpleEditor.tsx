import React from "react";
import { VoiceIndex, Simple, Voice } from "../Model";
import VoiceSelectorModal from "./VoiceSelectorModal";

export default ({
  simple,
  voiceIndex,
  onEdit,
}: {
  simple: Simple;
  voiceIndex: VoiceIndex;
  onEdit: (s: Simple) => void;
}) => {
  const [sketch, setSketch] = React.useState(simple);
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
          onEdit(s);
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
                <div key={i}>
                  <input
                    type="text"
                    defaultValue={p}
                    onChange={(e) => {
                      let s = {
                        ...sketch,
                        phrases: sketch.phrases.map((pp, ii) =>
                          i === ii ? e.target.value : pp
                        ),
                      };
                      setSketch(s);
                      onEdit(s);
                    }}
                  />
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
