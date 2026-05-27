const fs = require('fs');
const path = require('path');

function createWav(freqs, durationMs, type) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * (durationMs / 1000));
  const buf = Buffer.alloc(44 + numSamples * 2);
  
  // WAV header
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + numSamples * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // Mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(numSamples * 2, 40);
  
  // Generate samples
  for (let i = 0; i < numSamples; i++) {
    let t = i / sampleRate;
    let sample = 0;
    
    // Mix frequencies
    for (const f of freqs) {
      if (type === 'sine') {
        sample += Math.sin(2 * Math.PI * f * t);
      } else if (type === 'square') {
        sample += Math.sign(Math.sin(2 * Math.PI * f * t));
      } else if (type === 'sawtooth') {
        sample += 2 * (t * f - Math.floor(t * f + 0.5));
      }
    }
    sample /= freqs.length;
    
    // Envelope (fade out)
    const envelope = 1 - (i / numSamples);
    sample *= envelope;
    
    // 16-bit volume
    let val = Math.floor(sample * 16000);
    if (val > 32767) val = 32767;
    if (val < -32768) val = -32768;
    buf.writeInt16LE(val, 44 + i * 2);
  }
  return buf;
}

const outDir = path.join(__dirname, 'public', 'audio', 'sfx');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'click.mp3'), createWav([800], 100, 'sine'));
fs.writeFileSync(path.join(outDir, 'correct.mp3'), createWav([523, 659, 784], 400, 'sine'));
fs.writeFileSync(path.join(outDir, 'wrong.mp3'), createWav([330, 277], 300, 'square'));
fs.writeFileSync(path.join(outDir, 'celebrate.mp3'), createWav([523, 659, 784, 1047], 800, 'sine'));

console.log('SFX generated as MP3 (WAV encoded) files.');
