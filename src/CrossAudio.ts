import AudioOutput from "./AudioOutput";
import { Cross, Utterance } from "./Model";

export default {
  stopAllForVoice: (c: Cross, v: string) => {
    return AudioOutput.pauseAll(c.phrases.map((p) => [v, p]));
  },
  stopAllForPhrase: (c: Cross, p: string) => {
    return AudioOutput.pauseAll(c.voices.map((v) => [v, p]));
  },
  playAllVoicesFor: (
    c: Cross,
    phrase: string,
    setActiveVoice: (v: string | undefined) => void
  ) => {
    let audioIds = c.voices.map((voice) => [voice, phrase] as [string, string]);
    return AudioOutput.playSequentially(
      audioIds.map((ids) => [ids]),
      (i) => {
        if (i === undefined) {
          setActiveVoice(undefined);
        } else {
          setActiveVoice(c.voices[i]);
        }
      }
    );
  },
  playAllPhrasesFor: (
    c: Cross,
    voice: string,
    setActivePhrase: (p: string | undefined) => void
  ) => {
    let audioIds = c.phrases.map(
      (phrase) => [voice, phrase] as [string, string]
    );
    return AudioOutput.playSequentially(
      audioIds.map((ids) => [ids]),
      (i) => {
        if (i === undefined) {
          setActivePhrase(undefined);
        } else {
          setActivePhrase(c.phrases[i]);
        }
      }
    );
  },
  playUtterance: (u: Utterance) => AudioOutput.play([u.voice, u.label]),
  stopUtterance: (u: Utterance) => AudioOutput.pause([u.voice, u.label]),
};
