'use client'

interface ControlBarProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
  onCopy: () => void
  onExport: () => void
  onClear: () => void
  hasContent: boolean
}

export function ControlBar({
  isRecording,
  onStart,
  onStop,
  onCopy,
  onExport,
  onClear,
  hasContent,
}: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {isRecording ? (
        <button
          onClick={onStop}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
        >
          Stop
        </button>
      ) : (
        <button
          onClick={onStart}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Start
        </button>
      )}

      <button
        onClick={onCopy}
        disabled={!hasContent}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        Copy
      </button>

      <button
        onClick={onExport}
        disabled={!hasContent}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        Export .txt
      </button>

      <button
        onClick={onClear}
        disabled={!hasContent}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        Clear
      </button>
    </div>
  )
}
