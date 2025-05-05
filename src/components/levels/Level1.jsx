import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import ExplanationCard from '../common/ExplanationCard';
import { Confetti } from '../common/RewardEffects';
import { playSuccess, playError, vibrate, VIBRATION_PATTERNS } from '../../utils/SoundEffects';

const LevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: var(--spacing-sm);
  }
`;

const Title = styled(motion.h1)`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-lg);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const InstructionText = styled(motion.p)`
  font-size: var(--font-size-md);
  line-height: 1.6;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
  padding: 0 var(--spacing-sm);
`;

const GameArea = styled(motion.div)`
  background-color: var(--card-background);
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 30%, rgba(106, 90, 205, 0.05) 70%);
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: var(--spacing-md);
  }
`;

const MagicianHat = styled(motion.div)`
  width: clamp(80px, 30vw, 120px);
  height: clamp(70px, 25vw, 100px);
  background-color: #222;
  background-image: linear-gradient(to bottom, #333, #111);
  border-radius: 10px 10px 50% 50% / 10px 10px 30% 30%;
  position: relative;
  margin: var(--spacing-md) auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transform-origin: bottom center;

  &:before {
    content: '';
    position: absolute;
    width: calc(100% + 30px);
    height: 20px;
    background-color: #222;
    background-image: linear-gradient(to bottom, #333, #111);
    bottom: -5px;
    left: -15px;
    border-radius: 50%;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  }

  &:after {
    content: '';
    position: absolute;
    width: 90%;
    height: 10px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    top: 20%;
    left: 5%;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(106, 90, 205, 0.5);
  }
`;

const MagicWand = styled(motion.div)`
  width: clamp(80px, 30vw, 120px);
  height: clamp(10px, 3vw, 15px);
  background: linear-gradient(90deg, #333 70%, #fff 70%);
  border-radius: 10px;
  margin: var(--spacing-md) auto;
  position: relative;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  transform-origin: right center;

  &:before {
    content: '';
    position: absolute;
    width: clamp(15px, 5vw, 20px);
    height: clamp(15px, 5vw, 20px);
    background-color: #fff;
    right: -10px;
    top: -3px;
    border-radius: 50%;
    box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.8);
    animation: glow 1.5s infinite alternate;
  }

  &:after {
    content: '✨';
    position: absolute;
    font-size: 20px;
    right: -20px;
    top: -15px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &.active:after {
    opacity: 1;
  }
`;

const ResultMessage = styled(motion.div)`
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  font-weight: bold;
  text-align: center;
  font-size: var(--font-size-sm);
  width: 100%;
  background-color: ${props => props.success ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.success ? 'var(--success-color)' : 'var(--error-color)'};
  border: 2px solid ${props => props.success ? 'var(--success-color)' : 'var(--error-color)'};
  box-shadow: 0 5px 15px ${props => props.success ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.success ?
      'linear-gradient(45deg, rgba(76, 175, 80, 0.1) 25%, transparent 25%, transparent 50%, rgba(76, 175, 80, 0.1) 50%, rgba(76, 175, 80, 0.1) 75%, transparent 75%)' :
      'linear-gradient(45deg, rgba(244, 67, 54, 0.1) 25%, transparent 25%, transparent 50%, rgba(244, 67, 54, 0.1) 50%, rgba(244, 67, 54, 0.1) 75%, transparent 75%)'
    };
    background-size: 20px 20px;
    z-index: 0;
  }

  p {
    position: relative;
    z-index: 1;
  }
`;

const ProofBox = styled(motion.div)`
  background-color: rgba(106, 90, 205, 0.1);
  background-image: linear-gradient(to right, rgba(106, 90, 205, 0.05), rgba(255, 140, 0, 0.05));
  border: 2px dashed var(--primary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
  text-align: center;
  width: 100%;
  position: relative;
  box-shadow: 0 5px 15px rgba(106, 90, 205, 0.1);

  p {
    font-weight: bold;
    font-size: var(--font-size-md);
    color: var(--primary-color);
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
    position: relative;
    z-index: 1;
  }

  &:after {
    content: '🔍';
    position: absolute;
    font-size: 24px;
    right: 15px;
    bottom: 10px;
    opacity: 0.3;
  }
`;

