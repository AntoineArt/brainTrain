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
    <div className="w-full max-w-sm mx-auto px-4 pb-4">
      {/* Display */}
      <div className="text-center mb-4 px-4 py-3 bg-surface border border-border rounded-xl">
        <span className="text-3xl font-bold tabular-nums min-h-[2.5rem] block">
          {value || <span className="text-muted">?</span>}
        </span>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2">
        {keys.flat().map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className={`
              h-14 rounded-xl font-bold text-xl transition-all duration-100
              touch-manipulation cursor-pointer active:scale-95
              ${key === 'delete'
                ? 'bg-error/10 text-error'
                : 'bg-surface border border-border text-foreground hover:bg-background'
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
        className="w-full h-14 mt-2 rounded-xl font-bold text-xl bg-primary text-white
          transition-all duration-100 touch-manipulation cursor-pointer active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Valider
      </button>
    </div>
  );
}
