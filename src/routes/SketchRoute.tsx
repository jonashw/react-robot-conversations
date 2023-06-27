import React from "react";
import { useParams } from "react-router-dom";
import { VoiceBoard, VoiceIndex } from "../Model";
import { useDataService } from "../DataService";
import Sketch from "../ui/Sketch";

export function SketchRoute() {
  const params = useParams();
  const { voiceIndex, sketches, updateSketch } = useDataService();
  const [sketch, setSketch] = React.useState<VoiceBoard | undefined>();

  React.useEffect(() => {
    let id = parseInt(params.sketch_id || "");
    if (!sketches) {
      return;
    }
    let matches = sketches.filter((s) => s.id === id);
    if (matches.length === 1) {
      setSketch(matches[0]);
    }
  }, [sketches, params]);
  return (
    <div>
      {!!sketch && !!voiceIndex ? (
        <Sketch
          sketch={sketch!}
          voiceIndex={voiceIndex!}
          updateSketch={(oldSketch: VoiceBoard, newSketch: VoiceBoard) => {
            updateSketch(oldSketch, newSketch);
            setSketch(newSketch);
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
