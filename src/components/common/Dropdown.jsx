import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { playClick, vibrate, VIBRATION_PATTERNS } from '../../utils/SoundEffects';

const DropdownContainer = styled.div`
  margin: var(--spacing-md) 0;
  position: relative;
  width: 100%;
  max-width: 300px;
  z-index: 10;

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const Label = styled(motion.label)`
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: bold;
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    transition: width 0.3s ease;
  }

  ${DropdownContainer}:hover &:after {
    width: 100%;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled(motion.select)`
  width: 100%;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 2px solid var(--primary-color);
  background-color: white;
  font-size: var(--font-size-sm);
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236a5acd' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.2s;
  z-index: 1;

  &:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.2);
  }

  option {
    padding: 15px;
    background-color: white;
    color: var(--text-color);
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 15px;
    min-height: 50px; /* Larger touch target */
  }
`;

const SelectGlow = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--border-radius);
  pointer-events: none;
  z-index: 0;
`;

const SelectIcon = styled(motion.div)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  pointer-events: none;
  z-index: 2;
`;

const SelectedOption = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  pointer-events: none;
  color: ${props => props.hasValue ? 'var(--text-color)' : '#999'};
  font-weight: ${props => props.hasValue ? 'bold' : 'normal'};
  z-index: 2;
`;

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== '';

  const selectedLabel = hasValue
    ? options.find(option => option.value === value)?.label || ''
    : 'Select an option';

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
      playClick();
      vibrate(VIBRATION_PATTERNS.CLICK);
    }
  };

  return (
    <DropdownContainer>
      {label && (
        <Label
          htmlFor={id}
          animate={{
            color: isFocused ? 'var(--secondary-color)' : 'var(--primary-color)',
            scale: isFocused ? 1.05 : 1,
            x: isFocused ? 5 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </Label>
      )}

      <SelectWrapper>
        <StyledSelect
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.02 }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>

        <SelectGlow
          animate={{
            boxShadow: isFocused
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

        <SelectIcon
          animate={{
            rotate: isFocused ? 180 : 0,
            y: isFocused ? '-50%' : '-50%'
          }}
          transition={{ duration: 0.3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </SelectIcon>
      </SelectWrapper>
    </DropdownContainer>
  );
};

export default Dropdown;
