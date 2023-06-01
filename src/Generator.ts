import {
  SketchSpecification,
  VoiceIndex,
  Audition,
  VoiceBoard,
  Voice,
} from "./Model";

const englishSpeakers = (voiceIndex: VoiceIndex): SketchSpecification => {
  let phrases = [
    "Yes",
    "No",
    "Maybe",
    "Hello",
    "What?",
    "Oh",
    "OK",
    "Let's go",
    "How are you?",
    "I'm fine",
  ];
  let voices = Object.values(voiceIndex);
  let englishLanguages = voices.reduce((langs, v) => {
    if (v.lang.indexOf("English") > -1) {
      langs.add(v.lang);
    }
    return langs;
  }, new Set<string>());
  return {
    type: "cross",
    phrases: phrases,
    voices: voices
      .filter((v) => englishLanguages.has(v.lang))
      .map((v) => v.name),
    name: "English Speakers",
  };
};

const rowYourBoat = (oneBeatPerPhrase = true): SketchSpecification => {
  let phrases = [
    "row",
    "roww",
    "row your",
    "boat",

    "gently",
    "down the",
    "stream",
    undefined,

    "merrily",
    "merry lee",
    "merrily",
    "merry lea",

    "life is",
    "but a",
    "dream",
  ];
  const beatsPerMeasure = 4;
  let phraseChunkSize = oneBeatPerPhrase ? 1 : beatsPerMeasure;
  let characters: [string, string, number][] = [
    ["a", "Ivy", 0],
    ["b", "Matthew", 1],
    ["c", "Justin", 2],
    ["d", "Amy", 3],
  ];
  let phrasesByCharacter = Object.fromEntries(
    characters.map(([c, v, offset]) => [
      c,
      [
        ...Array((beatsPerMeasure / phraseChunkSize) * offset).fill(undefined),
        ...(phraseChunkSize === 1
          ? phrases
          : phrases
              .reduce((chunks, phrase) => {
                if (chunks.length === 0) {
                  chunks.push([]);
                }
                let prevChunk = chunks[chunks.length - 1];
                if (prevChunk.length >= phraseChunkSize) {
                  chunks.push([phrase || ""]);
                } else {
                  prevChunk.push(phrase || "");
                }
                return chunks;
              }, [] as string[][])
              .map((phrases) => phrases.join(" "))),
        ...Array(
          (beatsPerMeasure / phraseChunkSize) * (characters.length - offset - 1)
        ).fill(undefined),
      ],
    ])
  );
  let script = Array(Object.values(phrasesByCharacter)[0].length)
    .fill(undefined)
    .map((_, momentIndex) =>
      Object.fromEntries(
        Object.entries(phrasesByCharacter)
          .map(([c, phrases]) => [c, phrases[momentIndex]])
          .filter(([c, phrase]) => !!phrase)
      )
    );

  return {
    type: "conversation",
    name:
      "Row your boat rounds " +
      (oneBeatPerPhrase ? "(beat-by-beat)" : "(phrase-by-phrase)"),
    script,
    characters: Object.fromEntries(
      characters.map(([c, v]) => [
        c,
        {
          name: c.toUpperCase(),
          voice: v,
        },
      ])
    ),
  };
};

export default {
  rowYourBoat,
  englishSpeakers,
};
