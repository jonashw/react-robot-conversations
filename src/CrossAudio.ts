import AudioOutput from "./AudioOutput";
import { Utterance } from "./Model";

export default {
  playUtterance: (u: Utterance) => AudioOutput.play([u.voice.name, u.phrase]),
  stopUtterance: (u: Utterance) => AudioOutput.pause([u.voice.name, u.phrase]),
};
