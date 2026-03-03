import { useState } from 'react';
import '../styles/AddTaskForm.css';

export default function AddTaskForm({ onAdd }) {
  const [task, setTask] = useState('');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState('auto');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = task.trim();
    if (!trimmed) return;
    onAdd(trimmed, urgency, notes.trim());
    setTask('');
    setNotes('');
    setUrgency('auto');
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className="add-task-row">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task, e.g. 'Do taxes today'"
          aria-label="Task"
          autoFocus
        />
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          aria-label="Urgency level"
        >
          <option value="auto">Auto urgency</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button type="submit">+ Add</button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)..."
        aria-label="Quest notes"
        rows={2}
      />
    </form>
  );
}
