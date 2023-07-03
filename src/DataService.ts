import { Sketch, Voice, VoiceIndex, SketchSpecification } from "./Model";
import React from "react";
import Generator from "./Generator";
import { loadVoiceBoard } from "./loadVoiceBoard";
import { localStorageProperty } from "./useLocalStorage";

const cache: {
  voiceIndex: VoiceIndex | undefined;
  sketches: Sketch[] | undefined;
  darkMode: boolean | undefined;
} = {
  voiceIndex: undefined,
  sketches: undefined,
  darkMode: undefined,
};

const darkMode = localStorageProperty(
  "darkMode",
  (b) => b.toString(),
  (str) => str === "true",
  false
);

export function getDarkMode() {
  if (!!cache.darkMode) {
    return cache.darkMode;
  }
  let dm = darkMode.get();
  cache.darkMode = dm;
  return dm;
}

export async function getVoiceIndex() {
  if (!!cache.voiceIndex) {
    return Promise.resolve(cache.voiceIndex);
  }
  let result = await fetch(
    "https://storage.googleapis.com/jonashw-dev-speech-synthesis/index.json?v8"
  );
  let voices: Voice[] = await result.json();
  for (let v of voices) {
    v.id = "amazon-polly-" + v.name;
  }
  const voiceIndex = new VoiceIndex(voices);
  cache.voiceIndex = voiceIndex;
  return voiceIndex;
}

export async function getSketches(
  voiceIndex: VoiceIndex
): Promise<Sketch[]> {
  if (!!cache.sketches) {
    return Promise.resolve(cache.sketches);
  }
  let result = await fetch("/sketches.json");
  let specs: SketchSpecification[] = [
    Generator.rowYourBoat(true),
    Generator.rowYourBoat(false),
    ...(await result.json()),
  ];
  console.log({ specs });
  let sketches = specs.map((spec, i) =>
    loadVoiceBoard(i + 1, spec, voiceIndex)
  );
  cache.sketches = sketches;
  return sketches;
}

export const useDataService = () => {
  const cache: {
    voiceIndex: VoiceIndex | undefined;
    sketches: Sketch[] | undefined;
  } = {
    voiceIndex: undefined,
    sketches: undefined,
  };
  const [voiceIndex, setVoiceIndex] = React.useState<VoiceIndex | undefined>(
    cache.voiceIndex
  );
  const [sketches, setSketches] = React.useState<Sketch[] | undefined>(
    cache.sketches
  );

  const getVoiceIndexCached = async () => {
    if (!!cache.voiceIndex) {
      return Promise.resolve(cache.voiceIndex!);
    }
    return getVoiceIndex().then((voiceIndex) => {
      cache.voiceIndex = voiceIndex;
      return voiceIndex;
    });
  };

  React.useEffect(() => {
    if (!!cache.voiceIndex) {
      return;
    }
    getVoiceIndex().then((voiceIndex) => {
      cache.voiceIndex = voiceIndex;
      setVoiceIndex(voiceIndex);
    });
  }, []);

  React.useEffect(() => {
    if (!!cache.sketches) {
      return;
    }
    if (!voiceIndex) {
      return;
    }
    getSketches(voiceIndex!).then((sketches) => {
      cache.sketches = sketches;
      setSketches(sketches);
    });
  }, [voiceIndex]);

  function updateSketch(oldSketch: Sketch, updatedSketch: Sketch) {
    if (!sketches) {
      throw "user attempted to update a sketch before sketches were loaded";
    }
    let updatedSketches = sketches.map((s) =>
      s.id === oldSketch.id ? updatedSketch : s
    );
    cache.sketches = updatedSketches;
    setSketches(updatedSketches);
  }
  function addSketch(s: Sketch) {
    if (!cache.sketches) {
      throw "user attempted to add a sketch before sketches were loaded";
    }
    cache.sketches!.push(s);
    setSketches(cache.sketches!);
  }
  return { voiceIndex, sketches, updateSketch, addSketch, getVoiceIndexCached };
};
