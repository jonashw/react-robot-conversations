import React from "react";
import DarkModeToggle from "../ui/DarkModeToggle";
import VoiceBoardSelector from "../ui/VoiceBoardSelector";

import { useDataService } from "../DataService";

export default function SketchesRoute() {
  const { voiceIndex, sketches } = useDataService();
  return (
    <>
      {!voiceIndex || !sketches ? (
        <div>Loading...</div>
      ) : (
        <>
          <nav className="navbar bg-body-tertiary mb-2">
            <div className="container-fluid">
              <a className="navbar-brand">Voice Sketches</a>
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
      )}
    </>
  );
}
