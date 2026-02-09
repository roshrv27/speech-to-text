from deepgram import (
    DeepgramClient,
    DeepgramClientOptions,
    LiveOptions,
    LiveTranscriptionEvents,
)
import pyaudio
import threading


class Transcriber:
    def __init__(self, api_key, language="en", on_transcript=None):
        self.api_key = api_key
        self.language = language
        self.on_transcript = on_transcript
        self.running = False
        self.connection = None
        self._mic_thread = None

    def start(self):
        if self.running:
            return

        config = DeepgramClientOptions(options={"keepalive": "true"})
        client = DeepgramClient(self.api_key, config)
        self.connection = client.listen.websocket.v("1")

        transcriber_self = self

        def on_message(ws_self, result, **kwargs):
            transcript = result.channel.alternatives[0].transcript
            if transcript.strip() and result.is_final:
                if transcriber_self.on_transcript:
                    transcriber_self.on_transcript(transcript)

        def on_error(ws_self, error, **kwargs):
            print(f"[Deepgram Error] {error}")

        self.connection.on(LiveTranscriptionEvents.Transcript, on_message)
        self.connection.on(LiveTranscriptionEvents.Error, on_error)

        self.connection.start(
            LiveOptions(
                model="nova-3",
                language=self.language,
                punctuate=True,
                smart_format=True,
                interim_results=False,
                encoding="linear16",
                sample_rate=16000,
                channels=1,
            )
        )

        self.running = True
        self._mic_thread = threading.Thread(target=self._stream_mic, daemon=True)
        self._mic_thread.start()

    def _stream_mic(self):
        audio = pyaudio.PyAudio()
        stream = audio.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=16000,
            input=True,
            frames_per_buffer=4096,
        )
        try:
            while self.running:
                data = stream.read(4096, exception_on_overflow=False)
                if self.connection:
                    self.connection.send(data)
        finally:
            stream.stop_stream()
            stream.close()
            audio.terminate()

    def stop(self):
        self.running = False
        if self.connection:
            try:
                self.connection.finish()
            except Exception:
                pass
            self.connection = None

    def set_language(self, language_code):
        was_running = self.running
        if was_running:
            self.stop()
        self.language = language_code
        if was_running:
            self.start()
