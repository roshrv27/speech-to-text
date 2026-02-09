from PIL import Image, ImageDraw


def create_icon(size, color, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    padding = size // 8
    draw.ellipse(
        [padding, padding, size - padding, size - padding],
        fill=color,
        outline=(255, 255, 255, 200),
        width=2,
    )

    center_x = size // 2
    center_y = size // 2
    mic_width = size // 6
    mic_height = size // 3

    draw.rounded_rectangle(
        [
            center_x - mic_width // 2,
            center_y - mic_height // 2,
            center_x + mic_width // 2,
            center_y + mic_height // 4,
        ],
        radius=mic_width // 3,
        fill=(255, 255, 255, 255),
    )

    arc_size = mic_width * 2
    arc_top = center_y - mic_height // 2 - 2
    draw.arc(
        [
            center_x - arc_size // 2,
            arc_top - arc_size // 3,
            center_x + arc_size // 2,
            arc_top + arc_size // 2,
        ],
        start=0,
        end=180,
        fill=(255, 255, 255, 255),
        width=max(1, size // 32),
    )

    img.save(filename)
    print(f"Created {filename}")


if __name__ == "__main__":
    blue = (59, 130, 246, 255)

    create_icon(256, blue, "assets/icon.png")
    create_icon(256, blue, "assets/icon.ico")
    create_icon(512, blue, "assets/icon.icns")

    print("All icons created!")
