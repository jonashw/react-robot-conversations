export type Voice = {
  name: string;
  lang: string;
  age: string;
  gender: string;
};

export type VoiceIndex = { [name: string]: Voice };
export type UtteranceId = [string, string];
export type SketchSpecification =
  | {
      type: "simple";
      name: string;
      voice: string;
      phrases: string[];
    }
  | {
      type: "cross";
      name: string;
      voices: string[];
      phrases: string[];
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
export type Simple = {
  name: string;
  id: number;
  type: "simple";
  voice: string;
  phrases: string[];
};
export type Cross = {
  name: string;
  id: number;
  type: "cross";
  voices: string[];
  phrases: string[];
};

export type Conversation = {
  name: string;
  id: number;
  type: "conversation";
  utteranceMoments: UtteranceMoment[];
  characters: {
    [id: CharacterId]: Character;
  };
};
export type VoiceBoard = Cross | Conversation | Simple;

export type Utterance = {
  voice: string;
  label: string;
};
export type UtteranceByCharacter = { [characterId: string]: Utterance };
