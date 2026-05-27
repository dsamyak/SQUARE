export const QUESTION_TYPES = {
  MCQ_IDENTIFICATION: 'mcq-identification',
  PROPERTY_COUNT: 'property-count',
  CORNER_COUNT: 'corner-count',
  TRUE_FALSE: 'true-false',
  REAL_WORLD_SORT: 'real-world-sort',
  EQUAL_SIDES_COMPARE: 'equal-sides-compare',
};

const TRUE_FALSE_STATEMENTS = [
  { statement: "A square has 3 sides.", isTrue: false },
  { statement: "A square has 4 sides.", isTrue: true },
  { statement: "All sides of a square are the same length.", isTrue: true },
  { statement: "A square has 4 corners.", isTrue: true },
  { statement: "A square can have sides of different lengths.", isTrue: false },
  { statement: "A square has 5 corners.", isTrue: false },
];

export function generateSessionQuestions() {
  const sessionLength = 5; // Can be randomized 5-7
  const questions = [];

  // Required: MCQ
  questions.push({
    id: `q-mcq-${Date.now()}`,
    type: QUESTION_TYPES.MCQ_IDENTIFICATION,
    prompt: "Which of these is a square?",
    audioKey: "Which of these is a square?",
    options: ['square', 'circle', 'triangle', 'rectangle'],
    correctAnswer: 'square',
    hint: "Look for 4 equal sides and 4 corners!"
  });

  // Required: Property Count
  questions.push({
    id: `q-prop-${Date.now()}`,
    type: QUESTION_TYPES.PROPERTY_COUNT,
    prompt: "How many sides does a square have?",
    audioKey: "How many sides does a square have?",
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    hint: "Count the straight lines that make the shape."
  });

  // Required: Corner Count
  questions.push({
    id: `q-corner-${Date.now()}`,
    type: QUESTION_TYPES.CORNER_COUNT,
    prompt: "Count the corners on this square.",
    audioKey: "Count the corners on this square.",
    correctAnswer: 4,
    hint: "Tap the pointy bits where the sides meet!"
  });

  // Optional: True/False
  const tf = TRUE_FALSE_STATEMENTS[Math.floor(Math.random() * TRUE_FALSE_STATEMENTS.length)];
  questions.push({
    id: `q-tf-${Date.now()}`,
    type: QUESTION_TYPES.TRUE_FALSE,
    prompt: tf.statement,
    audioKey: tf.statement,
    options: ['TRUE', 'FALSE'],
    correctAnswer: tf.isTrue ? 'TRUE' : 'FALSE',
    hint: "Think about the rules of a square."
  });

  // Optional: Equal Sides Compare
  questions.push({
    id: `q-eq-${Date.now()}`,
    type: QUESTION_TYPES.EQUAL_SIDES_COMPARE,
    prompt: "Which shape has all equal sides?",
    audioKey: "Which shape has all equal sides?",
    options: ['square', 'rectangle'], // simplified shapes
    correctAnswer: 'square',
    hint: "Equal means they are exactly the same length."
  });

  // Shuffle the questions array
  return questions.sort(() => Math.random() - 0.5);
}
