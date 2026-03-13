import { useState } from 'react';
import '../styles/QuestCard.css';

const URGENCY_LABELS = {
  high:   'High Priority',
  medium: 'Medium Priority',
  low:    'Low Priority',
};

function getDeadlineClass(deadline) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return 'deadline--overdue';
  if (diff <= 24 * 60 * 60_000) return 'deadline--warn';
  return 'deadline--ok';
}

function formatDeadline(deadline) {
  return new Date(deadline).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function QuestCard({ quest, onToggle }) {
  const { quest_title, quest_description, objective, notes, urgency_level, completed, deadline } = quest;
  const [collapsed, setCollapsed] = useState(false);

  function handleCollapseToggle(e) {
    e.stopPropagation();
    setCollapsed((c) => !c);
  }

  return (
    <div
      className={`quest-card${completed ? ' completed' : ''}${collapsed ? ' collapsed' : ''}`}
      onClick={() => onToggle(quest.id)}
      role="button"
      aria-pressed={completed}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onToggle(quest.id)}
    >
      <div className="quest-badge">!</div>

      <button
        className="quest-collapse-btn"
        onClick={handleCollapseToggle}
        aria-label={collapsed ? 'Expand quest' : 'Collapse quest'}
      >
        {collapsed ? '▲' : '▼'}
      </button>

      <span className={`urgency-tag urgency-${urgency_level}`}>
        {URGENCY_LABELS[urgency_level]}
      </span>

      <h2 className="quest-title">{quest_title}</h2>

      <div className="quest-card-body">
        <p className="quest-description">{quest_description}</p>
        <p className="quest-objective">
          <span>Objective: </span>{objective}
        </p>
        {notes && <p className="quest-notes">{notes}</p>}
        {deadline && (
          <p className={`quest-deadline ${getDeadlineClass(deadline)}`}>
            Due: {formatDeadline(deadline)}
          </p>
        )}
        {completed && <div className="quest-complete-indicator">&#10003; Completed</div>}
      </div>
    </div>
  );
}
