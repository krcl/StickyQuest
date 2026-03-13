import { useState, useEffect, useRef } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { LogicalSize } from '@tauri-apps/api/dpi';
import QuestBoard from './components/QuestBoard';
import AddTaskForm from './components/AddTaskForm';
import CompletedLog from './components/CompletedLog';
import { transformTask } from './utils/questTransformer';
import { sendNotification, isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification';
import './styles/App.css';

const STORAGE_KEY = 'stickyquest_quests';
const HISTORY_KEY = 'stickyquest_history';
const COLLAPSED = new LogicalSize(70, 70);
const EXPANDED  = new LogicalSize(400, 700);

function loadQuests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function App() {
  const [quests, setQuests]     = useState(loadQuests);
  const [history, setHistory]   = useState(loadHistory);
  const [expanded, setExpanded] = useState(false);
  const notifiedRef = useRef(new Set());

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(quests)); }, [quests]);
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }, [history]);

  async function expand() {
    await getCurrentWindow().setSize(EXPANDED);
    setExpanded(true);
  }

  async function collapse() {
    await getCurrentWindow().setSize(COLLAPSED);
    setExpanded(false);
  }

  useEffect(() => {
    async function checkDeadlines() {
      let permitted = await isPermissionGranted();
      if (!permitted) {
        const result = await requestPermission();
        permitted = result === 'granted';
      }
      if (!permitted) return;

      const now = Date.now();
      for (const quest of quests) {
        if (!quest.deadline) continue;
        const ms = new Date(quest.deadline).getTime();
        const diff = ms - now;
        const keySoon = `${quest.id}:soon`;
        const keyDue  = `${quest.id}:due`;
        if (diff > 0 && diff <= 30 * 60_000 && !notifiedRef.current.has(keySoon)) {
          notifiedRef.current.add(keySoon);
          await sendNotification({ title: 'Quest Expiring Soon!',
            body: `"${quest.quest_title}" is due in less than 30 minutes!` });
        }
        if (diff <= 0 && diff > -60_000 && !notifiedRef.current.has(keyDue)) {
          notifiedRef.current.add(keyDue);
          await sendNotification({ title: 'Quest Overdue!',
            body: `"${quest.quest_title}" deadline has passed!` });
        }
      }
    }
    checkDeadlines();
    const id = setInterval(checkDeadlines, 60_000);
    return () => clearInterval(id);
  }, [quests]);

  function handleAddTask(rawTask, urgencyOverride, notes, deadline) {
    const quest = transformTask(rawTask, urgencyOverride, notes, deadline);
    setQuests((prev) => [quest, ...prev]);
  }

  function handleToggleQuest(id) {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;
    setQuests((prev) => prev.filter((q) => q.id !== id));
    setHistory((prev) =>
      [{ ...quest, completedAt: new Date().toISOString() }, ...prev].slice(0, 10)
    );
  }

  const activeCount = quests.length;

  if (!expanded) {
    return (
      <div className="app app--collapsed" data-tauri-drag-region onClick={expand}>
        <span className={`collapse-icon${activeCount > 0 ? ' collapse-icon--pending' : ''}`}>!</span>
      </div>
    );
  }

  return (
    <div className="app" data-tauri-drag-region>
      {/* Animated sky background */}
      <div className="forest-bg" aria-hidden="true">
        <div className="cloud cloud--1" />
        <div className="cloud cloud--2" />
        <div className="cloud cloud--3" />
        <div className="cloud cloud--4" />
        <div className="cloud cloud--5" />
        <div className="cloud cloud--6" />
        <div className="cloud cloud--7" />
      </div>

      {/* Scrollable content layer */}
      <div className="app-content" data-tauri-drag-region>
        <header className="app-header" data-tauri-drag-region>
          <button className="collapse-btn" onClick={collapse} title="Minimise">×</button>
          <h1 className="app-title">StickyQuest</h1>
          <p className="app-subtitle">Transform your tasks into epic quests</p>
        </header>

        <section className="form-section">
          <p className="form-section-label">New Quest</p>
          <AddTaskForm onAdd={handleAddTask} />
        </section>

        <div className="board-header">
          <span className="board-title">Quest Board</span>
          {activeCount > 0 && (
            <span className="board-count">
              {activeCount} active
            </span>
          )}
        </div>

        <QuestBoard quests={quests} onToggle={handleToggleQuest} />
        <CompletedLog history={history} onClear={() => setHistory([])} />
      </div>
    </div>
  );
}