const numberOptions = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`
}));

const Level1 = ({ onComplete }) => {
  const [secretNumber, setSecretNumber] = useState('');
  const [showProof, setShowProof] = useState(false);
  const [result, setResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hatShaking, setHatShaking] = useState(false);
  const [wandWaving, setWandWaving] = useState(false);

  const handleNumberChange = (e) => {
    setSecretNumber(e.target.value);
    setShowProof(false);
    setResult(null);
    setShowExplanation(false);

    // Animate hat when number is selected
    setHatShaking(true);
    setTimeout(() => setHatShaking(false), 1000);
  };

  const handleProveClick = () => {
    setShowProof(true);

    // Check if number is even
    const isEven = parseInt(secretNumber) % 2 === 0;
    setResult(isEven);

    if (isEven) {
      // Animate wand when successful
      setTimeout(() => {
        setWandWaving(true);
        setTimeout(() => setWandWaving(false), 1500);
      }, 1000);

      // Show explanation after success
      setTimeout(() => {
        setShowExplanation(true);
      }, 2500);
    }
  };

  const handleNextLevel = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <LevelContainer>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Level 1: zk-Proof Magic Trick
      </Title>

      <InstructionText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Welcome, Proof Detective! Your first mission is a magic trick. Pick a secret number between 1 and 10.
        Don't tell me what it is! Now, prove it's an even number (like 2, 4, 6) without saying the number. Ready? Let's go!
      </InstructionText>

      <GameArea
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <MagicianHat
          animate={hatShaking ? {
            rotate: [0, -10, 10, -10, 10, 0],
            y: [0, -5, 0, -5, 0]
          } : {}}
          transition={{ duration: 1 }}
        />

        <div style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }}>
          <Dropdown
            id="secret-number"
            label="Pick your secret number:"
            options={numberOptions}
            value={secretNumber}
            onChange={handleNumberChange}
          />
        </div>

        <Button
          onClick={handleProveClick}
          disabled={!secretNumber}
          whileHover={{ scale: 1.05, backgroundColor: '#ff8c00' }}
          style={{
            backgroundColor: '#6a5acd',
            color: 'white',
            padding: '12px 25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginTop: '20px',
            textTransform: 'uppercase'
          }}
        >
          Prove It's Even!
        </Button>

        <AnimatePresence>
          {showProof && (
            <ProofBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>If I divide your number by 2, there's no leftover pieces!</p>
            </ProofBox>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result !== null && (
            <ResultMessage
              success={result}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {result
                ? "That's correct! Your number is even!"
                : "Hmm, that's not right. Your number is odd. Try again!"}
            </ResultMessage>
          )}
        </AnimatePresence>

        {result && (
          <MagicWand
            animate={wandWaving ? {
              rotate: [0, 20, -20, 20, -20, 0],
              x: [0, 10, -10, 10, -10, 0]
            } : {}}
            transition={{ duration: 1.5 }}
          />
        )}
      </GameArea>

      <AnimatePresence>
        {showExplanation && (
          <>
            <ExplanationCard title="What is a zk-Proof?">
              <p>
                Great job! You just did a zero-knowledge proof (or zk-proof). It's like a magic trick:
                you proved your number is even without telling me what it is. In the real world,
                zk-proofs keep secrets safe while proving they're true—like hiding your treasure map
                but proving it's real!
              </p>
            </ExplanationCard>

            <ExplanationCard title="How LayerEdge Uses It">
              <p>
                LayerEdge uses zk-proofs to check Bitcoin stuff (like money moving) without showing
                private details. It's super safe and sneaky!
              </p>
            </ExplanationCard>

            <Button
              onClick={handleNextLevel}
              variant="secondary"
              whileHover={{ scale: 1.05 }}
            >
              Continue to Next Level
            </Button>
          </>
        )}
      </AnimatePresence>
    </LevelContainer>
  );
};

export default Level1;
