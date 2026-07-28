// A large pool of diverse questions about squares
export const SQUARE_QUESTIONS = [
  // Core Properties
  {
    id: 'prop-1',
    type: 'mcq',
    prompt: 'How many sides does a perfect square have?',
    options: ['3', '4', '5', 'It depends'],
    correctAnswer: '4',
    hint: 'Count the straight lines that make up the shape!'
  },
  {
    id: 'prop-2',
    type: 'mcq',
    prompt: 'What is special about the sides of a square?',
    options: ['They are all different sizes', 'Two are long, two are short', 'They are all exactly the same size', 'They are curved'],
    correctAnswer: 'They are all exactly the same size',
    hint: 'Think about what makes a square different from a rectangle.'
  },
  {
    id: 'prop-3',
    type: 'mcq',
    prompt: 'How many corners does a square have?',
    options: ['3', '4', '8', '0'],
    correctAnswer: '4',
    hint: 'A corner is where two sides meet. Count them!'
  },
  {
    id: 'prop-4',
    type: 'truefalse',
    prompt: 'A square has 4 sides and 3 corners.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    hint: 'Does the number of sides match the number of corners?'
  },

  // Trick / Logic
  {
    id: 'logic-1',
    type: 'truefalse',
    prompt: 'I have 4 sides, but two of my sides are longer than the others. Am I a square?',
    options: ['Yes', 'No'],
    correctAnswer: 'No',
    hint: 'Remember the golden rule of squares: ALL sides must be equal!'
  },
  {
    id: 'logic-2',
    type: 'mcq',
    prompt: 'If you cut a perfect square right down the middle, what shape do you get?',
    options: ['Two Triangles', 'Two Rectangles', 'Two Circles', 'Two Squares'],
    correctAnswer: 'Two Rectangles',
    hint: 'Imagine folding a square piece of paper in half.'
  },
  {
    id: 'logic-3',
    type: 'truefalse',
    prompt: 'A circle has corners, just like a square.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    hint: 'Run your finger along a circle. Do you feel any sharp points?'
  },
  {
    id: 'logic-4',
    type: 'mcq',
    prompt: 'Which shape has fewer sides than a square?',
    options: ['Rectangle', 'Triangle', 'Pentagon', 'Hexagon'],
    correctAnswer: 'Triangle',
    hint: 'A square has 4 sides. Which shape has 3?'
  },

  // Real-world Applications
  {
    id: 'real-1',
    type: 'mcq',
    prompt: 'Which of these everyday items is usually shaped like a perfect square?',
    options: ['A bicycle wheel', 'A chessboard', 'A slice of pizza', 'A banana'],
    correctAnswer: 'A chessboard',
    hint: 'Which of these has 4 equal sides?'
  },
  {
    id: 'real-2',
    type: 'mcq',
    prompt: 'Which of these is NOT a square?',
    options: ['A checkerboard', 'A computer monitor', 'A regular Rubik\'s Cube face', 'A DVD disc'],
    correctAnswer: 'A DVD disc',
    hint: 'Which of these objects is perfectly round?'
  },
  {
    id: 'real-3',
    type: 'truefalse',
    prompt: 'A standard television screen is a perfect square.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    hint: 'TV screens are usually wider than they are tall!'
  },
  {
    id: 'real-4',
    type: 'mcq',
    prompt: 'If you look at a dice straight on, what shape do you see?',
    options: ['Circle', 'Triangle', 'Square', 'Rectangle'],
    correctAnswer: 'Square',
    hint: 'A dice is a cube. Every flat face of a cube is this shape!'
  },

  // Math integration
  {
    id: 'math-1',
    type: 'mcq',
    prompt: 'If you put 2 squares side-by-side, how many total corners do they have in the world?',
    options: ['4', '6', '8', '10'],
    correctAnswer: '8',
    hint: 'One square has 4 corners. What is 4 plus 4?'
  },
  {
    id: 'math-2',
    type: 'mcq',
    prompt: 'A square has one side of length 2. Are all 4 sides length 2?',
    options: ['Yes', 'No'],
    correctAnswer: 'Yes',
    hint: 'What did we learn about the sides of a square?'
  },
  {
    id: 'math-3',
    type: 'mcq',
    prompt: 'If you walk around the entire outside of a square that has sides of length 1, how far did you walk?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '4',
    hint: 'Add up the lengths of all 4 sides (1 + 1 + 1 + 1).'
  },
  {
    id: 'math-4',
    type: 'truefalse',
    prompt: 'A square with sides of length 5 is bigger than a square with sides of length 3.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    hint: 'Longer sides mean a larger shape!'
  },

  // Patterns
  {
    id: 'pattern-1',
    type: 'mcq',
    prompt: 'What comes next in the pattern? Square, Circle, Square, Circle, ...',
    options: ['Triangle', 'Square', 'Circle', 'Star'],
    correctAnswer: 'Square',
    hint: 'The pattern repeats every two shapes.'
  },
  {
    id: 'pattern-2',
    type: 'mcq',
    prompt: 'Which shape does NOT belong in this group? (Square, Rectangle, Circle, Diamond)',
    options: ['Square', 'Rectangle', 'Circle', 'Diamond'],
    correctAnswer: 'Circle',
    hint: 'Three of these shapes have straight lines and corners. One does not.'
  },

  // Story Context (Wei Ming)
  {
    id: 'story-1',
    type: 'truefalse',
    prompt: 'Wei Ming\'s window has 4 sides, but two are longer. Is it a square?',
    options: ['Yes', 'No'],
    correctAnswer: 'No',
    hint: 'Remember, a square MUST have 4 EQUAL sides.'
  },
  {
    id: 'story-2',
    type: 'mcq',
    prompt: 'Wei Ming wants to build a square sandbox. If one side is 3 meters long, how long should the other sides be?',
    options: ['2 meters', '3 meters', '4 meters', '5 meters'],
    correctAnswer: '3 meters',
    hint: 'All sides of a square must be exactly the same length!'
  },
  
  // Visual types
  {
    id: 'vis-1',
    type: 'mcq',
    prompt: 'Which of these properties defines a perfect square?',
    options: ['3 sides, 3 corners', '4 equal sides, 4 corners', 'No sides, round', '5 sides, 5 corners'],
    correctAnswer: '4 equal sides, 4 corners',
    hint: 'Think of the number 4, and remember the sides must be equal.'
  },
  {
    id: 'vis-2',
    type: 'truefalse',
    prompt: 'You can make a perfect square by putting two equal triangles together.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    hint: 'Try imagining two right-angle triangles sharing their longest side!'
  }
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
 * Randomly picks count questions per session.
 */
export function generateSessionQuestions(count = 20) {
  const shuffled = shuffle([...SQUARE_QUESTIONS]);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
