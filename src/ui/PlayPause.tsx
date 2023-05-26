import { UtteranceMoment, Conversation } from "../Model";
import ConversationAudio from "../ConversationAudio";

export default ({
  conversation,
  activeUtteranceMoment,
  setActiveUtteranceMoment,
}: {
  conversation: Conversation;
  activeUtteranceMoment: UtteranceMoment | undefined;
  setActiveUtteranceMoment: (m: UtteranceMoment | undefined) => void;
}) => {
  const playing = !!activeUtteranceMoment;
  const stopped = !playing;
  return (
    <div className="btn-group w-100">
      {(
        [
          [
            stopped,
            () =>
              ConversationAudio.stop(conversation).then(() =>
                setActiveUtteranceMoment(undefined)
              ),
            "/icons/stop.svg",
          ],
          [
            playing,
            () =>
              ConversationAudio.play(conversation, setActiveUtteranceMoment),
            "/icons/play.svg",
          ],
        ] as [boolean, () => void, string][]
      ).map(([active, onClick, iconSrc]) => (
        <button
          disabled={active}
          className={
            "btn btn-lg " + (active ? "btn-primary active" : "btn-primary")
          }
          onClick={onClick}
        >
          <img
            src={iconSrc}
            style={{
              height: "1em",
              filter: active ? "invert(1)" : "",
            }}
          />
        </button>
      ))}
    </div>
  );
};
