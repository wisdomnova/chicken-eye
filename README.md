# Chicken Eye

A minimalist, lightweight Chrome extension that adds a clean Tabler eye toggle to password fields across all websites that do not already have one.

## Features

- **Tabler Icons**: Clean vector SVG icons for show (`eye`) and hide (`eye-off`).
- **Dynamic Sizing**: Matches input font size and rendered dimensions automatically.
- **Precision Centering**: Exact vertical centering aligned with the field's center line.
- **Smart Detection**: Detects password inputs on initial load and in dynamic single-page applications (SPAs) while avoiding duplicate buttons on sites with existing eye toggles.
- **Minimalist Aesthetic**: Pure, clean design with Geist typography, neutral tones, no borders, no shadows, no gradients, and no clutter.
- **Dark Mode Support**: Automatically adapts to system light and dark themes.

## Installation

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select this directory.

## Project Structure

```
├── manifest.json       # Chrome Manifest V3 configuration
├── content.js          # Password detection, dynamic sizing, and toggle logic
├── content.css         # Minimal styling and centering for the injected icon
├── popup.html          # Extension popup UI
├── popup.css           # Minimalist popup styling (Geist font)
├── popup.js            # Enable/disable toggle storage handler
├── icons/              # Extension icons (16, 48, 128)
└── test_page.html      # Local testing environment for various input sizes
```
