'use client'

import { useState, useCallback } from 'react'
import { useDeepgram } from '@/hooks/useDeepgram'
import { useAudioLevel } from '@/hooks/useAudioLevel'
import { TranscriptionPanel } from '@/components/TranscriptionPanel'
import { AudioVisualizer } from '@/components/AudioVisualizer'
import { LanguageSelector } from '@/components/LanguageSelector'
import { ControlBar } from '@/components/ControlBar'

export default function Home() {
  const [language, setLanguage] = useState('en')

  const { isListening, transcript, interimText, error, stream, start, stop, clear } = useDeepgram({
    language,
  })

  const audioLevel = useAudioLevel(stream)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(transcript)
  }, [transcript])

  const handleExport = useCallback(() => {
    const blob = new Blob([transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [transcript])

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Speech to Text</h1>
        <p className="text-gray-400 text-center mb-8">
          Real-time transcription powered by Deepgram
        </p>

        <div className="flex justify-center mb-6">
          <AudioVisualizer level={audioLevel} isActive={isListening} />
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Language:</label>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              disabled={isListening}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 mb-6 text-center">
            {error}
          </div>
        )}

        <TranscriptionPanel transcript={transcript} interimText={interimText} />

        <div className="mt-6">
          <ControlBar
            isRecording={isListening}
            onStart={start}
            onStop={stop}
            onCopy={handleCopy}
            onExport={handleExport}
            onClear={clear}
            hasContent={transcript.length > 0}
          />
        </div>

        {isListening && (
          <p className="text-center text-green-500 mt-4 text-sm">
            Listening... Speak into your microphone
          </p>
        )}
      </div>
    </main>
  )
}
