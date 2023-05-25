export type Voice = {
  name: string;
  lang: string;
  age: string;
  gender: string;
};

export type VoiceIndex = { [name: string]: Voice };
export type UtteranceId = [string, string];
export type VoiceBoardSpec =
  | {
      type: "board";
      voices: string[];
      domain: { [lang: string]: string[] };
    }
  | {
      type: "conversation";
      script: { [abbrev: string]: string }[];
      characters: {
        [abbrev: string]: Character;
      };
    };
export type Character = { name: string; emoji?: string; voice: string };
export type Board = {
  id: number;
  type: "board";
  utterances: VoiceLangUtterances;
};
export type UtteranceMoment = {
  play: (um: UtteranceMoment) => void;
  stop: (um: UtteranceMoment) => void;
  utteranceByVoice: UtteranceByVoice;
  onEnd: (observer: () => void) => void;
};
export type Conversation = {
  id: number;
  type: "conversation";
  utteranceMoments: UtteranceMoment[];
  characters: {
    [abbrev: string]: Character;
  };
  play: () => void;
  stop: () => void;
};
export type VoiceBoard = Board | Conversation;

export type Utterance = {
  voice: string;
  label: string;
  audio: HTMLAudioElement;
  play: (self: Utterance) => void;
  stop: () => void;
};
export type LangUtterances = { [lang: string]: Utterance[] };
export type VoiceLangUtterances = { [voice: string]: LangUtterances };
export type UtteranceByVoice = { [voiceAbbrev: string]: Utterance };
