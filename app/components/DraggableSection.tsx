'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
  isEditMode: boolean;
  isEnabled: boolean;
  onToggleVisibility?: () => void;
}

export default function DraggableSection({
  id,
  children,
  isEditMode,
  isEnabled,
  onToggleVisibility,
}: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isEnabled ? 1 : 0.4,
  };

  if (!isEditMode && !isEnabled) {
    return null; // Hide disabled sections when not in edit mode
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isEditMode ? 'cursor-move' : ''}`}
    >
      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="absolute -left-12 top-4 z-20 flex flex-col gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-2 bg-[#D4AF37] hover:bg-[#F4C430] text-[#1A2332] rounded-lg shadow-lg transition-all hover:scale-110 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical size={20} />
          </button>

          {/* Toggle Visibility */}
          <button
            onClick={onToggleVisibility}
            className={`p-2 rounded-lg shadow-lg transition-all hover:scale-110 ${
              isEnabled
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
            title={isEnabled ? 'Hide section' : 'Show section'}
          >
            {isEnabled ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      )}

      {/* Section Content */}
      <div
        className={`${isEditMode ? 'border-2 border-dashed border-[#D4AF37]/50 rounded-xl p-2' : ''}`}
      >
        {children}
      </div>

      {/* Edit Mode Overlay */}
      {isEditMode && !isEnabled && (
        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Section Hidden
          </div>
        </div>
      )}
    </div>
  );
}
