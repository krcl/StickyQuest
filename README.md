# StickyQuest

A gamified task manager that transforms your everyday to-dos into RPG-style quests. Built as a lightweight always-on-top desktop overlay using Tauri, React, and Vite.

---

## Features

- **Quest Board** — tasks are automatically reworded into epic quest titles with urgency badges
- **Auto urgency detection** — keywords like "today" or "asap" set High priority; "tomorrow" or "soon" set Medium
- **Quest notes** — optionally attach a description/notes to any quest
- **Chronicle** — tracks the last 10 completed quests with a one-click clear button
- **Collapsible overlay** — collapses to a small blinking `!` badge when quests are pending; expands to full panel on click
- **Always on top** — floats above all other windows so your quests stay visible
- **Frameless & draggable** — no title bar; drag by the header to reposition
- **System tray** — Show/Hide and Quit from the tray icon
- **Global shortcut** — `Ctrl+Shift+Q` toggles the window from anywhere
- **Persistent storage** — quests survive app restarts via localStorage

---

## Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19 + plain CSS |
| Build | Vite 7 |
| Desktop shell | Tauri 2 |
| Language (backend) | Rust |
| Storage | localStorage (WebView) |

---

## Project Structure

```
StickyQuest/
├── src/
│   ├── App.jsx                  # Root component, state & localStorage
│   ├── components/
│   │   ├── AddTaskForm.jsx      # New quest form (title + urgency + notes)
│   │   ├── QuestBoard.jsx       # Grid of active quest cards
│   │   ├── QuestCard.jsx        # Individual quest card with collapse toggle
│   │   └── CompletedLog.jsx     # Chronicle — last 10 completed quests
│   ├── styles/
│   │   ├── App.css              # App shell, sky background, clouds, header
│   │   ├── QuestCard.css        # Card styles
│   │   └── AddTaskForm.css      # Form styles
│   └── utils/
│       └── questTransformer.js  # Rule-based task → quest conversion
└── src-tauri/
    ├── src/
│   │   ├── lib.rs               # System tray, global shortcut, window toggle
    │   └── main.rs              # Entry point
    ├── tauri.conf.json          # Window config (frameless, transparent, always-on-top)
    └── Cargo.toml               # Rust dependencies
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ (or 22+)
- [Rust](https://www.rust-lang.org/tools/install)
- Linux system dependencies (Ubuntu/Debian):

```bash
sudo apt install -y libwebkit2gtk-4.1-dev build-essential libxdo-dev \
  libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

### Install

```bash
npm install
```

### Dev mode

```bash
npm run tauri:dev
```

The first run compiles the Rust code and takes a few minutes. Subsequent runs are faster.

### Production build

```bash
npm run tauri:build
```

Binary output: `src-tauri/target/release/`

---

## How It Works

When you type a task (e.g. *"Do my taxes today"*), `questTransformer.js` strips filler words, picks a deterministic action prefix, and builds a quest title like **"Investigate Taxes Today"**. Urgency is inferred from keywords in the raw text, or can be set manually via the dropdown.

Completing a quest removes it from the board and appends it to the Chronicle (capped at 10 entries), persisted in localStorage under `stickyquest_history`.

---

## License

MIT
