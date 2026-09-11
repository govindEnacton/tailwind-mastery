"use client";

import { useState } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// --------------------------------------------------
// Types
// --------------------------------------------------

type BlockType = "input" | "textarea" | "button";

type FormBlock = {
  id: string;
  type: BlockType;
  label: string;
  placeholder?: string;
};

type ComponentItem = {
  type: BlockType;
  label: string;
};

// --------------------------------------------------
// Available Components
// --------------------------------------------------

const componentItems: ComponentItem[] = [
  {
    type: "input",
    label: "Text Input",
  },
  {
    type: "textarea",
    label: "Textarea",
  },
  {
    type: "button",
    label: "Button",
  },
];

// --------------------------------------------------
// Default Properties
// --------------------------------------------------

function createBlock(type: BlockType): FormBlock {
  const id = crypto.randomUUID();

  if (type === "input") {
    return {
      id,
      type,
      label: "Text Input",
      placeholder: "Enter text...",
    };
  }

  if (type === "textarea") {
    return {
      id,
      type,
      label: "Message",
      placeholder: "Enter your message...",
    };
  }

  return {
    id,
    type,
    label: "Submit",
  };
}

// --------------------------------------------------
// Sidebar Draggable Component
// --------------------------------------------------

function SidebarItem({ item }: { item: ComponentItem }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${item.type}`,
    data: {
      type: "sidebar",
      blockType: item.type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg border bg-white p-3 shadow-sm transition hover:border-blue-400 active:cursor-grabbing"
    >
      {item.label}
    </div>
  );
}

// --------------------------------------------------
// Sortable Form Block
// --------------------------------------------------

function SortableFormBlock({
  block,
  selected,
  onSelect,
}: {
  block: FormBlock;
  selected: boolean;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={`group relative mb-4 cursor-grab rounded-lg border bg-white p-4 shadow-sm active:cursor-grabbing ${
        selected
          ? "border-blue-500 ring-2 ring-blue-100"
          : "border-gray-200"
      }`}
    >
      {block.type === "input" && (
        <div className="space-y-2">
          <Label>{block.label}</Label>
          <Input placeholder={block.placeholder} disabled />
        </div>
      )}

      {block.type === "textarea" && (
        <div className="space-y-2">
          <Label>{block.label}</Label>
          <Textarea placeholder={block.placeholder} disabled />
        </div>
      )}

      {block.type === "button" && (
        <Button type="button">{block.label}</Button>
      )}

      {selected && (
        <div className="absolute right-2 top-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
          Selected
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// Canvas
// --------------------------------------------------

function FormCanvas({
  blocks,
  selectedId,
  onSelect,
}: {
  blocks: FormBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[600px] rounded-xl border-2 border-dashed p-6 transition-colors ${
        isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
    >
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">Contact Form</h2>
          <p className="text-sm text-gray-500">
            Drag components here to build your form
          </p>
        </div>

        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableFormBlock
              key={block.id}
              block={block}
              selected={selectedId === block.id}
              onSelect={() => onSelect(block.id)}
            />
          ))}
        </SortableContext>

        {blocks.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center text-center text-sm text-gray-400">
            Drag a component from the left panel and drop it here
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------
// Properties Panel
// --------------------------------------------------

function PropertiesPanel({
  block,
  onUpdate,
  onDelete,
}: {
  block: FormBlock | null;
  onUpdate: (updates: Partial<FormBlock>) => void;
  onDelete: () => void;
}) {
  if (!block) {
    return (
      <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-500">
        Select a component to edit its properties.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4">
      <h2 className="font-semibold">Properties</h2>

      <div className="space-y-2">
        <Label>Label</Label>
        <Input
          value={block.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </div>

      {block.type !== "button" && (
        <div className="space-y-2">
          <Label>Placeholder</Label>
          <Input
            value={block.placeholder ?? ""}
            onChange={(e) =>
              onUpdate({ placeholder: e.target.value })
            }
          />
        </div>
      )}

      <Button
        variant="destructive"
        className="w-full"
        onClick={onDelete}
      >
        Delete Component
      </Button>
    </div>
  );
}

// --------------------------------------------------
// Main Builder Page
// --------------------------------------------------

export default function BuilderPage() {
  const [blocks, setBlocks] = useState<FormBlock[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const selectedBlock =
    blocks.find((block) => block.id === selectedId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeData = active.data.current;

    // ----------------------------------------------
    // Sidebar → Canvas
    // ----------------------------------------------

    if (activeData?.type === "sidebar") {
      const blockType = activeData.blockType as BlockType;

      const newBlock = createBlock(blockType);

      setBlocks((currentBlocks) => [...currentBlocks, newBlock]);
      setSelectedId(newBlock.id);

      return;
    }

    // ----------------------------------------------
    // Reorder blocks inside canvas
    // ----------------------------------------------

    if (active.id !== over.id) {
      setBlocks((currentBlocks) => {
        const oldIndex = currentBlocks.findIndex(
          (block) => block.id === active.id
        );

        const newIndex = currentBlocks.findIndex(
          (block) => block.id === over.id
        );

        if (oldIndex === -1 || newIndex === -1) {
          return currentBlocks;
        }

        return arrayMove(currentBlocks, oldIndex, newIndex);
      });
    }
  }

  function updateSelectedBlock(updates: Partial<FormBlock>) {
    if (!selectedId) return;

    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === selectedId
          ? { ...block, ...updates }
          : block
      )
    );
  }

  function deleteSelectedBlock() {
    if (!selectedId) return;

    setBlocks((currentBlocks) =>
      currentBlocks.filter((block) => block.id !== selectedId)
    );

    setSelectedId(null);
  }

  function getOverlayContent() {
    if (!activeId) return null;

    if (activeId.startsWith("sidebar-")) {
      const type = activeId.replace("sidebar-", "") as BlockType;

      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          {componentItems.find((item) => item.type === type)?.label}
        </div>
      );
    }

    const block = blocks.find((block) => block.id === activeId);

    if (!block) return null;

    return (
      <div className="rounded-lg border bg-white p-4 shadow-lg">
        {block.label}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Mini Form Builder</h1>
          <p className="text-sm text-gray-500">
            Drag components onto the canvas to create your form.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr_260px]">
          {/* Sidebar */}
          <aside className="space-y-3">
            <h2 className="font-semibold">Components</h2>

            {componentItems.map((item) => (
              <SidebarItem key={item.type} item={item} />
            ))}
          </aside>

          {/* Canvas */}
          <main>
            <FormCanvas
              blocks={blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </main>

          {/* Properties */}
          <aside>
            <PropertiesPanel
              block={selectedBlock}
              onUpdate={updateSelectedBlock}
              onDelete={deleteSelectedBlock}
            />
          </aside>
        </div>
      </div>

      <DragOverlay>{getOverlayContent()}</DragOverlay>
    </DndContext>
  );
}
