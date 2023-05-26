import { VoiceBoard } from "../Model";
export default ({
  setVoiceBoards,
  voiceBoards,
  activeVoiceBoard,
  setActiveVoiceBoard,
}: {
  setVoiceBoards: (vbs: VoiceBoard[]) => void;
  voiceBoards: VoiceBoard[];
  activeVoiceBoard: VoiceBoard | undefined;
  setActiveVoiceBoard: (vb: VoiceBoard | undefined) => void;
}) => {
  const addNewVoiceBoard = () => {
    let vb: VoiceBoard = {
      type: "conversation",
      name: "new sketch",
      id: voiceBoards.length + 1,
      characters: {},
      utteranceMoments: [],
    };
    setVoiceBoards([...voiceBoards, vb]);
    setActiveVoiceBoard(vb);
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
          <button
            className="flex-grow-1 mx-1 btn btn-outline-primary"
            onClick={addNewVoiceBoard}
          >
            +
          </button>
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
          </a>
        ))}
      </div>
      <div
        style={{ position: "fixed", bottom: 0, right: 0, left: 0 }}
        className="mx-5"
      >
        <div className="d-grid">
          <button
            className="btn btn-primary btn-lg my-2"
            onClick={(e) => {
              addNewVoiceBoard();
            }}
          >
            + Create a new one
          </button>
        </div>
      </div>
    </>
  );
};
