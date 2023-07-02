import { VoiceIndex } from "../Model";
import { useLoaderData } from "react-router";
import { loadVoiceBoard } from "../loadVoiceBoard";
import Sketch from "../ui/Sketch";
import { getVoiceIndex } from "../DataService";

export const loader = getVoiceIndex;
export const HomeRoute = ({}: {}) => {
  const voiceIndex: VoiceIndex = useLoaderData() as VoiceIndex;
  console.log(voiceIndex);
  return (
    <div>
      <Sketch
        sketch={loadVoiceBoard(
          55,
          {
            type: "simple",
            name: "Demo",
            voice: "Brian",
            phrases: ["Hello"],
          },
          voiceIndex
        )}
        voiceIndex={voiceIndex}
        updateSketch={() => {}}
      />
      <img src="/roboco-bg-transparent.png" />
    </div>
  );
};
