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

const BlockchainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: var(--spacing-md) 0;
  position: relative;
  min-height: 200px;
`;

const BlockchainTrack = styled(motion.div)`
  width: 90%;
  height: 10px;
  background-color: rgba(106, 90, 205, 0.2);
  border-radius: 5px;
  margin: 50px 0;
  position: relative;
`;

const Block = styled(motion.div)`
  width: 60px;
  height: 60px;
  background-color: ${props => props.active ? 'var(--primary-color)' : '#ddd'};
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: ${props => props.position}%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: ${props => props.active ? '0 0 15px rgba(106, 90, 205, 0.7)' : 'none'};
  z-index: ${props => props.active ? 2 : 1};
`;

const ProofBlock = styled(motion.div)`
  width: 70px;
  height: 70px;
  background-color: var(--secondary-color);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 0 15px rgba(255, 140, 0, 0.5);
  margin-bottom: var(--spacing-md);
`;

const MagicBook = styled(motion.div)`
  width: 150px;
  height: 100px;
  background-color: #8b4513;
  border-radius: 5px;
  position: relative;
  margin: var(--spacing-md) 0;
  transform-style: preserve-3d;
  perspective: 1000px;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #a0522d;
    border-radius: 5px;
    transform: rotateY(15deg);
    transform-origin: left;
    z-index: -1;
  }

  &:after {
    content: '';
    position: absolute;
    width: 80%;
    height: 90%;
    top: 5%;
    left: 10%;
    background: linear-gradient(45deg, #f5deb3, #d2b48c);
    border-radius: 3px;
  }
`;

const BookSymbol = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: #8b4513;
  z-index: 1;
`;

const Firework = styled(motion.div)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${props => props.color};
  filter: blur(1px);
`;

const ResultMessage = styled(motion.div)`
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  font-weight: bold;
  text-align: center;
  font-size: var(--font-size-sm);
  width: 100%;
  background-color: rgba(76, 175, 80, 0.2);
  color: var(--success-color);
`;

const FinalSummary = styled(motion.div)`
  background-color: rgba(106, 90, 205, 0.1);
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
  width: 100%;
  background-color: var(--card-background);
  color: var(--text-color);

  h2 {
    color: var(--primary-color);
    text-align: center;
    margin-top: 0;
    font-size: var(--font-size-lg);
  }

  ul {
    margin: var(--spacing-md) 0;
    padding-left: var(--spacing-lg);

    li {
      margin-bottom: var(--spacing-sm);
      font-size: var(--font-size-md);
      color: var(--text-color);
    }
  }

  p {
    margin-top: var(--spacing-md);
    font-weight: bold;
    text-align: center;
    font-size: var(--font-size-md);
    color: var(--text-color);
  }
`;

const Level5 = ({ onComplete }) => {
  const [blockchainActive, setBlockchainActive] = useState(false);
  const [proofSent, setProofSent] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinalSummary, setShowFinalSummary] = useState(false);
  const [fireworks, setFireworks] = useState([]);

  useEffect(() => {
    if (showFireworks) {
      // Create fireworks
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      const newFireworks = [];

      for (let i = 0; i < 30; i++) {
        newFireworks.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      setFireworks(newFireworks);

      // Show explanation after fireworks
      setTimeout(() => {
        setShowExplanation(true);
      }, 2000);
    }
  }, [showFireworks]);

  const handleSendToBlockchain = () => {
    setProofSent(true);

    // Animate blockchain
    setTimeout(() => {
      setBlockchainActive(true);

      // Show magic book
      setTimeout(() => {
        setShowBook(true);

        // Open book
        setTimeout(() => {
          setBookOpen(true);

          // Show fireworks
          setTimeout(() => {
            setShowFireworks(true);
          }, 1000);
        }, 1000);
      }, 1500);
    }, 1000);
  };

  const handleNextLevel = () => {
    setShowFinalSummary(true);
  };

  const handlePlayAgain = () => {
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
        Level 5: Settling on Bitcoin
      </Title>

      <InstructionText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Final mission, Detective! You've made proofs, combined them, powered up Bitcoin, and checked them with friends.
        Now, send your super-proof to Bitcoin's magic book—a blockchain! Watch it lock in forever.
      </InstructionText>

      <GameArea
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <ProofBlock
          animate={proofSent ? {
            y: [0, -100, -50],
            x: [0, 0, 150],
            scale: [1, 1, 0.7],
            opacity: [1, 1, 0]
          } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          ZK
        </ProofBlock>

        <Button
          onClick={handleSendToBlockchain}
          disabled={proofSent}
          whileHover={{ scale: 1.05, backgroundColor: '#ff8c00' }}
        >
          Send to Bitcoin!
        </Button>

        <BlockchainContainer>
          <BlockchainTrack
            animate={blockchainActive ? {
              backgroundColor: 'rgba(106, 90, 205, 0.5)',
              boxShadow: '0 0 10px rgba(106, 90, 205, 0.5)'
            } : {}}
            transition={{ duration: 1 }}
          />

          {[0, 20, 40, 60, 80, 100].map((position, index) => (
            <Block
              key={index}
              position={position}
              active={blockchainActive}
              animate={blockchainActive ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
                transition: { delay: index * 0.2, duration: 0.5 }
              } : {}}
            >
              {index + 1}
            </Block>
          ))}

          <AnimatePresence>
            {showBook && (
              <MagicBook
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '120px',
                  transform: `rotateY(${bookOpen ? '30deg' : '0deg'}) scale(${bookOpen ? 1.2 : 1})`,
                  transition: 'transform 1s ease'
                }}
              >
                <BookSymbol>₿</BookSymbol>
              </MagicBook>
            )}
          </AnimatePresence>

          {showFireworks && fireworks.map(fw => (
            <Firework
              key={fw.id}
              color={fw.color}
              style={{ top: `${fw.y}%`, left: `${fw.x}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 50],
                y: [0, (Math.random() - 0.5) * 50]
              }}
              transition={{ duration: 1.5, delay: Math.random() * 0.5 }}
            />
          ))}
        </BlockchainContainer>

        {showFireworks && (
          <ResultMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Success! Your proof is now permanently recorded on the blockchain!
          </ResultMessage>
        )}
      </GameArea>

      <AnimatePresence>
        {showExplanation && !showFinalSummary && (
          <>
            <ExplanationCard title="What is Settlement on Bitcoin?">
              <p>
                You did it! Settlement is like writing your proof in a magic book called a blockchain.
                Once it's there, no one can erase it, and everyone can see it's true. It's super secure!
              </p>
            </ExplanationCard>

            <ExplanationCard title="How LayerEdge Uses It">
              <p>
                LayerEdge puts all the checked proofs onto Bitcoin's blockchain. This uses Bitcoin's
                strength to keep everything safe forever.
              </p>
            </ExplanationCard>

            <Button
              onClick={handleNextLevel}
              variant="secondary"
              whileHover={{ scale: 1.05 }}
            >
              See Final Summary
            </Button>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFinalSummary && (
          <FinalSummary
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: 'white',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              padding: '30px',
              borderWidth: '3px'
            }}
          >
            <h2 style={{ color: '#6a5acd', fontSize: '2rem', marginBottom: '20px' }}>
              Congratulations, Proof Detective!
            </h2>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
              You've mastered LayerEdge's powers:
            </p>
            <ul style={{ fontSize: '1.1rem', color: '#333' }}>
              <li style={{ marginBottom: '10px' }}>zk-Proofs hide secrets like magic tricks.</li>
              <li style={{ marginBottom: '10px' }}>Aggregation combines proofs to save time.</li>
              <li style={{ marginBottom: '10px' }}>BitVM makes Bitcoin a super calculator.</li>
              <li style={{ marginBottom: '10px' }}>Decentralized Verification checks everything with friends.</li>
              <li style={{ marginBottom: '10px' }}>Settlement locks it all in Bitcoin's magic book.</li>
            </ul>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333', marginTop: '20px' }}>
              LayerEdge uses these to make Bitcoin better—more private, powerful, and safe!
            </p>

            <Button
              onClick={handlePlayAgain}
              variant="primary"
              whileHover={{ scale: 1.05 }}
              style={{
                margin: '20px auto',
                display: 'block',
                backgroundColor: '#6a5acd',
                color: 'white',
                padding: '15px 30px',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              PLAY AGAIN
            </Button>
          </FinalSummary>
        )}
      </AnimatePresence>
    </LevelContainer>
  );
};

export default Level5;
