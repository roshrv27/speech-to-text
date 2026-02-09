import threading
import platform
from pynput import keyboard
from config import DEEPGRAM_API_KEY, DEFAULT_LANGUAGE, TYPING_DELAY
from transcriber import Transcriber
from typer import Typer
from tray_icon import create_icon, get_icon_image, get_hotkey
from languages import LANGUAGES

is_active = False
current_language = DEFAULT_LANGUAGE
icon_instance = None

typer = Typer(typing_delay=TYPING_DELAY)
transcriber = Transcriber(
    api_key=DEEPGRAM_API_KEY,
    language=DEFAULT_LANGUAGE,
    on_transcript=typer.type_text,
)


def toggle(icon=None, item=None):
    global is_active
    if is_active:
        transcriber.stop()
        print("[SpeechToText] Stopped")
    else:
        transcriber.start()
        print("[SpeechToText] Listening...")
    is_active = not is_active
    if icon_instance:
        icon_instance.icon = get_icon_image(active=is_active)
        status = "Listening..." if is_active else "Idle"
        icon_instance.title = f"SpeechToText - {status}"


def change_language(lang_code):
    global current_language
    current_language = lang_code
    transcriber.set_language(lang_code)
    print(f"[SpeechToText] Language changed to: {lang_code}")


def get_current_language():
    return current_language


def quit_app(icon, item):
    transcriber.stop()
    icon.stop()


def start_hotkey_listener():
    hotkey = get_hotkey()
    with keyboard.GlobalHotKeys({hotkey: toggle}) as listener:
        listener.join()


if __name__ == "__main__":
    if not DEEPGRAM_API_KEY:
        print("ERROR: DEEPGRAM_API_KEY not set.")
        input("Press Enter to exit...")
        exit(1)

    print(f"[SpeechToText] Starting... Hotkey: {get_hotkey()}")

    hotkey_thread = threading.Thread(target=start_hotkey_listener, daemon=True)
    hotkey_thread.start()

    icon_instance = create_icon(
        toggle, change_language, quit_app, LANGUAGES, get_current_language
    )
    icon_instance.run()
