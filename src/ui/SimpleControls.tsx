import CrossAudio from "../CrossAudio";
import { Simple } from "../Model";
const btnClasses = [
  "btn-primary",
  "btn-danger",
  "btn-secondary",
  "btn-success",
  "btn-warning",
  "btn-info",
];
export default ({ simple }: { simple: Simple }) => {
  return (
    <div className="d-flex flex-column gap-2">
      {simple.phrases.map((p, i) => {
        let btnClass = btnClasses[i % btnClasses.length];

        return (
          <button
            style={{ height: `calc((100vh - 8em)/${simple.phrases.length})` }}
            className={"btn btn-lg " + btnClass}
            onClick={() =>
              CrossAudio.playUtterance({ phrase: p, voice: simple.voice })
            }
          >
            {p}
          </button>
        );
      })}
    </div>
  );
};
