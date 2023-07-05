import React from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Conversation, Sketch, VoiceIndex, Simple } from "../Model";
import ConversationEditor from "../ui/ConversationEditor";
import ConversationSideEffects from "../ui/ConversationSideEffects";
import SimpleEditor from "./SimpleEditor";
import { unstable_usePrompt } from "react-router-dom";
export const action = async () => {};

export function SketchEditorRoute() {
  const { sketch, voiceIndex } = useRouteLoaderData("sketch") as {
    sketch: Sketch;
    voiceIndex: VoiceIndex;
  };
  const [sketchRevisions, setSketchRevisions] = React.useState<Sketch[]>([]);
  unstable_usePrompt({
    message: "leave page?",
    when: sketchRevisions.length > 0,
  });
  let editor = (() => {
    switch (sketch.type) {
      case "simple":
        const simple: Simple = sketch;
        return (
          <SimpleEditor
            {...{ simple, voiceIndex }}
            onEdit={(s: Simple) => {
              setSketchRevisions([...sketchRevisions, s]);
            }}
          />
        );
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
  })();
  return (
    <div>
      <div>{editor}</div>
      <button
        className="btn btn-success"
        disabled={sketchRevisions.length === 0}
      >
        Save
      </button>
    </div>
  );
}
