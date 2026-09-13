import os
from PIL import Image, ImageDraw

os.makedirs('/Users/user/chicken-eye/icons', exist_ok=True)

def draw_minimal_icon(size):
    scale = 4
    canvas_size = size * scale
    img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Modern squircle container with pleasant warm dark tone
    bg_color = (24, 24, 27, 255) # Zinc-900 / sleek obsidian
    dot_color = (250, 250, 250, 255) # Crisp minimal off-white
    
    # Padding and squircle radius
    pad = int(canvas_size * 0.04)
    radius = int((canvas_size - 2 * pad) * 0.32)
    
    draw.rounded_rectangle(
        [pad, pad, canvas_size - pad - 1, canvas_size - pad - 1],
        radius=radius,
        fill=bg_color
    )
    
    # Iconic minimalist eye-pupil dot positioned pleasingly
    # Center-left offset like the reference image or clean center-balanced
    # Reference image has the circular aperture at lower-left offset
    dot_diameter = int(canvas_size * 0.28)
    # Position in lower-left / center quadrant matching the reference aesthetic
    dot_x = int(canvas_size * 0.26)
    dot_y = int(canvas_size * 0.48)
    
    draw.ellipse(
        [dot_x, dot_y, dot_x + dot_diameter, dot_y + dot_diameter],
        fill=dot_color
    )
    
    # Antialiased downscale
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    return img

for s in [16, 48, 128]:
    icon = draw_minimal_icon(s)
    icon.save(f'/Users/user/chicken-eye/icons/icon{s}.png')
    print(f'Generated new pleasant icon{s}.png')
