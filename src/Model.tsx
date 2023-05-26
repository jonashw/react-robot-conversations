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
      script: { [characterId: CharacterId]: Message }[];
      characters: {
        [id: CharacterId]: Character;
      };
    };
export type Message = string;
export type CharacterId = string;
export type Character = { name: string; emoji?: string; voice: string };

export type UtteranceMoment = {
  utteranceByCharacter: UtteranceByCharacter;
  id: string;
};

export type Board = {
  id: number;
  spec: VoiceBoardSpec;
  type: "board";
  utterances: CharacterLangUtterances;
  play: (um: Utterance) => Promise<void>;
  stop: (um: Utterance) => Promise<void>;
};

export type Conversation = {
  id: number;
  spec: VoiceBoardSpec;
  type: "conversation";
  utteranceMoments: UtteranceMoment[];
  characters: {
    [id: CharacterId]: Character;
  };
};
export type VoiceBoard = Board | Conversation;

export type Utterance = {
  voice: string;
  label: string;
};
export type LangUtterances = { [lang: string]: Utterance[] };
export type CharacterLangUtterances = { [characterId: string]: LangUtterances };
export type UtteranceByCharacter = { [characterId: string]: Utterance };
