const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/audio');
const AUDIO_MAP_FILE = path.resolve(__dirname, '../src/utils/audioMap.js');

const styleSettings = {
  statement: { stability: 0.65, similarity_boost: 0.75, style: 0.3 },
  question: { stability: 0.55, similarity_boost: 0.80, style: 0.5 },
  encouragement: { stability: 0.50, similarity_boost: 0.70, style: 0.7 },
  emphasis: { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
  thinking: { stability: 0.60, similarity_boost: 0.75, style: 0.4 },
  celebration: { stability: 0.45, similarity_boost: 0.65, style: 0.8 }
};

const phrases = [
  // INTRO
  { text: "Hello there, explorer! Today, we are going to learn about a very special shape — the SQUARE!", style: 'celebration' },
  
  // STORY
  { text: "Aanya looked at her window and noticed something. It had four sides... and they were ALL the same! Can you guess what shape that is?", style: 'question' },
  
  // LEARN: SIDES
  { text: "Look at this square. Let's count its sides together! One, two, three, FOUR sides!", style: 'encouragement' },
  
  // LEARN: CORNERS
  { text: "Now let's find the corners! One, two, three, FOUR corners! A square always has four corners.", style: 'encouragement' },
  
  // LEARN: EQUAL
  { text: "Here's the most important thing about a square — ALL its sides are EQUAL. They are the same length!", style: 'emphasis' },
  
  // EXPLORE: BUILD
  { text: "Now it's YOUR turn! Drag the tiles onto the grid to build a square. Make sure all the sides match!", style: 'statement' },
  
  // EXPLORE: SPOT
  { text: "Time to go on a shape hunt! Can you find all the squares hiding on the screen? Tap each one you find!", style: 'statement' },
  
  // EXPLORE: SORT
  { text: "Drag only the Perfect Squares into the bin!", style: 'statement' },
  { text: "Oops! That shape does not have 4 EQUAL sides.", style: 'thinking' },
  
  // EXPLORE: MEASURE
  { text: "Tap each side of the square to measure it with your magic ruler!", style: 'statement' },
  { text: "Wow! All 4 sides are exactly the same!", style: 'celebration' },
  
  // CORRECT FEEDBACK
  { text: "Wonderful!", style: 'celebration' },
  { text: "Great job!", style: 'celebration' },
  { text: "You got it!", style: 'celebration' },
  { text: "Superstar!", style: 'celebration' },
  { text: "That's right!", style: 'celebration' },
  { text: "Amazing!", style: 'celebration' },
  { text: "Great job! That's a square!", style: 'celebration' },
  
  // WRONG FEEDBACK
  { text: "Oops, not quite! Let's try again.", style: 'thinking' },
  { text: "Hmm, look carefully!", style: 'thinking' },
  { text: "You can do it!", style: 'encouragement' },
  { text: "That's not a square, keep looking!", style: 'thinking' },
  { text: "Hmm, check your sides!", style: 'thinking' },
  
  // QUESTIONS (From Question Bank)
  { text: "How many sides does a perfect square have?", style: 'question' },
  { text: "What is special about the sides of a square?", style: 'question' },
  { text: "How many corners does a square have?", style: 'question' },
  { text: "I have 4 sides, but two of my sides are longer than the others. Am I a square?", style: 'question' },
  { text: "If you cut a perfect square right down the middle, what shape do you get?", style: 'question' },
  { text: "A circle has corners, just like a square.", style: 'question' },
  { text: "Which of these everyday items is usually shaped like a perfect square?", style: 'question' },
  { text: "Which of these is NOT a square?", style: 'question' },
  { text: "If you put 2 squares side-by-side, how many total corners do they have in the world?", style: 'question' },
  { text: "A square has sides of length 2. Are all 4 sides length 2?", style: 'question' },
  { text: "What comes next in the pattern? Square, Circle, Square, Circle, ...", style: 'question' },

  // COMPLETION
  { text: "AMAZING! You are now a Square Expert! You learned that a square has 4 equal sides and 4 corners. Well done!", style: 'celebration' },
  { text: "You made a square!", style: 'celebration' }
];

function sanitizeFilename(text, index) {
  const sanitized = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30);
  return `audio_${sanitized}_${index}.mp3`;
}

async function generateAudio() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_api_key_here') {
    console.warn("⚠  VITE_ELEVENLABS_API_KEY is not set. Generating mock files + audioMap.js.");
  }

  const audioMap = {};
  
  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = sanitizeFilename(text, i);
    const filepath = path.join(OUTPUT_DIR, filename);
    const relativePath = `/assets/audio/${filename}`;
    
    audioMap[text] = relativePath;

    if (fs.existsSync(filepath)) {
      console.log(`✓ [${i}] Skipping: "${text.substring(0, 40)}..." (exists)`);
      continue;
    }

    if (ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== 'your_api_key_here') {
      try {
        console.log(`🎙  [${i}] Generating: "${text.substring(0, 40)}..." [${style}]`);
        const settings = styleSettings[style] || styleSettings.statement;
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: text,
            model_id: MODEL_ID,
            voice_settings: {
              stability: settings.stability,
              similarity_boost: settings.similarity_boost,
              style: settings.style,
              use_speaker_boost: true
            }
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        console.log(`   ✓ Saved: ${filename}`);
        
        // Rate limit: 500ms between requests
        await new Promise(r => setTimeout(r, 500));
      } catch (error) {
        console.error(`   ✗ Failed: ${error.message}`);
      }
    } else {
      // Mock: create placeholder file
      fs.writeFileSync(filepath, 'dummy audio content');
      console.log(`📝 [${i}] Mock: ${filename}`);
    }
  }

  // Generate audioMap.js
  const mapContent = `// Auto-generated by scripts/generate_audio.js
// Run: node scripts/generate_audio.js
export const audioMap = ${JSON.stringify(audioMap, null, 2)};
`;
  
  const mapDir = path.dirname(AUDIO_MAP_FILE);
  if (!fs.existsSync(mapDir)) {
    fs.mkdirSync(mapDir, { recursive: true });
  }

  fs.writeFileSync(AUDIO_MAP_FILE, mapContent);
  console.log(`\n✅ Generated audioMap.js with ${Object.keys(audioMap).length} entries.`);
  console.log(`📁 Audio files: ${OUTPUT_DIR}`);
}

generateAudio();
