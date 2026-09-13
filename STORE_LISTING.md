# Chrome Web Store Listing Copy & Submission Guide

Use the information below when filling out your submission in the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## 1. Store Metadata

- **Extension Name**: Chicken Eye - Password Toggle
- **Summary / Short Description** *(132 characters max)*:
  Clean, minimalist password visibility toggle for all websites.
- **Category**: Accessibility / Productivity
- **Primary Language**: English

---

## 2. Detailed Description

```markdown
Chicken Eye is a clean, minimalist extension that adds a password visibility toggle to password fields across all websites.

Features:
- Clean Tabler SVG icons (eye and eye-off).
- Proportional scaling that matches input font size and field dimensions.
- Exact vertical centering inside password inputs.
- Smart detection that avoids duplicate buttons on sites with existing eye toggles.
- Supports single-page applications (SPAs) and dynamically rendered forms.
- Minimalist design with zero borders, zero shadows, zero gradients, and zero clutter.
- Dark mode and light mode automatic adaptation.

Privacy First:
Chicken Eye operates 100% locally in your browser. It does not collect, track, or transmit any data or password contents.
```

---

## 3. Privacy & Justifications for Reviewers

### Single Purpose Description
> Chicken Eye provides a password visibility toggle on HTML password input fields across websites that do not natively offer one.

### Permission Justification: `storage`
> Used exclusively to store the user's enable/disable preference locally across browser sessions.

### Host Permissions / Content Scripts Justification: `<all_urls>`
> Required to inject the content script across websites so password fields on any page can receive the visibility toggle button.

### Data Usage Disclosures
- **Does your product collect user data?** No.
- **Does your product transmit data to remote servers?** No.

---

## 4. Graphic Assets Checklist

1. **Store Icon**: `icons/icon128.png` (128x128 px, PNG format).
2. **Promotional Screenshots**: 1280x800 px or 640x400 px JPEG/PNG showing the toggle on a sample form.
3. **Small Promo Tile (Optional)**: 440x280 px.
4. **Marquee Promo Tile (Optional)**: 1400x560 px.
