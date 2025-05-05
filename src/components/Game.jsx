import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Level1 from './levels/Level1';
import Level2 from './levels/Level2';
import Level3 from './levels/Level3';
import Level4 from './levels/Level4';
import Level5 from './levels/Level5';
import { Confetti, StarsReward, Streak } from './common/RewardEffects';
import { playLevelComplete, playReward, vibrate, VIBRATION_PATTERNS } from '../utils/SoundEffects';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100%;
  padding: var(--spacing-md);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: var(--spacing-sm);
  }
`;

const Header = styled(motion.header)`
  text-align: center;
  margin-bottom: var(--spacing-lg);
  width: 100%;
  max-width: 800px;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled(motion.h2)`
  font-size: var(--font-size-md);
  color: var(--secondary-color);
  margin-top: 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 600px;
  height: 20px;
  background-color: rgba(106, 90, 205, 0.2);
  border-radius: 10px;
  margin: var(--spacing-md) auto;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 10px;
  width: ${props => (props.level / props.totalLevels) * 100}%;
  box-shadow: 0 0 10px rgba(106, 90, 205, 0.5);
`;

const LevelIndicator = styled(motion.div)`
  font-size: var(--font-size-sm);
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScoreContainer = styled(motion.div)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--primary-color);
  color: white;
  padding: 8px 15px;
  border-radius: var(--border-radius);
  font-weight: bold;
  font-size: var(--font-size-sm);
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    top: 5px;
    right: 5px;
    padding: 5px 10px;
    font-size: 0.8rem;
  }
`;

const ScoreIcon = styled.span`
  margin-right: 5px;
  font-size: 1.2em;
`;

const LevelStar = styled(motion.span)`
  color: ${props => props.earned ? 'var(--reward-color)' : '#ccc'};
  margin: 0 3px;
  font-size: 1.2em;
`;

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [levelStars, setLevelStars] = useState([0, 0, 0, 0, 0]); // Stars earned per level
  const totalLevels = 5;

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('proofQuestScore');
      const savedLevel = localStorage.getItem('proofQuestLevel');
      const savedStars = localStorage.getItem('proofQuestStars');

      if (savedScore) setScore(parseInt(savedScore));
      if (savedLevel) setCurrentLevel(parseInt(savedLevel));
      if (savedStars) setLevelStars(JSON.parse(savedStars));
    } catch (error) {
      console.error('Error loading saved progress', error);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('proofQuestScore', score.toString());
      localStorage.setItem('proofQuestLevel', currentLevel.toString());
      localStorage.setItem('proofQuestStars', JSON.stringify(levelStars));
    } catch (error) {
      console.error('Error saving progress', error);
    }
  }, [score, currentLevel, levelStars]);

  const handleLevelComplete = (starsEarned = 3) => {
    // Update stars for the completed level
    const newLevelStars = [...levelStars];
    newLevelStars[currentLevel - 1] = Math.max(starsEarned, levelStars[currentLevel - 1]);
    setLevelStars(newLevelStars);

    // Add points based on stars earned and streak
    const pointsEarned = starsEarned * 100 * (streak > 0 ? streak : 1);
    setScore(prevScore => prevScore + pointsEarned);

    // Increment streak
    setStreak(prevStreak => prevStreak + 1);

    // Show reward animations
    setShowConfetti(true);
    setTimeout(() => {
      setShowStars(true);

      // Play reward sounds
      playLevelComplete();
      vibrate(VIBRATION_PATTERNS.LEVEL_COMPLETE);

      // Move to next level after animations
      setTimeout(() => {
        setShowConfetti(false);
        setShowStars(false);

        // For now, we'll just increment the level
        // In the future, we'll add more levels
        setCurrentLevel(prevLevel => {
          if (prevLevel === totalLevels) {
            // Reset streak when game is completed
            setStreak(0);
            return 1;
          }
          return prevLevel + 1;
        });
      }, 2000);
    }, 500);
  };

  // Add points during gameplay
  const addPoints = (points) => {
    setScore(prevScore => prevScore + points);
    playReward();
    vibrate(VIBRATION_PATTERNS.REWARD);
  };

  return (
    <GameContainer>
      <Header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          animate={{
            scale: [1, 1.03, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          Proof Quest
        </Title>
        <Subtitle
          animate={{
            y: [0, -5, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          Become a Proof Detective!
        </Subtitle>

        <ProgressBar>
          <Progress
            level={currentLevel}
            totalLevels={totalLevels}
            initial={{ width: 0 }}
            animate={{ width: `${(currentLevel / totalLevels) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </ProgressBar>

        <LevelIndicator
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Level {currentLevel} of {totalLevels}
          <div style={{ marginLeft: '10px' }}>
            {[...Array(3)].map((_, i) => (
              <LevelStar
                key={i}
                earned={i < levelStars[currentLevel - 1]}
                initial={{ rotate: 0 }}
                animate={i < levelStars[currentLevel - 1] ? {
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                  transition: {
                    duration: 0.5,
                    delay: i * 0.1
                  }
                } : {}}
              >
                ★
              </LevelStar>
            ))}
          </div>
        </LevelIndicator>

        <ScoreContainer
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <ScoreIcon>🏆</ScoreIcon> {score}
        </ScoreContainer>
      </Header>

      <AnimatePresence mode="wait">
        {currentLevel === 1 && (
          <motion.div
            key="level1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Level1 onComplete={handleLevelComplete} addPoints={addPoints} />
          </motion.div>
        )}

        {currentLevel === 2 && (
          <motion.div
            key="level2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Level2 onComplete={handleLevelComplete} addPoints={addPoints} />
          </motion.div>
        )}

        {currentLevel === 3 && (
          <motion.div
            key="level3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Level3 onComplete={handleLevelComplete} addPoints={addPoints} />
          </motion.div>
        )}

        {currentLevel === 4 && (
          <motion.div
            key="level4"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Level4 onComplete={handleLevelComplete} addPoints={addPoints} />
          </motion.div>
        )}

        {currentLevel === 5 && (
          <motion.div
            key="level5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Level5 onComplete={() => handleLevelComplete(3)} addPoints={addPoints} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward effects */}
      <Confetti isActive={showConfetti} />
      <StarsReward isActive={showStars} count={levelStars[currentLevel - 1]} />
      <Streak count={streak} isActive={streak > 1} />
    </GameContainer>
  );
};

export default Game;
