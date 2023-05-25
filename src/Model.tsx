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
      name: string;
      voices: string[];
      domain: { [lang: string]: string[] };
    }
  | {
      type: "conversation";
      name: string;
      script: { [abbrev: string]: string }[];
      characters: {
        [abbrev: string]: Character;
      };
    };
export type Character = { name: string; emoji?: string; voice: string };

export type UtteranceMoment = {
  play: (um: UtteranceMoment) => void;
  stop: (um: UtteranceMoment) => void;
  utteranceByCharacter: UtteranceByCharacter;
  onEnd: (observer: () => void) => void;
};

export type Board = {
  id: number;
  spec: VoiceBoardSpec;
  type: "board";
  utterances: CharacterLangUtterances;
};
export type Conversation = {
  id: number;
  spec: VoiceBoardSpec;
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
export type CharacterLangUtterances = { [characterId: string]: LangUtterances };
export type UtteranceByCharacter = { [characterId: string]: Utterance };
