import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";

export default function SortableItem({
  id,
  children,
}: {
  id: UniqueIdentifier;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="list-group-item"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="d-flex">
        <span className="me-3">↕️</span>
        {children}
      </div>
    </div>
  );
}
