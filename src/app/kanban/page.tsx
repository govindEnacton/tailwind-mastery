"use client";

import { useState } from "react";

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
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

// -----------------------------
// Types
// -----------------------------

type ColumnId = "todo" | "in-progress" | "done";

type Task = {
    id: string;
    title: string;
    column: ColumnId;
};

type Column = {
    id: ColumnId;
    title: string;
};

// -----------------------------
// Initial Data
// -----------------------------

const columns: Column[] = [
    { id: "todo", title: "Todo" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
];

const initialTasks: Task[] = [
    { id: "1", title: "Design Navbar", column: "todo" },
    { id: "2", title: "Write Content", column: "todo" },
    { id: "3", title: "Build Login Page", column: "in-progress" },
    { id: "4", title: "Setup Project", column: "done" },
];

// -----------------------------
// Sortable Task Card
// -----------------------------

function SortableTask({ task }: { task: Task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`mb-3 cursor-grab rounded-lg border
    bg-white p-4 shadow-sm active:cursor-grabbing ${isDragging ? "opacity-30" : ""}`}>
            {task.title}
        </div>
    );
}

// -----------------------------
// Task Card for DragOverlay
// -----------------------------

function TaskCard({ task }: { task: Task }) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-lg">
            {task.title}
        </div>
    );
}

// -----------------------------
// Droppable Column
// -----------------------------

function KanbanColumn({
    column,
    tasks,
}: {
    column: Column;
    tasks: Task[];
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });

    return (
        <div ref={setNodeRef} className={`min-h-[350px] rounded-xl border p-4 transition-colors ${isOver
            ? "border-blue-500 bg-blue-50" : "bg-gray-50"}`}>
            <h2 className="mb-4 text-lg font-semibold">{column.title}</h2>

            <SortableContext items={tasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
            >
                {tasks.map((task) => (
                    <SortableTask key={task.id} task={task} />
                ))}
            </SortableContext>
        </div>
    );
}

// -----------------------------
// Main Kanban Page
// -----------------------------

export default function KanbanPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    function handleDragStart(event: DragStartEvent) {
        const task = tasks.find(
            (task) => task.id === String(event.active.id)
        );

        setActiveTask(task ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        setActiveTask(null);

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const activeTask = tasks.find((task) => task.id === activeId);

        if (!activeTask) return;

        // Check whether we're dropping onto a column
        const isColumn = columns.some((column) => column.id === overId);

        if (isColumn) {
            const newColumn = overId as ColumnId;

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === activeId
                        ? { ...task, column: newColumn }
                        : task
                )
            );

            return;
        }

        // Dropping onto another task
        const overTask = tasks.find((task) => task.id === overId);

        if (!overTask) return;

        // If moving to another column
        if (activeTask.column !== overTask.column) {
            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === activeId
                        ? { ...task, column: overTask.column }
                        : task
                )
            );

            return;
        }

        // Reordering within the same column
        const columnTasks = tasks.filter(
            (task) => task.column === activeTask.column
        );

        const oldIndex = columnTasks.findIndex(
            (task) => task.id === activeId
        );

        const newIndex = columnTasks.findIndex(
            (task) => task.id === overId
        );

        if (oldIndex === newIndex) return;

        const reorderedColumnTasks = arrayMove(
            columnTasks,
            oldIndex,
            newIndex
        );

        setTasks((currentTasks) => {
            const otherTasks = currentTasks.filter(
                (task) => task.column !== activeTask.column
            );

            return [...otherTasks, ...reorderedColumnTasks];
        });
    }

    function addTask() {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: `New Task ${tasks.length + 1}`,
            column: "todo",
        };

        setTasks((currentTasks) => [...currentTasks, newTask]);
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="mb-8 text-3xl font-bold">
                    Kanban Board
                </h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {columns.map((column) => (
                        <KanbanColumn key={column.id} column={column} tasks={tasks.filter((task) => task.column ===
                            column.id
                        )}
                        />
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button onClick={addTask}>
                        + Add Task
                    </Button>
                </div>
            </div>

            <DragOverlay>
                {activeTask ?
                    <TaskCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}

// so now i want a linux machine , i am not comfortable with this windows , pleaase provide me linux machine, i won't be able to use this one 
