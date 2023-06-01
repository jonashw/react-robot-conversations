import AudioOutput from "./AudioOutput";
import { Conversation, UtteranceMoment } from "./Model";
let momentAudioIds = (
  c: Conversation,
  m: UtteranceMoment
): [string, string][] =>
  Object.entries(m.utteranceByCharacter).map(
    ([characterId, u]) =>
      [c.characters[characterId].voice, u.label] as [string, string]
  );
export default {
  play: (
    conversation: Conversation,
    setActiveUtteranceMoment: (um: UtteranceMoment | undefined) => void
  ): Promise<void> =>
    AudioOutput.playMomentsInSequence(
      conversation.utteranceMoments.map((um) =>
        momentAudioIds(conversation, um)
      ),
      (i) => {
        if (i === undefined) {
          setActiveUtteranceMoment(undefined);
        } else {
          setActiveUtteranceMoment(conversation.utteranceMoments[i]);
        }
      }
    ),
  stop: (conversation: Conversation): Promise<void> =>
    Promise.all(
      conversation.utteranceMoments
        .map((um) => momentAudioIds(conversation, um))
        .map(AudioOutput.pauseAll)
    ).then(),
  playMoment: (c: Conversation, m: UtteranceMoment) =>
    AudioOutput.playInParallel(momentAudioIds(c, m)),
  stopMoment: (c: Conversation, m: UtteranceMoment) =>
    AudioOutput.pauseAll(momentAudioIds(c, m)),
};
