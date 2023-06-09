import { Voice, VoiceIndex, VoiceBoard, Character } from "../Model";
import React from "react";
import NewSketchModal from "./NewSketchModal";
export default ({
  setVoiceBoards,
  voiceBoards,
  activeVoiceBoard,
  setActiveVoiceBoard,
  voiceIndex,
}: {
  setVoiceBoards: (vbs: VoiceBoard[]) => void;
  voiceBoards: VoiceBoard[];
  activeVoiceBoard: VoiceBoard | undefined;
  setActiveVoiceBoard: (vb: VoiceBoard | undefined) => void;
  voiceIndex: VoiceIndex;
}) => {
  const [modalShown, setModalShown] = React.useState<boolean>(false);

  const promptForNewSketchType = () => {
    setModalShown(true);
  };

  return (
    <>
      {" "}
      {false && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {voiceBoards.map((vb, i) => (
            <button
              key={i}
              className={
                "flex-grow-1 mx-1 btn " +
                (!!activeVoiceBoard && activeVoiceBoard.id === vb.id
                  ? "btn-primary"
                  : "btn-outline-primary")
              }
              onClick={() => {
                if (!!activeVoiceBoard && activeVoiceBoard.id === vb.id) {
                  setActiveVoiceBoard(undefined);
                } else {
                  setActiveVoiceBoard(vb);
                }
              }}
            >
              {vb.id}
            </button>
          ))}
        </div>
      )}
      <div className="list-group" style={{ paddingBottom: "4em" }}>
        {voiceBoards.map((vb) => (
          <a
            className="list-group-item"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveVoiceBoard(vb);
            }}
          >
            {vb.name}
            <span className="float-end text-muted text-sm">{vb.type}</span>
          </a>
        ))}
      </div>
      <NewSketchModal
        shown={modalShown}
        setShown={setModalShown}
        voiceIndex={voiceIndex}
        onSketchCreated={(vb) => {
          setVoiceBoards([...voiceBoards, vb]);
          setActiveVoiceBoard(vb);
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
