import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
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

const NumbersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  width: 100%;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Backpack = styled(motion.div)`
  width: clamp(150px, 40vw, 200px);
  height: clamp(180px, 45vw, 240px);
  background-color: var(--secondary-color);
  border-radius: 20px;
  position: relative;
  margin: var(--spacing-md) auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    width: 60%;
    height: 30px;
    background-color: var(--secondary-color);
    top: -15px;
    border-radius: 20px;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 80%;
    height: 20px;
    background-color: rgba(0, 0, 0, 0.2);
    bottom: 20px;
    border-radius: 10px;
  }
`;

const BackpackPocket = styled.div`
  width: 70%;
  height: 40%;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: var(--font-size-md);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const NumberBadge = styled(motion.div)`
  width: 50px;
  height: 50px;
  background-color: ${props => props.isEven ? 'var(--accent-color)' : 'var(--primary-color)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: var(--box-shadow);
  cursor: pointer;
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
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
`;

const ZoomAnimation = styled(motion.div)`
  position: absolute;
  font-size: 3rem;
  font-weight: bold;
  color: var(--accent-color);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const numberOptions = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`
}));

const Level2 = ({ onComplete }) => {
  const [numbers, setNumbers] = useState([null, null, null]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  const handleNumberChange = (index, e) => {
    const newNumbers = [...numbers];
    newNumbers[index] = parseInt(e.target.value);
    setNumbers(newNumbers);
    setShowResult(false);
    setResult(null);
    setShowExplanation(false);
    setSelectedNumbers([]);
  };

  const handleNumberClick = (number, index) => {
    if (selectedNumbers.includes(index)) {
      setSelectedNumbers(selectedNumbers.filter(i => i !== index));
    } else if (selectedNumbers.length < 3) {
      setSelectedNumbers([...selectedNumbers, index]);
    }
  };

  const handleCombineClick = () => {
    // Check if at least two of the selected numbers are even
    const selectedValues = selectedNumbers.map(index => numbers[index]);
    const evenCount = selectedValues.filter(num => num % 2 === 0).length;
    
    setShowResult(true);
    const success = evenCount >= 2;
    setResult(success);
    
    if (success) {
      // Show zoom animation
      setShowZoom(true);
      setTimeout(() => setShowZoom(false), 1500);
      
      // Show explanation after success
      setTimeout(() => {
        setShowExplanation(true);
      }, 2000);
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
        Level 2: Aggregation Station
      </Title>
      
      <InstructionText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Next mission, Detective! You've got three secret numbers now. Prove that at least two of them are even, 
        but don't tell me the numbers. Use the Proof Combiner to mix your proofs into one big proof. Let's save time!
      </InstructionText>
      
      <GameArea
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <NumbersContainer>
          {[0, 1, 2].map((index) => (
            <Dropdown
              key={index}
              id={`number-${index}`}
              label={`Number ${index + 1}:`}
              options={numberOptions}
              value={numbers[index] || ''}
              onChange={(e) => handleNumberChange(index, e)}
            />
          ))}
        </NumbersContainer>
        
        {numbers.every(num => num !== null) && (
          <>
            <p>Click on your numbers to add them to the Proof Combiner:</p>
            <NumbersContainer>
              {numbers.map((number, index) => (
                <NumberBadge
                  key={index}
                  isEven={number % 2 === 0}
                  onClick={() => handleNumberClick(number, index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={selectedNumbers.includes(index) ? {
                    y: [0, -20, 0],
                    transition: { repeat: 1 }
                  } : {}}
                >
                  {number}
                </NumberBadge>
              ))}
            </NumbersContainer>
            
            <Backpack
              animate={selectedNumbers.length > 0 ? {
                scale: [1, 1.05, 1],
                transition: { duration: 0.5 }
              } : {}}
            >
              <BackpackPocket>
                {selectedNumbers.length > 0 ? `${selectedNumbers.length} proofs` : 'Empty'}
              </BackpackPocket>
              
              <AnimatePresence>
                {showZoom && (
                  <ZoomAnimation
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 1.5 }}
                  >
                    ZOOM!
                  </ZoomAnimation>
                )}
              </AnimatePresence>
            </Backpack>
            
            <Button 
              onClick={handleCombineClick}
              disabled={selectedNumbers.length < 2}
              whileHover={{ scale: 1.05, backgroundColor: '#ff8c00' }}
            >
              Combine and Prove!
            </Button>
            
            <AnimatePresence>
              {showResult && (
                <ResultMessage 
                  success={result}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {result 
                    ? "Success! At least two of your numbers are even!" 
                    : "Not quite. You need at least two even numbers. Try again!"}
                </ResultMessage>
              )}
            </AnimatePresence>
          </>
        )}
      </GameArea>
      
      <AnimatePresence>
        {showExplanation && (
          <>
            <ExplanationCard title="What is Aggregation?">
              <p>
                Wow, you're fast! Aggregation is like putting all your proofs in one big backpack 
                instead of carrying them one by one. It saves time and energy because we only check 
                one big proof instead of lots of little ones.
              </p>
            </ExplanationCard>
            
            <ExplanationCard title="How LayerEdge Uses It">
              <p>
                LayerEdge mixes lots of zk-proofs into one, so checking them on Bitcoin is cheaper 
                and quicker. It's like doing all your homework in one go!
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

export default Level2;
