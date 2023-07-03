import { VoiceIndex } from "../Model";
import { useLoaderData } from "react-router";
import { getVoiceIndex } from "../DataService";

export const loader = getVoiceIndex;
export const HomeRoute = ({}: {}) => {
  const voiceIndex: VoiceIndex = useLoaderData() as VoiceIndex;
  console.log(voiceIndex);
  return (
    <div>
      <img src="/roboco-bg-transparent.png" />
    </div>
  );
};
