// Narration text helpers — wraps strings into { text, style } segments
export function say(text) { return { text, style: 'statement' }; }
export function ask(text) { return { text, style: 'question' }; }
export function cheer(text) { return { text, style: 'encouragement' }; }
export function emphasize(text) { return { text, style: 'emphasis' }; }
export function think(text) { return { text, style: 'thinking' }; }
export function celebrate(text) { return { text, style: 'celebration' }; }
export function instruct(text) { return { text, style: 'statement' }; }

// ═══════════════════════════════════════════════════
// Phase: Intro
// ═══════════════════════════════════════════════════
export function introNarration() {
  return [
    celebrate("Hello there, explorer! Today, we are going to learn about a very special shape — the SQUARE!"),
  ];
}

// ═══════════════════════════════════════════════════
// Phase: Wonder
// ═══════════════════════════════════════════════════
export function wonderNarration() {
  return [
    ask("Look at this square. Let's count its sides together! One, two, three, FOUR sides!"),
    cheer("Now let's find the corners! One, two, three, FOUR corners! A square always has four corners."),
    emphasize("Here's the most important thing about a square — ALL its sides are EQUAL. They are the same length!"),
  ];
}

// ═══════════════════════════════════════════════════
// Phase: Story
// ═══════════════════════════════════════════════════
export function getStoryNarration(slideIndex) {
  const slides = [
    [
      say("Aanya looked at her window and noticed something. It had four sides... and they were ALL the same! Can you guess what shape that is?"),
    ],
    [
      say("Look at this square. Let's count its sides together! One, two, three, FOUR sides!"),
    ],
    [
      emphasize("Here's the most important thing about a square — ALL its sides are EQUAL. They are the same length!"),
    ],
    [
      celebrate("You made a square!"),
    ],
  ];
  return slides[slideIndex] || [];
}

// ═══════════════════════════════════════════════════
// Phase: Simulate
// ═══════════════════════════════════════════════════
export function simulateStation1Intro() {
  return [
    instruct("Now it's YOUR turn! Drag the tiles onto the grid to build a square. Make sure all the sides match!"),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Time to go on a shape hunt! Can you find all the squares hiding on the screen? Tap each one you find!"),
  ];
}

export function simulateStation3Intro() {
  return [
    instruct("Drag only the Perfect Squares into the bin!"),
  ];
}

export function simulateCorrect() {
  return [
    celebrate("Great job! That's a square!"),
  ];
}

export function simulateAllComplete() {
  return [
    celebrate("AMAZING! You are now a Square Expert! You learned that a square has 4 equal sides and 4 corners. Well done!"),
  ];
}

// ═══════════════════════════════════════════════════
// Phase: Play
// ═══════════════════════════════════════════════════
export function playReadQuestion(questionText) {
  return [ask(questionText)];
}

export function playCorrectNarration() {
  const options = [
    [celebrate("Wonderful!")],
    [celebrate("Great job!")],
    [celebrate("You got it!")],
    [celebrate("Superstar!")],
    [celebrate("That's right!")],
    [celebrate("Amazing!")],
  ];
  return options[Math.floor(Math.random() * options.length)];
}

export function playWrongNarration() {
  const options = [
    [think("Oops, not quite! Let's try again.")],
    [think("Hmm, look carefully!")],
    [cheer("You can do it!")],
    [think("Hmm, check your sides!")],
  ];
  return options[Math.floor(Math.random() * options.length)];
}

// ═══════════════════════════════════════════════════
// Phase: Reflect
// ═══════════════════════════════════════════════════
export function reflectIntroNarration() {
  return [
    ask("How many sides does a perfect square have?"),
  ];
}

export function reflectCertificateNarration() {
  return [
    celebrate("AMAZING! You are now a Square Expert! You learned that a square has 4 equal sides and 4 corners. Well done!"),
  ];
}
