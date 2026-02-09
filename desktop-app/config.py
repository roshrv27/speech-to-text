import os, sys

if getattr(sys, "frozen", False):
    app_dir = os.path.dirname(sys.executable)
else:
    app_dir = os.path.dirname(os.path.abspath(__file__))

DEEPGRAM_API_KEY = os.getenv(
    "DEEPGRAM_API_KEY", "63728984c4c5d8a831937f9b08e0bd5cc1cbc892"
)
DEFAULT_LANGUAGE = os.getenv("LANGUAGE", "en")
TYPING_DELAY = float(os.getenv("TYPING_DELAY", "0.015"))
HOTKEY_COMBO = "<ctrl>+<shift>+s"
