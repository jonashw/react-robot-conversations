import React from "react";
import { useLoaderData } from "react-router-dom";
import { VoiceBoard, VoiceIndex } from "../Model";
import { getSketches, getVoiceIndex } from "../DataService";
import Sketch from "../ui/Sketch";
export const loader = async ({ params }: { params: any }) => {
  let id = parseInt(params.sketch_id || "");
  let voiceIndex = await getVoiceIndex();
  let sketches = await getSketches(voiceIndex);
  let sketch = sketches.filter((s) => s.id === id)[0];
  if (!sketch) {
    throw "Did not find sketch by id " + id;
  }
  return { sketch, voiceIndex };
};
export function SketchRoute() {
  const { sketch, voiceIndex } = useLoaderData() as {
    sketch: VoiceBoard;
    voiceIndex: VoiceIndex;
  };

  return (
    <div>
      {!!sketch && !!voiceIndex ? (
        <Sketch
          sketch={sketch!}
          voiceIndex={voiceIndex!}
          updateSketch={(oldSketch: VoiceBoard, newSketch: VoiceBoard) => {
            //updateSketch(oldSketch, newSketch);
            //setSketch(newSketch);
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
