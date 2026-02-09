import pystray
from PIL import Image, ImageDraw
import platform


def get_icon_image(active=False):
    size = 64
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    color = (59, 130, 246, 255) if active else (107, 114, 128, 255)

    padding = 8
    draw.ellipse(
        [padding, padding, size - padding, size - padding],
        fill=color,
        outline=(255, 255, 255, 100),
        width=2,
    )

    if active:
        center_x = size // 2
        center_y = size // 2
        mic_width = 10
        mic_height = 20

        draw.rounded_rectangle(
            [
                center_x - mic_width // 2,
                center_y - mic_height // 2,
                center_x + mic_width // 2,
                center_y + mic_height // 4,
            ],
            radius=5,
            fill=(255, 255, 255, 255),
        )

    return img


def get_hotkey():
    system = platform.system()
    if system == "Darwin":
        return "<cmd>+<shift>+s"
    return "<ctrl>+<shift>+s"


def get_hotkey_display():
    system = platform.system()
    if system == "Darwin":
        return "Cmd+Shift+S"
    return "Ctrl+Shift+S"


def create_icon(
    on_toggle, on_language_change, on_quit, languages, get_current_language
):
    image = get_icon_image(active=False)

    lang_items = []
    for code, name in languages:

        def make_lang_item(lang_code):
            def callback(icon, item):
                on_language_change(lang_code)

            return callback

        def make_checked(lang_code):
            def checked(item):
                return get_current_language() == lang_code

            return checked

        lang_items.append(
            pystray.MenuItem(name, make_lang_item(code), checked=make_checked(code))
        )

    hotkey_display = get_hotkey_display()

    menu = pystray.Menu(
        pystray.MenuItem(f"Toggle ({hotkey_display})", on_toggle, default=True),
        pystray.MenuItem("Language", pystray.Menu(*lang_items)),
        pystray.Menu.SEPARATOR,
        pystray.MenuItem("Quit", on_quit),
    )

    icon = pystray.Icon("SpeechToText", image, "SpeechToText", menu)
    return icon
