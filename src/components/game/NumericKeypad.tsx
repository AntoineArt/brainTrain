'use client';

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function NumericKeypad({ value, onChange, onSubmit }: NumericKeypadProps) {
  const handleKey = (key: string) => {
    if (key === 'delete') {
      onChange(value.slice(0, -1));
    } else if (key === 'submit') {
      if (value.length > 0) onSubmit();
    } else if (key === '-') {
      if (value.length === 0) {
        onChange('-');
      }
    } else {
      if (value.length < 6) {
        onChange(value + key);
      }
    }
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['-', '0', 'delete'],
  ];

  return (
    <div className="w-full max-w-xs mx-auto px-4 pb-3">
      {/* Display */}
      <div className="text-center mb-3 px-4 py-2.5 bg-surface-light border border-border rounded-xl">
        <span className="text-2xl font-bold tabular-nums min-h-[2rem] block">
          {value || <span className="text-muted/50">?</span>}
        </span>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-1.5">
        {keys.flat().map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className={`
              h-12 rounded-xl font-bold text-lg transition-all duration-100
              touch-manipulation cursor-pointer active:scale-95
              ${key === 'delete'
                ? 'bg-error/15 text-error hover:bg-error/25'
                : 'bg-surface-light border border-border text-foreground hover:bg-surface hover:border-primary/30'
              }
            `}
          >
            {key === 'delete' ? '⌫' : key}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={() => handleKey('submit')}
        disabled={value.length === 0}
        className="w-full h-12 mt-1.5 rounded-xl font-bold text-lg
          bg-gradient-to-r from-primary to-secondary text-white
          shadow-lg shadow-primary/25
          transition-all duration-100 touch-manipulation cursor-pointer active:scale-[0.97]
          disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
      >
        Valider
      </button>
    </div>
  );
}
