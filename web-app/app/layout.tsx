import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Speech to Text',
  description: 'Real-time speech transcription powered by Deepgram',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
