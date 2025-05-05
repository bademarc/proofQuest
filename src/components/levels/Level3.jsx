import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Button from '../common/Button';
import ExplanationCard from '../common/ExplanationCard';

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
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 480px) {
    padding: var(--spacing-md);
  }
`;

const Calculator = styled(motion.div)`
  width: clamp(200px, 80%, 300px);
  background-color: #333;
  border-radius: 15px;
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const CalculatorScreen = styled(motion.div)`
  width: 90%;
  background-color: #a8d8ad;
  border-radius: 8px;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: right;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const SliderContainer = styled.div`
  width: 100%;
  margin: var(--spacing-sm) 0;
`;

const SliderLabel = styled.label`
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: bold;
  color: var(--primary-color);
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
`;

const StyledSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const SliderValue = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--primary-color);
  min-width: 30px;
  text-align: center;
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
`;

const BouncingNumber = styled(motion.span)`
  display: inline-block;
  font-weight: bold;
  margin: 0 5px;
`;

const LightEffect = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  pointer-events: none;
`;

const Level3 = ({ onComplete }) => {
  const [number1, setNumber1] = useState(3);
  const [number2, setNumber2] = useState(3);
  const [sum, setSum] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const [showLights, setShowLights] = useState(false);

  const handleAddNumbers = () => {
    const newSum = number1 + number2;
    setSum(newSum);
    setShowResult(false);
    setResult(null);
    
    // Animate the calculator to become "super" if not already
    if (!isSuper) {
      setTimeout(() => {
        setIsSuper(true);
        setShowLights(true);
        setTimeout(() => setShowLights(false), 1500);
      }, 500);
    }
  };

  const handleCheckSum = () => {
    if (sum === null) return;
    
    setShowResult(true);
    const success = sum > 5;
    setResult(success);
    
    if (success) {
      // Show explanation after success
      setTimeout(() => {
        setShowExplanation(true);
      }, 1500);
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
        Level 3: BitVM Super Calculator
      </Title>
      
      <InstructionText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Time to power up, Detective! Bitcoin is great, but it can't do big math puzzles—like adding two numbers 
        and checking if they're bigger than a third. Use the BitVM Super Calculator to solve this: Add two numbers, 
        then check if the answer is bigger than 5!
      </InstructionText>
      
      <GameArea
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Calculator
          animate={isSuper ? {
            backgroundColor: '#4a2c91',
            boxShadow: '0 0 20px 5px rgba(106, 90, 205, 0.5)',
            transition: { duration: 1 }
          } : {}}
        >
          <LightEffect 
            animate={showLights ? { opacity: [0, 0.8, 0] } : {}}
            transition={{ duration: 1.5 }}
          />
          
          <CalculatorScreen
            animate={sum !== null ? {
              backgroundColor: isSuper ? '#a8ffad' : '#a8d8ad',
              scale: [1, 1.05, 1],
              transition: { duration: 0.5 }
            } : {}}
          >
            {sum !== null ? (
              <>
                <BouncingNumber
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {number1}
                </BouncingNumber>
                +
                <BouncingNumber
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {number2}
                </BouncingNumber>
                =
                <BouncingNumber
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {sum}
                </BouncingNumber>
              </>
            ) : (
              'Ready'
            )}
          </CalculatorScreen>
          
          <SliderContainer>
            <SliderLabel>Number 1:</SliderLabel>
            <SliderWrapper>
              <StyledSlider
                type="range"
                min="1"
                max="5"
                value={number1}
                onChange={(e) => setNumber1(parseInt(e.target.value))}
              />
              <SliderValue>{number1}</SliderValue>
            </SliderWrapper>
          </SliderContainer>
          
          <SliderContainer>
            <SliderLabel>Number 2:</SliderLabel>
            <SliderWrapper>
              <StyledSlider
                type="range"
                min="1"
                max="5"
                value={number2}
                onChange={(e) => setNumber2(parseInt(e.target.value))}
              />
              <SliderValue>{number2}</SliderValue>
            </SliderWrapper>
          </SliderContainer>
        </Calculator>
        
        <Button 
          onClick={handleAddNumbers}
          whileHover={{ scale: 1.05 }}
        >
          Add Them!
        </Button>
        
        {sum !== null && (
          <Button 
            onClick={handleCheckSum}
            variant="secondary"
            whileHover={{ scale: 1.05 }}
            style={{ marginTop: 'var(--spacing-md)' }}
          >
            Is It Bigger Than 5?
          </Button>
        )}
        
        <AnimatePresence>
          {showResult && (
            <ResultMessage 
              success={result}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {result 
                ? `Yes! ${sum} is bigger than 5!` 
                : `No, ${sum} is not bigger than 5. Try different numbers!`}
            </ResultMessage>
          )}
        </AnimatePresence>
      </GameArea>
      
      <AnimatePresence>
        {showExplanation && (
          <>
            <ExplanationCard title="What is BitVM?">
              <p>
                Awesome! BitVM is like giving Bitcoin a super calculator. Normally, Bitcoin only does simple stuff, 
                but BitVM lets it solve harder puzzles—like adding or comparing numbers. It's like upgrading your 
                toy car to a rocket ship!
              </p>
            </ExplanationCard>
            
            <ExplanationCard title="How LayerEdge Uses It">
              <p>
                LayerEdge uses BitVM to do tricky tasks off Bitcoin, then proves they're right with zk-proofs. 
                It makes Bitcoin way more powerful!
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

export default Level3;
