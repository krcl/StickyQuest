export default function CompletedLog({ history, onClear }) {
  if (history.length === 0) return null;

  return (
    <div className="completed-log">
      <div className="board-header">
        <span className="board-title">Chronicle</span>
        <span className="board-count">{history.length} / 10</span>
        <button className="chronicle-clear-btn" onClick={onClear} title="Clear chronicle">Clear</button>
      </div>
      <ul className="completed-log-list">
        {history.map((q) => (
          <li key={q.id + q.completedAt} className="completed-log-item">
            <span className="completed-log-check">✓</span>
            <span className="completed-log-title">{q.quest_title}</span>
            <span className={`completed-log-dot urgency-dot--${q.urgency_level}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
