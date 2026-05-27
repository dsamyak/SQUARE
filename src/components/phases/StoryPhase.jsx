import React, { useState } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion, AnimatePresence } from 'framer-motion';

const STORY_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    title: "Aanya's Room",
    text: "Aanya is looking at her room. She sees something special...",
    highlight: "It's a SQUARE!",
    audioKey: "Aanya looked at her window and noticed something. It had four sides... and they were ALL the same! Can you guess what shape that is?",
    mascotText: "Can you find more squares around you?"
  }
];

export default function StoryPhase() {
  const { advance } = usePhase();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < STORY_SLIDES.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      advance();
    }
  };

  const slide = STORY_SLIDES[currentSlide];

  return (
    <div className="story-screen">
      <AnimatePresence mode="wait">
        <motion.div 
          key={slide.id}
          className="story-slide glass-card"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="story-title">{slide.title}</h2>
          
          <div className="story-slide-image">
            <img src={slide.image} alt={slide.title} />
          </div>

          <p className="story-text">{slide.text}</p>
          
          <div className="story-highlight">
            {slide.highlight}
          </div>

          <div className="story-mascot">
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
            <span>{slide.mascotText}</span>
          </div>

          <div className="story-nav">
            {/* Audio button could go here or global audio handles it */}
            <div />
            <button className="btn btn-primary" onClick={handleNext}>
              {currentSlide === STORY_SLIDES.length - 1 ? "Let's Learn! →" : "Next →"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
