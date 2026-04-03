interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  id?: string;
}

export function ErrorMessage({ 
  message, 
  type = 'error', 
  onDismiss,
  id 
}: ErrorMessageProps) {
  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      id={id}
      role="alert"
      className={`mt-3 p-3 rounded-lg border ${styles[type]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex items-start gap-2">
          <span className="text-lg mt-0.5">{icons[type]}</span>
          <span>{message}</span>
        </span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Cerrar mensaje"
            className="text-lg hover:opacity-70 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}