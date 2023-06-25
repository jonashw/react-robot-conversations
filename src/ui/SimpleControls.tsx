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
  const playPhrase = (p: string) =>
    CrossAudio.playUtterance({ phrase: p, voice: simple.voice });
  return (
    <div className="d-flex flex-column gap-2">
      {simple.phrases.map((p, i) => {
        let btnClass = btnClasses[i % btnClasses.length];

        return (
          <button
            style={{ height: `calc((100vh - 8em)/${simple.phrases.length})` }}
            className={"btn btn-lg " + btnClass}
            onTouchStart={() => playPhrase(p)}
            onClick={() => playPhrase(p)}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
};
