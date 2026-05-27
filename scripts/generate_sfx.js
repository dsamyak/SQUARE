const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const OUTPUT_DIR = path.resolve(__dirname, '../public/audio/sfx');

const sfxMap = {
  'correct.mp3': 'A cheerful, bright ding sound, positive feedback UI chime, short.',
  'wrong.mp3': 'A soft, low-pitched buzz or thud, negative feedback UI sound, short.',
  'click.mp3': 'A crisp, soft wooden tap, neutral UI interaction click.',
  'celebrate.mp3': 'A short triumphant fanfare, cheerful trumpet blast, victorious, winning.'
};

async function generateSFX() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const [filename, prompt] of Object.entries(sfxMap)) {
    const filepath = path.join(OUTPUT_DIR, filename);
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log('Skipping existing SFX: ' + filename);
      continue;
    }

    try {
      console.log('Generating SFX: ' + filename);
      const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({ text: prompt })
      });

      if (!response.ok) {
        throw new Error('API Error: ' + response.status + ' ' + response.statusText);
      }
      
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log('Saved: ' + filename);
    } catch (e) {
      console.error('Failed for ' + filename + ': ' + e.message);
    }
  }
}

generateSFX();
