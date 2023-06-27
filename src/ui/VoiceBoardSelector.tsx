import { Voice, VoiceIndex, VoiceBoard, Character } from "../Model";
import React from "react";
import NewSketchModal from "./NewSketchModal";
import { Link, useNavigate } from "react-router-dom";
import { useDataService } from "../DataService";
export default ({
  voiceBoards,
  voiceIndex,
}: {
  voiceBoards: VoiceBoard[];
  voiceIndex: VoiceIndex;
}) => {
  const [modalShown, setModalShown] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const promptForNewSketchType = () => {
    setModalShown(true);
  };

  const sketchUrl = (sketch: VoiceBoard) => `/sketches/${sketch.id}`;
  const { addSketch } = useDataService();
  return (
    <>
      <div className="list-group" style={{ paddingBottom: "4em" }}>
        {voiceBoards.map((vb) => (
          <Link className="list-group-item" to={sketchUrl(vb)}>
            {vb.name}
            <span className="float-end text-muted text-sm">{vb.type}</span>
          </Link>
        ))}
      </div>
      <NewSketchModal
        shown={modalShown}
        setShown={setModalShown}
        voiceIndex={voiceIndex}
        onSketchCreated={(vb) => {
          addSketch(vb);
          navigate(sketchUrl(vb));
        }}
      />
      <div
        style={{ position: "fixed", bottom: 0, right: 0, left: 0 }}
        className="mx-5"
      >
        <div className="d-grid">
          <div className="btn-group my-2">
            <button
              className="btn btn-primary btn-lg"
              onClick={(e) => {
                promptForNewSketchType();
              }}
            >
              Create a new one
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
