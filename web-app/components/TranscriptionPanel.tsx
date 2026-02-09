'use client'

interface TranscriptionPanelProps {
  transcript: string
  interimText: string
}

export function TranscriptionPanel({ transcript, interimText }: TranscriptionPanelProps) {
  return (
    <div className="w-full h-64 md:h-96 bg-gray-800 rounded-lg p-4 overflow-y-auto border border-gray-700">
      {transcript || interimText ? (
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {transcript}
          <span className="text-gray-400 italic">{interimText}</span>
        </p>
      ) : (
        <p className="text-gray-500 text-center mt-20">
          Click &quot;Start&quot; and begin speaking...
        </p>
      )}
    </div>
  )
}
