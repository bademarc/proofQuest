// Sound effects utility for the game

// Create audio context when needed (to comply with autoplay policies)
let audioContext = null;

// Define AudioContext with fallback for older browsers
const AudioContextClass = window.AudioContext ||
  // @ts-ignore: webkitAudioContext is used for Safari compatibility
  window.webkitAudioContext;

// Initialize audio context on user interaction
const initAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      console.error('Web Audio API is not supported in this browser', error);
    }
  }
  return audioContext;
};

// Play a success sound
export const playSuccess = () => {
  const context = initAudioContext();
  if (!context) return;

  try {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Success sound (ascending notes)
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(880, context.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.4);
  } catch (error) {
    console.error('Error playing success sound', error);
  }
};

// Play an error sound
export const playError = () => {
  const context = initAudioContext();
  if (!context) return;

  try {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Error sound (descending notes)
    oscillator.frequency.setValueAtTime(330, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(220, context.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
  } catch (error) {
    console.error('Error playing error sound', error);
  }
};

// Play a click sound
export const playClick = () => {
  const context = initAudioContext();
  if (!context) return;

  try {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Click sound (short blip)
    oscillator.frequency.setValueAtTime(660, context.currentTime);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  } catch (error) {
    console.error('Error playing click sound', error);
  }
};

// Play a reward sound
export const playReward = () => {
  const context = initAudioContext();
  if (!context) return;

  try {
    // Create multiple oscillators for a richer sound
    const oscillator1 = context.createOscillator();
    const oscillator2 = context.createOscillator();
    const gainNode = context.createGain();

    oscillator1.type = 'sine';
    oscillator2.type = 'triangle';

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(context.destination);

    // Reward sound (ascending arpeggio)
    oscillator1.frequency.setValueAtTime(440, context.currentTime); // A4
    oscillator1.frequency.setValueAtTime(554.37, context.currentTime + 0.1); // C#5
    oscillator1.frequency.setValueAtTime(659.25, context.currentTime + 0.2); // E5
    oscillator1.frequency.setValueAtTime(880, context.currentTime + 0.3); // A5

    oscillator2.frequency.setValueAtTime(220, context.currentTime); // A3
    oscillator2.frequency.setValueAtTime(277.18, context.currentTime + 0.1); // C#4
    oscillator2.frequency.setValueAtTime(329.63, context.currentTime + 0.2); // E4
    oscillator2.frequency.setValueAtTime(440, context.currentTime + 0.3); // A4

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.4);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.6);

    oscillator1.start(context.currentTime);
    oscillator2.start(context.currentTime);
    oscillator1.stop(context.currentTime + 0.6);
    oscillator2.stop(context.currentTime + 0.6);
  } catch (error) {
    console.error('Error playing reward sound', error);
  }
};

// Play a level complete sound
export const playLevelComplete = () => {
  const context = initAudioContext();
  if (!context) return;

  try {
    // Create multiple oscillators for a richer sound
    const oscillator1 = context.createOscillator();
    const oscillator2 = context.createOscillator();
    const gainNode = context.createGain();

    oscillator1.type = 'sine';
    oscillator2.type = 'triangle';

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(context.destination);

    // Level complete fanfare
    const notes1 = [
      { freq: 440, time: 0 },    // A4
      { freq: 440, time: 0.2 },  // A4
      { freq: 659.25, time: 0.4 }, // E5
      { freq: 880, time: 0.7 }   // A5
    ];

    const notes2 = [
      { freq: 220, time: 0 },    // A3
      { freq: 220, time: 0.2 },  // A3
      { freq: 329.63, time: 0.4 }, // E4
      { freq: 440, time: 0.7 }   // A4
    ];

    notes1.forEach(note => {
      oscillator1.frequency.setValueAtTime(note.freq, context.currentTime + note.time);
    });

    notes2.forEach(note => {
      oscillator2.frequency.setValueAtTime(note.freq, context.currentTime + note.time);
    });

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.2, context.currentTime + 0.7);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 1.2);

    oscillator1.start(context.currentTime);
    oscillator2.start(context.currentTime);
    oscillator1.stop(context.currentTime + 1.2);
    oscillator2.stop(context.currentTime + 1.2);
  } catch (error) {
    console.error('Error playing level complete sound', error);
  }
};

// Enable vibration for mobile devices
export const vibrate = (pattern) => {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.error('Error with vibration API', error);
    }
  }
};

// Vibration patterns
export const VIBRATION_PATTERNS = {
  SUCCESS: [100],
  ERROR: [50, 30, 50],
  CLICK: [10],
  REWARD: [50, 30, 50, 30, 100],
  LEVEL_COMPLETE: [100, 50, 100, 50, 200]
};

export default {
  playSuccess,
  playError,
  playClick,
  playReward,
  playLevelComplete,
  vibrate,
  VIBRATION_PATTERNS
};
