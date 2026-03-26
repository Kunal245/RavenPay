import { useState } from 'react';

export function Button({ label, onClick }) {
  const [buttonState, setButtonState] = useState('idle');

  const handleClick = (e) => {
    // Prevent clicking multiple times
    if (buttonState !== 'idle') return;

    // 1. Start the delay/processing phase
    setButtonState('loading');

    // 2. Wait 1.5 seconds, then show the blue success state
    setTimeout(() => {
      setButtonState('success');

      // 3. Give the user 800ms to actually SEE the tick and blue color, 
      // AND THEN trigger the navigation.
      setTimeout(() => {
        if (onClick) onClick(e);
      }, 800); 
      
    }, 1500); 
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      disabled={buttonState !== 'idle'}
      className={`
        w-full focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
        transition-all duration-500 ease-in-out flex items-center justify-center gap-2
        ${
          buttonState === 'success'
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'text-white bg-gray-800 hover:bg-gray-900' 
        }
      `}
    >
      {/* Animated Tick SVG Container */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center ${
          buttonState === 'success' 
            ? 'w-5 opacity-100 scale-100' 
            : 'w-0 opacity-0 scale-0'     
        }`}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Dynamic Label */}
      <span className="transition-all duration-300">
        {buttonState === 'loading'
          ? 'Wait...'
          : buttonState === 'success'
          ? 'Success!'
          : label}
      </span>
    </button>
  );
}