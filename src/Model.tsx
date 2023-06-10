export type VoiceBoard = Conversation | Simple | Audition;
export type Audition = {
  id: number;
  name: string;
  type: "audition";
  voices: AuditionVoices<Voice>;
  phrases: string[];
};
export type SketchType = "simple" | "audition" | "conversation";
export const AllSketchTypes: SketchType[] = [
  "simple",
  "audition",
  "conversation",
];
export type Simple = {
  name: string;
  id: number;
  type: "simple";
  voice: Voice;
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
export type SketchSpecification =
  | {
      type: "audition";
      name: string;
      voices: AuditionVoices<VoiceId>;
      phrases: string[];
    }
  | {
      type: "simple";
      name: string;
      voice: string;
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

export type AuditionVoices<V> =
  | {
      type: "faceted-specification";
      facetedSpecification: FacetedSpecification;
    }
  | {
      type: "just-an-array";
      array: V[];
    };

export type VoiceId = string;
export type FacetedSpecification = { [key: string]: string[] };

export type Voice = {
  id: string;
  name: string;
  lang: string;
  age: string;
  gender: string;
};

//export type VoiceIndex = { [name: string]: Voice };
export class VoiceIndex {
  private voiceById: { [voiceId: string]: Voice };
  private all: Voice[];
  constructor(voices: Voice[]) {
    this.voiceById = Object.fromEntries(voices.map((v) => [v.name, v]));
    this.all = voices;
  }
  getById(id: string): Voice {
    return this.voiceById[id];
  }
  getAll(): Voice[] {
    return Object.values(this.voiceById);
  }

  getMatchingVoices(
    voiceIndex: VoiceIndex,
    voiceSpecifications: FacetedSpecification
  ): Voice[] {
    console.log("getting matches for spec:", voiceSpecifications);
    let facetedPredicates = Object.entries(voiceSpecifications).map(
      ([facetId, matchingAnyOfValues]: [string, string[]]) =>
        (item: FacetedSpecification) => {
          let values = item[facetId] || [];
          return (
            values.length > 0 &&
            values.some((value) => matchingAnyOfValues.indexOf(value) > -1)
          );
        }
    );
    let auditioningVoiceIds = Object.values(this.all)
      .map((voice) => ({
        name: voice.name,
        tags: {
          ["lang"]: [voice.lang],
          ["gender"]: [voice.gender],
          ["age"]: [voice.age],
        },
      }))
      .reduce(
        (matches, voice) => {
          let isMatch = facetedPredicates.every((predicate) =>
            predicate(voice.tags)
          );
          console.log({ isMatch, voice, voiceSpecifications });
          return isMatch ? matches.add(voice.name) : matches;
        },

        new Set<string>()
      );
    return Array.from(auditioningVoiceIds)
      .map((voiceId) => voiceIndex.getById(voiceId))
      .filter((v) => v !== undefined);
  }
}
export type UtteranceId = [string, string];

export type Message = string;
export type CharacterId = string;
export type Character = { name: string; emoji?: string; voice: string };

export type UtteranceMoment = {
  utteranceByCharacter: UtteranceByCharacter;
  id: string;
};

export type Utterance = {
  voice: Voice;
  phrase: string;
};
export type UtteranceByCharacter = { [characterId: string]: Utterance };
