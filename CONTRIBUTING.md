# Contributing to RYD Mobile Fork

Thank you for your interest in contributing to **RYD Mobile Fork**! We welcome bug fixes, mobile YouTube DOM improvements, performance optimizations, and localization updates.

### Core Concepts
1. **DOM Injection (`ryd.content-script.js`)**: Observes YouTube's Single Page Application navigation events (`yt-navigate-finish`, `MutationObserver`). It identifies like/dislike button containers on both `m.youtube.com` and desktop YouTube, fetches estimates from the public RYD API, and renders the dislike counter and rating ratio bar.
2. **Options Interface (`popup.html` / `popup.js`)**: Manages user preferences (like/dislike bar theme, number format, vote submission opt-out) via `chrome.storage.sync` / `chrome.storage.local`.
3. **DOM Security Standards**: Mozilla Add-ons policy strictly forbids unsafe dynamic HTML manipulation. All DOM nodes must be created using standard DOM APIs (`document.createElement`, `textContent`, `setAttribute`, `appendChild`) rather than raw `innerHTML` or `insertAdjacentHTML`.

---

## Prerequisites

- **Node.js** (v18 or later) & **npm**.
- **Firefox for Android** (for physical device mobile testing).

---

## Local Development & Debugging

### 1. Clone the Repository
```bash
git clone https://github.com/saivan4ick/RYD-Mobile-Fork.git
cd RYD-Mobile-Fork
```

### 2. Live Reload via `web-ext`
You can run an automated development instance using Mozilla's official tool:
```bash
npx web-ext run
```
This launches a fresh Firefox instance with the extension pre-installed and auto-reloads whenever files change.

### 3. Testing on Android
1. Enable **USB Debugging** on your Android phone.
2. Connect your device via USB.
3. And ```web-ext run -t firefox-android``` then test on YouTube videos

---

## Linting & Quality Verification

Before submitting any Pull Request, you **must** run Mozilla's linter:

```bash
npx web-ext lint
```

> **Acceptance Criteria:** Must pass with **0 errors** (`errors: 0`) and **0 security warnings** (`UNSAFE_VAR_ASSIGNMENT`).

Verify JavaScript syntax:
```bash
node -c ryd.content-script.js popup.js ryd.background.js menu-fixer.js
```

---

## Building the Extension Package

To package the extension for distribution or testing:

```bash
npx web-ext build --overwrite-dest
```

The output archive will be placed in `web-ext-artifacts/ryd_mobile_fork-4.0.6.zip`.  
You can rename or copy this file to `.xpi` for direct browser installation.

---

## Code Guidelines

1. **Strict DOM Security:**
   - **Never** assign untrusted dynamic strings directly to `.innerHTML` or `.outerHTML`.
   - Use `element.textContent` for plain text.
   - For structured HTML, construct elements via `document.createElement()` or parse using `new DOMParser().parseFromString(..., 'text/html')` and append DOM nodes.
   - **Never** use `new Function()`, `eval()`, or `insertAdjacentHTML()` with interpolated variables.
2. **Mobile YouTube DOM Fragility:**
   - YouTube frequently changes internal class names and DOM structures on `m.youtube.com`. When fixing broken dislike counters, inspect the active YouTube mobile DOM tree and make sure selectors are flexible and properly guarded with null checks.
3. **Preserve Code Cleanliness:**
   - Keep scripts clean and concise; do not commit unnecessary debug comments or console logs in production scripts.

---

## Submitting a Pull Request (Example)

1. **Fork** the repository: [saivan4ick/RYD-Mobile-Fork](https://github.com/saivan4ick/RYD-Mobile-Fork).
2. **Create a branch** for your fix or feature:
   ```bash
   git checkout -b fix/mobile-layout-selectors
   ```
3. **Commit** your changes with a clear message:
   ```bash
   git commit -m "Update mobile YouTube action bar selector"
   ```
4. **Push** to your fork:
   ```bash
   git push origin fix/mobile-layout-selectors
   ```
5. Open a **Pull Request** against `main` explaining the problem solved and how it was tested.
