import React from "react";
import DarkModeToggle from "../ui/DarkModeToggle";
import VoiceBoardSelector from "../ui/VoiceBoardSelector";
import { Link, useLoaderData } from "react-router-dom";
import { getVoiceIndex, getSketches } from "../DataService";
import { VoiceIndex, Sketch } from "../Model";
export const loader = async () => {
  let voiceIndex = await getVoiceIndex();
  let sketches = await getSketches(voiceIndex);
  return { voiceIndex, sketches };
};
export function SketchesRoute() {
  const { voiceIndex, sketches } = useLoaderData() as {
    voiceIndex: VoiceIndex;
    sketches: Sketch[];
  };
  return (
    <>
      <nav className="navbar bg-body-tertiary mb-2">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            Voice Sketches
          </Link>
          <DarkModeToggle />
        </div>
      </nav>
      <div className="container-fluid">
        <VoiceBoardSelector
          {...{
            voiceBoards: sketches!,
            voiceIndex: voiceIndex!,
          }}
        />

        <div className="p-5">
          <img
            src="/roboco-bg-transparent.svg"
            className="col-6 mx-auto d-block img-fluid mb-5 pb-5"
          />
        </div>
      </div>
    </>
  );
}
