export type Voice = {
  name: string;
  lang: string;
  age: string;
  gender: string;
};

export type VoiceIndex = { [name: string]: Voice };

export type VoiceBoardSpec =
  | {
      type: "board";
      voices: string[];
      domain: { [lang: string]: string[] };
    }
  | {
      type: "conversation";
      voices: { [abbrev: string]: string };
      utterances: [string, string][];
    }
  | {
      type: "script";
      voices: { [abbrev: string]: string };
      script: string;
    };
export type Toolbox = {
  id: number;
  type: "board";
  utterances: VoiceLangUtterances;
};
export type UtteranceByVoice = { [voiceAbbrev: string]: Utterance };
export type UtteranceMoment = {
  play: (um: UtteranceMoment) => void;
  stop: (um: UtteranceMoment) => void;
  utteranceByVoice: UtteranceByVoice;
  onEnd: (observer: () => void) => void;
};
export type VoiceLangUtterances = { [voice: string]: LangUtterances };
export type Conversation = {
  id: number;
  type: "conversation";
  utterances: Utterance[];
  utteranceMoments: UtteranceMoment[];
  voices: { [abbrev: string]: string };
};
export type VoiceBoard = Toolbox | Conversation;
export type LangUtterances = {
  [lang: string]: Utterance[];
};
export type Utterance = {
  voice: string;
  label: string;
  audio: HTMLAudioElement;
  play: (self: Utterance) => void;
  stop: () => void;
};
