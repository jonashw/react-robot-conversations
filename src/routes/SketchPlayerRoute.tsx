import React from "react";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import ConversationStage from "../ui/ConversationStage";
import ConversationScript from "../ui/ConversationScript";

import SimpleControls from "../ui/SimpleControls";
import AuditionControls from "../ui/AuditionControls";

import { Conversation, Sketch, VoiceIndex, Simple, Audition } from "../Model";

export function SketchPlayerRoute() {
  const { sketch, voiceIndex } = useRouteLoaderData("sketch") as {
    sketch: Sketch;
    voiceIndex: VoiceIndex;
  };

  switch (sketch.type) {
    case "conversation":
      const conversation: Conversation = sketch;
      return (
        <>
          <ConversationStage
            focusOnSpeakers={true}
            characters={conversation.characters}
            activeUtteranceMoment={undefined}
          />
          <ConversationScript
            conversation={conversation}
            activeUtteranceMoment={undefined}
            setActiveUtteranceMoment={() => {}}
          />
        </>
      );
    case "simple":
      const simple: Simple = sketch;
      return <SimpleControls simple={simple} />;
    case "audition":
      const audition: Audition = sketch;
      return (
        <AuditionControls
          audition={audition}
          setAudition={() => {}}
          voiceIndex={voiceIndex}
        />
      );
  }
}
