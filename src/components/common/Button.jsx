import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { playClick, vibrate, VIBRATION_PATTERNS } from '../../utils/SoundEffects';

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
  margin: var(--spacing-sm) 0;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const StyledButton = styled(motion.button)`
  background: ${props => {
    if (props.disabled) return 'linear-gradient(to bottom, #a8a8a8, #888888)';

    switch(props.variant) {
      case 'primary':
        return 'linear-gradient(to bottom, var(--primary-color), #5849b8)';
      case 'secondary':
        return 'linear-gradient(to bottom, var(--secondary-color), #e67e00)';
      case 'accent':
        return 'linear-gradient(to bottom, var(--accent-color), #28a428)';
      default:
        return 'linear-gradient(to bottom, var(--primary-color), #5849b8)';
    }
  }};
  color: white;
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  border: none;
  box-shadow: 0 4px 0 ${props => {
    if (props.disabled) return '#666666';

    switch(props.variant) {
      case 'primary':
        return '#483a9c';
      case 'secondary':
        return '#cc6d00';
      case 'accent':
        return '#218c21';
      default:
        return '#483a9c';
    }
  }}, 0 6px 10px rgba(0, 0, 0, 0.15);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: transform 0.1s, box-shadow 0.1s;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    &:before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 480px) {
    padding: var(--spacing-md) var(--spacing-md);
    font-size: 1rem;
    min-height: 48px; /* Minimum touch target size */
  }
`;

// Ripple effect component
const Ripple = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  pointer-events: none;
`;

// Glow effect
const GlowEffect = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--border-radius);
  pointer-events: none;
  z-index: -1;
`;

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  whileHover = { scale: 1.03, y: -2 },
  whileTap = { scale: 0.97, y: 2 },
  withSound = true,
  withVibration = true,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Clean up ripples after animation
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const handleClick = (e) => {
    if (disabled) return;

    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples([...ripples, newRipple]);

    // Play sound effect
    if (withSound) {
      playClick();
    }

    // Vibrate on mobile
    if (withVibration) {
      vibrate(VIBRATION_PATTERNS.CLICK);
    }

    // Call original onClick
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <ButtonContainer fullWidth={fullWidth}>
      <StyledButton
        onClick={handleClick}
        variant={variant}
        disabled={disabled}
        whileHover={disabled ? {} : whileHover}
        whileTap={disabled ? {} : whileTap}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...props}
      >
        {children}

        {/* Render ripples */}
        {ripples.map(ripple => (
          <Ripple
            key={ripple.id}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size
            }}
            initial={{ transform: 'scale(0)', opacity: 0.7 }}
            animate={{ transform: 'scale(1)', opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        ))}
      </StyledButton>

      {/* Glow effect on hover */}
      <GlowEffect
        animate={{
          boxShadow: isHovered && !disabled
            ? [
                '0 0 5px rgba(106, 90, 205, 0.3)',
                '0 0 15px rgba(106, 90, 205, 0.5)',
                '0 0 5px rgba(106, 90, 205, 0.3)'
              ]
            : '0 0 0 rgba(106, 90, 205, 0)'
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
    </ButtonContainer>
  );
};

export default Button;
