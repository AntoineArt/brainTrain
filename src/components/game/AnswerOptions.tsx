'use client';

interface AnswerOptionsProps {
  options: string[];
  onSelect: (index: number) => void;
  disabled?: boolean;
  selectedIndex?: number | null;
  correctIndex?: number | null;
}

export function AnswerOptions({
  options,
  onSelect,
  disabled = false,
  selectedIndex = null,
  correctIndex = null,
}: AnswerOptionsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 w-full max-w-sm mx-auto px-4">
      {options.map((option, i) => {
        let classes = 'bg-surface border-border hover:border-primary/40';
        if (selectedIndex !== null) {
          if (i === correctIndex) {
            classes = 'bg-success/10 border-success';
          } else if (i === selectedIndex && i !== correctIndex) {
            classes = 'bg-error/10 border-error';
          }
        }

        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            className={`
              w-full px-4 py-3 rounded-xl border-2 text-left font-medium text-sm
              transition-all duration-150 touch-manipulation cursor-pointer
              active:scale-[0.98] disabled:cursor-default
              animate-fade-in
              ${classes}
            `}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
