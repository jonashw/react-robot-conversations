import React from "react";
import { useRouteLoaderData } from "react-router-dom";

import { Conversation, VoiceBoard, VoiceIndex } from "../Model";
import ConversationEditor from "../ui/ConversationEditor";
import ConversationSideEffects from "../ui/ConversationSideEffects";
export const action = async () => {};

export function SketchEditorRoute() {
  const { sketch, voiceIndex } = useRouteLoaderData("sketch") as {
    sketch: VoiceBoard;
    voiceIndex: VoiceIndex;
  };
  switch (sketch.type) {
    case "conversation":
      const conversation: Conversation = sketch;
      const effects = new ConversationSideEffects(
        voiceIndex,
        conversation,
        (p, n) => {}
      );
      return (
        <ConversationEditor
          {...{
            conversation,
            voiceIndex,
            effect: effects,
            activeUtteranceMoment: undefined,
            setActiveUtteranceMoment: () => {},
          }}
        />
      );
  }
  return (
    <div>
      {!!sketch && !!voiceIndex ? (
        <pre>{JSON.stringify(sketch, null, 2)}</pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
