import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #6a5acd; /* Purple */
    --secondary-color: #ff8c00; /* Orange */
    --accent-color: #32cd32; /* Green */
    --reward-color: #ffd700; /* Gold for rewards */
    --highlight-color: #ff1493; /* Hot pink for highlights */
    --background-color: #f0f8ff; /* Light blue background */
    --text-color: #333;
    --card-background: #fff;
    --success-color: #4caf50;
    --error-color: #f44336;
    --border-radius: 12px;
    --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    --glow-shadow: 0 0 15px rgba(106, 90, 205, 0.7);
    --dark-background: #2d2b42;
    --dark-text: #ffffff;

    /* Responsive font sizes */
    --font-size-xl: clamp(2rem, 5vw, 3rem);
    --font-size-lg: clamp(1.5rem, 4vw, 2.5rem);
    --font-size-md: clamp(1.1rem, 3vw, 1.5rem);
    --font-size-sm: clamp(0.9rem, 2.5vw, 1.2rem);

    /* Responsive spacing */
    --spacing-xl: clamp(30px, 5vw, 50px);
    --spacing-lg: clamp(20px, 4vw, 30px);
    --spacing-md: clamp(15px, 3vw, 20px);
    --spacing-sm: clamp(10px, 2vw, 15px);

    /* Animation speeds */
    --animation-slow: 1.5s;
    --animation-medium: 0.8s;
    --animation-fast: 0.3s;
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
  }

  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overscroll-behavior: none; /* Prevent pull-to-refresh on mobile */
    overflow-y: auto;
  }

  body {
    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif;
    background-color: var(--background-color);
    background-image: linear-gradient(to bottom right, #f0f8ff, #e6f0ff);
    color: var(--text-color);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 16px;
    line-height: 1.6;
    touch-action: manipulation; /* Improve touch responsiveness */
  }

  #root {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  h1 {
    font-size: var(--font-size-xl);
    margin-top: 0;
    color: var(--primary-color);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  }

  h2 {
    font-size: var(--font-size-lg);
    margin-top: 0;
    color: var(--primary-color);
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }

  h3, h4, h5, h6 {
    color: var(--primary-color);
    margin-top: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  p {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-md);
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: var(--border-radius);
    padding: var(--spacing-sm) var(--spacing-md);
    font-family: inherit;
    font-weight: bold;
    font-size: var(--font-size-sm);
    transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
    position: relative;
    overflow: hidden;

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
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

      &:before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 480px) {
      width: 100%;
      margin: var(--spacing-sm) 0;
      padding: var(--spacing-md) var(--spacing-md); /* Larger touch target */
      min-height: 48px; /* Minimum touch target size */
    }
  }

  /* Improve touch targets for mobile */
  input, select, a {
    min-height: 44px;
    min-width: 44px;

    @media (max-width: 480px) {
      font-size: 16px; /* Prevent zoom on input focus in iOS */
    }
  }

  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: var(--spacing-md);
  }

  .card {
    background-color: var(--card-background);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    width: 100%;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
  }

  .success-text {
    color: var(--success-color);
    font-weight: bold;
  }

  .error-text {
    color: var(--error-color);
    font-weight: bold;
  }

  /* Pulse animation for interactive elements */
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  /* Glow animation */
  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(106, 90, 205, 0.5); }
    50% { box-shadow: 0 0 20px rgba(106, 90, 205, 0.8); }
    100% { box-shadow: 0 0 5px rgba(106, 90, 205, 0.5); }
  }

  /* Floating animation */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  /* Media Queries */
  @media (max-width: 768px) {
    .container {
      padding: var(--spacing-sm);
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 14px;
    }

    /* Fix for iOS 100vh issue */
    #root {
      min-height: -webkit-fill-available;
    }
  }

  /* Hide scrollbar but allow scrolling */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

export default GlobalStyles;
