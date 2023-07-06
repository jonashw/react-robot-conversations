import React from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Conversation, Sketch, VoiceIndex, Simple } from "../Model";
import ConversationEditor from "../ui/ConversationEditor";
import ConversationSideEffects from "../ui/ConversationSideEffects";
import SimpleEditor from "./SimpleEditor";
import { unstable_usePrompt } from "react-router-dom";
export const action = async () => {};

class UndoRedoTimeline<T> {
  private readonly prev: T[];
  public readonly current: T;
  private readonly next: T[];
  public readonly undoCount: number;
  public readonly redoCount: number;
  constructor(prev: T[], current: T, next: T[]) {
    this.prev = prev;
    this.current = current;
    this.next = next;
    this.undoCount = prev.length;
    this.redoCount = next.length;
  }
  public add(value: T): UndoRedoTimeline<T> {
    let prev = !!this.current ? [...this.prev, this.current] : this.prev;
    return new UndoRedoTimeline(prev, value, []);
  }
  public undo(): UndoRedoTimeline<T> {
    if (this.prev.length === 0) {
      return this;
    }
    let prev = [...this.prev];
    let current = prev.pop()!;
    let next = [...this.next, this.current];
    return new UndoRedoTimeline(prev, current, next);
  }
  public redo(): UndoRedoTimeline<T> {
    if (this.next.length === 0) {
      return this;
    }
    let prev = [...this.prev, this.current];
    let next = [...this.next];
    let current = next.pop()!;
    return new UndoRedoTimeline(prev, current, next);
  }
}

export function SketchEditorRoute() {
  const { sketch, voiceIndex } = useRouteLoaderData("sketch") as {
    sketch: Sketch;
    voiceIndex: VoiceIndex;
  };
  const [sketchRevisions, setSketchRevisions] = React.useState<
    UndoRedoTimeline<Sketch>
  >(new UndoRedoTimeline<Sketch>([], sketch, []));
  unstable_usePrompt({
    message: "leave page?",
    when: sketchRevisions.undoCount > 0,
  });
  let editor = (() => {
    switch (sketchRevisions.current.type) {
      case "simple":
        const simple: Simple = sketchRevisions.current;
        return (
          <SimpleEditor
            {...{ sketch: simple, voiceIndex }}
            setSketch={(s: Simple) => {
              setSketchRevisions(sketchRevisions.add(s));
            }}
          />
        );
      case "conversation":
        const conversation: Conversation = sketchRevisions.current;
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
        {!!sketchRevisions.current && !!voiceIndex ? (
          <pre>{JSON.stringify(sketchRevisions.current, null, 2)}</pre>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  })();
  return (
    <div>
      <div>{editor}</div>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-success"
          disabled={sketchRevisions.undoCount === 0}
          onClick={() => {
            let sketch = sketchRevisions.current;
          }}
        >
          Save
        </button>
        <div className="d-flex gap-2">
          <button
            onClick={() => setSketchRevisions(sketchRevisions.undo())}
            disabled={sketchRevisions.undoCount === 0}
            className="btn btn-outline-danger"
          >
            &lsaquo; Undo ({sketchRevisions.undoCount})
          </button>

          <button
            onClick={() => setSketchRevisions(sketchRevisions.redo())}
            disabled={sketchRevisions.redoCount === 0}
            className="btn btn-outline-danger"
          >
            Redo ({sketchRevisions.redoCount}) &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
}
