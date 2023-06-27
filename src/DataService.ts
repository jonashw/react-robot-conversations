import { VoiceBoard, Voice, VoiceIndex, SketchSpecification } from "./Model";
import React from "react";
import Generator from "./Generator";
import { loadVoiceBoard } from "./loadVoiceBoard";

async function getVoiceIndex() {
  let result = await fetch(
    "https://storage.googleapis.com/jonashw-dev-speech-synthesis/index.json?v8"
  );
  let voices: Voice[] = await result.json();
  for (let v of voices) {
    v.id = "amazon-polly-" + v.name;
  }
  return new VoiceIndex(voices);
}

async function getSketches(voiceIndex: VoiceIndex): Promise<VoiceBoard[]> {
  let result = await fetch("/sketches.json");
  let specs: SketchSpecification[] = [
    Generator.rowYourBoat(true),
    Generator.rowYourBoat(false),
    ...(await result.json()),
  ];
  console.log({ specs });
  return specs.map((spec, i) => loadVoiceBoard(i + 1, spec, voiceIndex));
}

export const useDataService = () => {
  const cache: {
    voiceIndex: VoiceIndex | undefined;
    sketches: VoiceBoard[] | undefined;
  } = {
    voiceIndex: undefined,
    sketches: undefined,
  };
  const [voiceIndex, setVoiceIndex] = React.useState<VoiceIndex | undefined>(
    cache.voiceIndex
  );
  const [sketches, setSketches] = React.useState<VoiceBoard[] | undefined>(
    cache.sketches
  );

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

  function updateSketch(oldSketch: VoiceBoard, updatedSketch: VoiceBoard) {
    if (!sketches) {
      throw "user attempted to update a sketch before sketches were loaded";
    }
    let updatedSketches = sketches.map((s) =>
      s.id === oldSketch.id ? updatedSketch : s
    );
    cache.sketches = updatedSketches;
    setSketches(updatedSketches);
  }
  function addSketch(s: VoiceBoard) {
    if (!cache.sketches) {
      throw "user attempted to add a sketch before sketches were loaded";
    }
    cache.sketches!.push(s);
    setSketches(cache.sketches!);
  }
  return { voiceIndex, sketches, updateSketch, addSketch };
};
