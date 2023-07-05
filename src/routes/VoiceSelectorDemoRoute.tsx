import React from "react";
import DarkModeToggle from "../ui/DarkModeToggle";
import VoiceBoardSelector from "../ui/VoiceBoardSelector";
import { useLoaderData, useNavigate } from "react-router-dom";
import { getVoiceIndex } from "../DataService";
import { VoiceIndex } from "../Model";
import VoiceSelectorModal from "./VoiceSelectorModal";
export const loader = async () => {
  let voiceIndex = await getVoiceIndex();
  return { voiceIndex };
};
export function VoiceSelectorDemoRoute() {
  const nav = useNavigate();
  const { voiceIndex } = useLoaderData() as {
    voiceIndex: VoiceIndex;
  };
  return (
    <VoiceSelectorModal
      onVoiceSelect={() => {}}
      setShown={(s) => {}}
      shown={true}
      voiceIndex={voiceIndex}
      forceFilterMenuOpen={true}
    />
  );
}
