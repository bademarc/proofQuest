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

const Village = styled(motion.div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin: var(--spacing-md) 0;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const House = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const HouseRoof = styled.div`
  width: 100%;
  height: 40%;
  background-color: ${props => props.lit ? '#ff8c00' : '#a52a2a'};
  clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  transition: background-color 0.3s ease;
`;

const HouseBody = styled.div`
  width: 80%;
  height: 60%;
  background-color: ${props => props.lit ? '#f5f5dc' : '#d2b48c'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: background-color 0.3s ease;
`;

const HouseWindow = styled.div`
  width: 40%;
  height: 30%;
  background-color: ${props => props.lit ? '#ffff00' : '#808080'};
  margin-bottom: 10%;
  border: 2px solid #333;
  transition: background-color 0.3s ease;
`;

const HouseDoor = styled.div`
  width: 30%;
  height: 40%;
  background-color: #8b4513;
  border-radius: 5px 5px 0 0;
`;

const ProofCard = styled(motion.div)`
  background-color: rgba(106, 90, 205, 0.1);
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
  width: 100%;
`;

const ProofQuestion = styled.h3`
  color: var(--primary-color);
  margin-top: 0;
  text-align: center;
`;

const ProofClue = styled.p`
  font-style: italic;
  text-align: center;
  margin: var(--spacing-md) 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  width: 100%;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacing-md) 0;
  font-weight: bold;
`;

const ProgressDot = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(106, 90, 205, 0.3)'};
  margin: 0 5px;
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

const Villager = styled(motion.div)`
  position: absolute;
  bottom: -30px;
  width: 30px;
  height: 50px;
  
  .head {
    width: 20px;
    height: 20px;
    background-color: #ffdab9;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .body {
    width: 20px;
    height: 30px;
    background-color: ${props => props.color || '#3498db'};
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
  }
`;

// Proof data
const proofs = [
  {
    question: "Is this number even?",
    clue: "This number divided by 2 has no leftovers.",
    answer: true
  },
  {
    question: "Is this number greater than 10?",
    clue: "This number plus 5 equals 20.",
    answer: true
  },
  {
    question: "Is this number a prime number?",
    clue: "This number is divisible only by 1 and itself, and it's between 10 and 20.",
    answer: true
  }
];

const Level4 = ({ onComplete }) => {
  const [currentProofIndex, setCurrentProofIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [completedProofs, setCompletedProofs] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [litHouses, setLitHouses] = useState([]);
  const [showVillagers, setShowVillagers] = useState(false);

  const handleAnswer = (answer) => {
    const isCorrect = answer === proofs[currentProofIndex].answer;
    
    setShowResult(true);
    setResult(isCorrect);
    
    if (isCorrect) {
      // Light up a house
      setLitHouses(prev => [...prev, currentProofIndex]);
      
      setTimeout(() => {
        setShowResult(false);
        
        // Move to next proof or show explanation
        if (currentProofIndex < proofs.length - 1) {
          setCurrentProofIndex(prev => prev + 1);
          setCompletedProofs(prev => prev + 1);
        } else {
          setCompletedProofs(prev => prev + 1);
          
          // All proofs completed
          setTimeout(() => {
            setShowVillagers(true);
            
            setTimeout(() => {
              setShowExplanation(true);
            }, 1500);
          }, 1000);
        }
      }, 1500);
    } else {
      // Wrong answer, just hide the result after a delay
      setTimeout(() => {
        setShowResult(false);
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
        Level 4: Verification Village
      </Title>
      
      <InstructionText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Welcome to Verification Village, Detective! Now you'll check other players' proofs. 
        You've got a proof to verify: "This number is even." Look at the clue and decide if it's true. 
        Work together to keep things honest!
      </InstructionText>
      
      <GameArea
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Village>
          {[0, 1, 2].map((index) => (
            <House key={index}>
              <HouseRoof lit={litHouses.includes(index)} />
              <HouseBody lit={litHouses.includes(index)}>
                <HouseWindow lit={litHouses.includes(index)} />
                <HouseDoor />
              </HouseBody>
              
              {showVillagers && (
                <Villager
                  color={['#3498db', '#e74c3c', '#2ecc71'][index]}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3 }}
                >
                  <div className="head" />
                  <div className="body" />
                </Villager>
              )}
            </House>
          ))}
        </Village>
        
        <ProgressIndicator>
          Verified: {completedProofs} / {proofs.length}
          <div style={{ marginLeft: '10px', display: 'flex' }}>
            {proofs.map((_, index) => (
              <ProgressDot key={index} active={index < completedProofs} />
            ))}
          </div>
        </ProgressIndicator>
        
        {completedProofs < proofs.length && (
          <ProofCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProofQuestion>{proofs[currentProofIndex].question}</ProofQuestion>
            <ProofClue>Clue: {proofs[currentProofIndex].clue}</ProofClue>
            
            <ButtonGroup>
              <Button 
                onClick={() => handleAnswer(true)}
                variant="primary"
                whileHover={{ scale: 1.05 }}
              >
                Yes, it's true!
              </Button>
              
              <Button 
                onClick={() => handleAnswer(false)}
                variant="secondary"
                whileHover={{ scale: 1.05 }}
              >
                No, it's not!
              </Button>
            </ButtonGroup>
          </ProofCard>
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
                ? "Correct! You verified the proof successfully!" 
                : "That's not right. Try again!"}
            </ResultMessage>
          )}
        </AnimatePresence>
      </GameArea>
      
      <AnimatePresence>
        {showExplanation && (
          <>
            <ExplanationCard title="What is Decentralized Verification?">
              <p>
                Nice teamwork! Decentralized verification is when lots of people check proofs to make sure 
                they're right. It's like your friends all checking your homework—no one can cheat, and 
                everyone trusts it!
              </p>
            </ExplanationCard>
            
            <ExplanationCard title="How LayerEdge Uses It">
              <p>
                LayerEdge has lots of helpers (called validators) checking the proofs. This makes sure 
                everything is fair and safe for Bitcoin.
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

export default Level4;
