import React, { useState, useEffect, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion, AnimatePresence } from 'framer-motion';
import { narrate, stopNarration } from '../../utils/audio';

const STORY_SLIDES = [
  {
    id: 's1',
    image: '/images/story/slide1.png',
    text: "Aanya looked at her window and noticed something. It had four sides... and they were ALL the same! Can you guess what shape that is?",
  },
  {
    id: 's2',
    image: '/images/story/slide2.png',
    text: "Look at this square. Let's count its sides together! One, two, three, FOUR sides!",
  },
  {
    id: 's3',
    image: '/images/story/slide3.png',
    text: "Here's the most important thing about a square — ALL its sides are EQUAL. They are the same length!",
  },
  {
    id: 's4',
    image: '/images/story/slide4.png',
    text: "Now it's YOUR turn! Drag the tiles onto the grid to build a square. Make sure all the sides match!",
  }
];

export default function StoryPhase() {
  const { advance } = usePhase();
  const [slide, setSlide] = useState(0);
  const narrationRef = useRef(null);

  useEffect(() => {
    // Stop previous narration and start new one for current slide
    stopNarration();
    narrationRef.current = narrate([{ text: STORY_SLIDES[slide].text }]);
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [slide]);

  const handleNext = () => {
    if (slide < STORY_SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      narrationRef.current?.cancel();
      stopNarration();
      advance();
    }
  };

  const currentSlide = STORY_SLIDES[slide];

  return (
    <div className="story-screen">
      <div className="story-layout" style={{ width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="story-slide glass-card"
            style={{ padding: '30px' }}
          >
            <div className="story-image-container" style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', maxHeight: 'none', border: 'none' }}>
              <img src={currentSlide.image} alt="Story visual" style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '16px' }} />
            </div>
            
            <div className="story-content" style={{ textAlign: 'center' }}>
              <p className="story-text">{currentSlide.text}</p>
              
              <div className="story-nav">
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setSlide(s => Math.max(0, s - 1))}
                  disabled={slide === 0}
                  style={{ minWidth: '100px' }}
                >
                  ← Back
                </button>
                <div className="progress-dots" style={{ margin: 0 }}>
                  {STORY_SLIDES.map((_, i) => (
                    <div key={i} className={`progress-dot ${i === slide ? 'active' : ''}`} />
                  ))}
                </div>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={handleNext}
                  style={{ minWidth: '100px' }}
                >
                  {slide === STORY_SLIDES.length - 1 ? 'Start Simulating →' : 'Next →'}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
