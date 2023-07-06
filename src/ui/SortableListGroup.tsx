import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import SortableListGroupItem from "./SortableListGroupItem";
type HasUniqueIdentifier = { id: UniqueIdentifier };
export default function <T extends HasUniqueIdentifier>({
  items,
  setItems,
  getItemLabel,
}: {
  items: T[];
  setItems: (items: T[]) => void;
  getItemLabel: (item: T, i: number) => React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="list-group">
          {items.map((item, i) => (
            <SortableListGroupItem key={item.id} id={item.id}>
              {getItemLabel(item, i)}
            </SortableListGroupItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over != null && active.id !== over?.id && !!active.id && !!over.id) {
      let oldItem = items.filter((i) => i.id === active?.id)[0];
      let newItem = items.filter((i) => i.id === over?.id)[0];
      console.log({ items, over, active, oldItem, newItem });
      if (!oldItem || !newItem) {
        alert("BOO");
        return;
      }

      const oldIndex = items.indexOf(oldItem);
      const newIndex = items.indexOf(newItem);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  }
}
