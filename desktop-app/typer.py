from pynput.keyboard import Controller
import time


class Typer:
    def __init__(self, typing_delay=0.015):
        self.keyboard = Controller()
        self.typing_delay = typing_delay

    def type_text(self, text):
        if not text or not text.strip():
            return
        for char in text:
            self.keyboard.type(char)
            if self.typing_delay > 0:
                time.sleep(self.typing_delay)
        self.keyboard.type(" ")
