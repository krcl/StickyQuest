const ACTION_PREFIXES = [
  'Secure', 'Deliver', 'Investigate', 'Prepare', 'Complete', 'Handle',
  'Acquire', 'Resolve', 'Pursue', 'Establish',
];

const FILLER_WORDS = new Set([
  'a', 'an', 'the', 'to', 'and', 'or', 'but', 'in', 'on', 'at',
  'for', 'of', 'with', 'my', 'your', 'our', 'their', 'i', 'me',
  'need', 'needs', 'have', 'has', 'want', 'wants', 'some',
]);

const HIGH_URGENCY_KEYWORDS = ['today', 'now', 'urgent', 'deadline', 'asap', 'immediately', 'right away'];
const MEDIUM_URGENCY_KEYWORDS = ['soon', 'this week', 'tomorrow', 'shortly'];

function detectUrgency(task) {
  const lower = task.toLowerCase();
  if (HIGH_URGENCY_KEYWORDS.some((kw) => lower.includes(kw))) return 'high';
  if (MEDIUM_URGENCY_KEYWORDS.some((kw) => lower.includes(kw))) return 'medium';
  return 'low';
}

function buildQuestTitle(task) {
  // Strip punctuation, split into words, remove filler
  const words = task
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0 && !FILLER_WORDS.has(w.toLowerCase()));

  // Pick up to 5 meaningful words
  const meaningful = words.slice(0, 5);

  // Pick a deterministic prefix based on first char code of task
  const prefix = ACTION_PREFIXES[task.charCodeAt(0) % ACTION_PREFIXES.length];

  // Build title: prefix + meaningful words (4-6 words total)
  const titleWords = [prefix, ...meaningful].slice(0, 6);

  // Capitalize first letter of each word in title
  return titleWords
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function buildQuestDescription(task) {
  // Lightly rephrase by capitalizing and ensuring ends with period
  const reworded = task.charAt(0).toUpperCase() + task.slice(1).replace(/\.+$/, '');
  return `A task awaits — ${reworded}. See it through.`;
}

export function transformTask(rawTask, urgencyOverride = 'auto', notes = '') {
  const task = rawTask.trim();

  const urgency_level =
    urgencyOverride !== 'auto' ? urgencyOverride : detectUrgency(task);

  return {
    id: crypto.randomUUID(),
    quest_title: buildQuestTitle(task),
    quest_description: buildQuestDescription(task),
    objective: task,
    notes: notes.trim(),
    urgency_level,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}
