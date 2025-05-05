import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Confetti particle
const Particle = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border-radius: ${props => props.shape === 'circle' ? '50%' : '0'};
  pointer-events: none;
  z-index: 100;
`;

// Star for rewards
const Star = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: var(--reward-color);
  clip-path: polygon(
    50% 0%, 
    61% 35%, 
    98% 35%, 
    68% 57%, 
    79% 91%, 
    50% 70%, 
    21% 91%, 
    32% 57%, 
    2% 35%, 
    39% 35%
  );
  pointer-events: none;
  z-index: 100;
`;

// Points popup
const PointsPopup = styled(motion.div)`
  position: absolute;
  color: var(--reward-color);
  font-weight: bold;
  font-size: 1.5rem;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 100;
`;

// Streak indicator
const StreakIndicator = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: var(--primary-color);
  color: white;
  padding: 10px 15px;
  border-radius: var(--border-radius);
  font-weight: bold;
  box-shadow: var(--box-shadow);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  
  span {
    margin-left: 5px;
  }
`;

// Pulsing effect for interactive elements
const PulseEffect = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 1;
`;

// Confetti effect
export const Confetti = ({ isActive, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (isActive) {
      const newParticles = [];
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493'];
      const shapes = ['circle', 'square'];
      
      // Create 50 particles
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          size: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          velocity: {
            x: (Math.random() - 0.5) * 10,
            y: Math.random() * 5 + 3
          },
          rotation: Math.random() * 360
        });
      }
      
      setParticles(newParticles);
      
      // Clear particles after duration
      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, duration]);
  
  return (
    <AnimatePresence>
      {particles.map(particle => (
        <Particle
          key={particle.id}
          size={particle.size}
          color={particle.color}
          shape={particle.shape}
          initial={{ 
            x: particle.x, 
            y: particle.y, 
            rotate: 0,
            opacity: 1 
          }}
          animate={{ 
            x: particle.x + particle.velocity.x * 50, 
            y: window.innerHeight + 50,
            rotate: particle.rotation,
            opacity: 0 
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: Math.random() * 2 + 1,
            ease: "easeOut" 
          }}
        />
      ))}
    </AnimatePresence>
  );
};

// Stars reward effect
export const StarsReward = ({ count = 3, isActive, onComplete }) => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    if (isActive) {
      const newStars = [];
      
      // Create stars
      for (let i = 0; i < count; i++) {
        newStars.push({
          id: i,
          x: window.innerWidth / 2 + (i - Math.floor(count / 2)) * 60,
          y: window.innerHeight / 2,
          size: 40,
          delay: i * 0.2
        });
      }
      
      setStars(newStars);
      
      // Call onComplete after animation
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, count, onComplete]);
  
  return (
    <AnimatePresence>
      {stars.map(star => (
        <Star
          key={star.id}
          size={star.size}
          initial={{ 
            x: star.x, 
            y: window.innerHeight + 100,
            scale: 0.5,
            opacity: 0 
          }}
          animate={{ 
            x: star.x, 
            y: star.y,
            scale: 1,
            opacity: 1 
          }}
          exit={{ 
            y: star.y - 100,
            opacity: 0 
          }}
          transition={{ 
            delay: star.delay,
            duration: 0.5,
            ease: "backOut" 
          }}
        />
      ))}
    </AnimatePresence>
  );
};

// Points popup effect
export const PointsPopup = ({ points, x, y, isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <PointsPopup
          initial={{ x, y, opacity: 0, scale: 0.5 }}
          animate={{ y: y - 50, opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          +{points}
        </PointsPopup>
      )}
    </AnimatePresence>
  );
};

// Streak indicator
export const Streak = ({ count, isActive }) => {
  return (
    <AnimatePresence>
      {isActive && count > 1 && (
        <StreakIndicator
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          🔥 <span>Streak: {count}x</span>
        </StreakIndicator>
      )}
    </AnimatePresence>
  );
};

// Pulse effect for interactive elements
export const Pulse = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <PulseEffect
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 0.7, 0],
            scale: [0.8, 1.2, 1.5]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default {
  Confetti,
  StarsReward,
  PointsPopup,
  Streak,
  Pulse
};
