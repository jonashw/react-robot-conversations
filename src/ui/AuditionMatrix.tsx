import { Voice, Utterance } from "../Model";

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
}) => {
  return (
    <table
      style={{ fontSize: "0.7rem" }}
      className="table table-sm table-bordered mt-3"
    >
      <thead>
        <tr>
          <th>&times;</th>
          {phrases.map((p) => (
            <th
              className={
                "rotate" +
                (!!active && active.phrase === p ? " table-primary" : "")
              }
              onClick={async () => {
                playSequence(voices.map((voice) => ({ voice, phrase: p })));
              }}
            >
              <div>
                <span>{p}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {voices.map((v) => (
          <tr>
            <th
              className={!!active && active.voice === v ? "table-primary" : ""}
              onClick={async () => {
                playSequence(phrases.map((p) => ({ voice: v, phrase: p })));
              }}
            >
              {v.name}
            </th>
            {phrases.map((p) => {
              let isActive =
                !!active && active.voice === v && active.phrase === p;

              return (
                <td className={"p-0"}>
                  <div className="d-grid" style={{ position: "relative" }}>
                    <button
                      style={{
                        border: "none",
                        borderRadius: 0,
                      }}
                      className={
                        "btn btn-sm " +
                        (isActive ? "btn-primary" : "btn-outline-primary")
                      }
                      onClick={() => {
                        playSequence([{ voice: v, phrase: p }]);
                      }}
                    >
                      <img
                        src="/icons/play.svg"
                        style={{
                          height: "0.7em",
                          filter: `invert(${isActive ? 0 : 1})`,
                        }}
                      />
                    </button>
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
