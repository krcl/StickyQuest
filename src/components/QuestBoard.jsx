import QuestCard from './QuestCard';

export default function QuestBoard({ quests, onToggle }) {
  if (quests.length === 0) {
    return (
      <div className="quest-board-empty">
        <p>No quests yet. Add a task to begin your adventure.</p>
      </div>
    );
  }

  return (
    <div className="quest-board">
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} onToggle={onToggle} />
      ))}
    </div>
  );
}
