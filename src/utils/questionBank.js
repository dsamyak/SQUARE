// A large pool of diverse questions about squares
const SQUARE_QUESTIONS = [
  // Core Properties
  {
    id: 'prop-1',
    type: 'mcq',
    prompt: 'How many sides does a perfect square have?',
    options: ['3', '4', '5', 'It depends'],
    correctAnswer: '4',
  },
  {
    id: 'prop-2',
    type: 'mcq',
    prompt: 'What is special about the sides of a square?',
    options: ['They are all different sizes', 'Two are long, two are short', 'They are all exactly the same size', 'They are curved'],
    correctAnswer: 'They are all exactly the same size',
  },
  {
    id: 'prop-3',
    type: 'mcq',
    prompt: 'How many corners does a square have?',
    options: ['3', '4', '8', '0'],
    correctAnswer: '4',
  },

  // Trick / Logic
  {
    id: 'logic-1',
    type: 'truefalse',
    prompt: 'I have 4 sides, but two of my sides are longer than the others. Am I a square?',
    options: ['Yes', 'No'],
    correctAnswer: 'No',
  },
  {
    id: 'logic-2',
    type: 'mcq',
    prompt: 'If you cut a perfect square right down the middle, what shape do you get?',
    options: ['Two Triangles', 'Two Rectangles', 'Two Circles', 'Two Squares'],
    correctAnswer: 'Two Rectangles', // cutting a square vertically makes 2 rectangles
  },
  {
    id: 'logic-3',
    type: 'truefalse',
    prompt: 'A circle has corners, just like a square.',
    options: ['True', 'False'],
    correctAnswer: 'False',
  },

  // Real-world Applications
  {
    id: 'real-1',
    type: 'mcq',
    prompt: 'Which of these everyday items is usually shaped like a perfect square?',
    options: ['A bicycle wheel', 'A chessboard', 'A slice of pizza', 'A banana'],
    correctAnswer: 'A chessboard',
  },
  {
    id: 'real-2',
    type: 'mcq',
    prompt: 'Which of these is NOT a square?',
    options: ['A checkerboard', 'A computer monitor', 'A regular Rubik\'s Cube face', 'A DVD disc'],
    correctAnswer: 'A DVD disc',
  },

  // Counting / Math integration
  {
    id: 'math-1',
    type: 'mcq',
    prompt: 'If you put 2 squares side-by-side, how many total corners do they have in the world?',
    options: ['4', '6', '8', '10'],
    correctAnswer: '8', 
  },
  {
    id: 'math-2',
    type: 'mcq',
    prompt: 'A square has sides of length 2. Are all 4 sides length 2?',
    options: ['Yes', 'No'],
    correctAnswer: 'Yes',
  },
  
  // Patterns
  {
    id: 'pattern-1',
    type: 'mcq',
    prompt: 'What comes next in the pattern? Square, Circle, Square, Circle, ...',
    options: ['Triangle', 'Square', 'Circle', 'Star'],
    correctAnswer: 'Square',
  },
];

/**
 * Shuffles an array in place (Fisher-Yates algorithm)
 */
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

/**
 * Returns a randomly shuffled subset of questions for the Play Phase.
 * Randomly picks exactly 5 questions per session to ensure uniqueness.
 */
export function generateSessionQuestions(count = 5) {
  const shuffled = shuffle([...SQUARE_QUESTIONS]);
  return shuffled.slice(0, count);
}
