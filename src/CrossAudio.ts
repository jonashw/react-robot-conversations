import AudioOutput from "./AudioOutput";
import { Cross, Utterance } from "./Model";

export default {
  playAllVoicesFor: (c: Cross, phrase: string) => {
    let audioIds = c.voices.map((voice) => [voice, phrase] as [string, string]);
    return AudioOutput.playInParallel(audioIds);
  },
  playAllPhrasesFor: (c: Cross, voice: string) => {
    let audioIds = c.phrases.map(
      (phrase) => [voice, phrase] as [string, string]
    );
    return AudioOutput.playInParallel(audioIds);
  },
  playUtterance: (u: Utterance) => AudioOutput.play([u.voice, u.label]),
  stopUtterance: (u: Utterance) => AudioOutput.pause([u.voice, u.label]),
};
