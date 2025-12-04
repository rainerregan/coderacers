import React, { useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierCaveDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { twMerge } from 'tailwind-merge';
import { useTyperacer } from '../contexts/typeracer-context';
import './typeracer.css';

interface TypeRacerProps {
}

export interface TypingResult {
  wpm: number;
  accuracy: number;
}

const TypeRacer: React.FC<TypeRacerProps> = () => {
  const { isCompleted, focused, typingRef, charactersData, timer, typed, codeSnippet, handleTyping, setFocused, selectedLanguage, calculateAccuracy, calculateWPM } = useTyperacer();

  const renderSnippetWithCursor = () => {
    if (!codeSnippet) return null;
    const currentSnippet = codeSnippet.snippet;

    const getChar = (char: string) => {
      switch (char) {
        case '\n':
          return <span className='non-text'>{'↵\n'}</span>
        case ' ':
          return <span className='non-text'>{'·'}</span>
        default:
          return char
      }
    }

    return currentSnippet.split('').map((char, index) => {
      const baseClassName = charactersData?.[index]?.className || '';
      const baseStyle = charactersData?.[index]?.style || {};

      if (index < typed.length) {
        // Typed characters: correct or incorrect
        const isCorrect = typed[index] === char;
        return (
          <span
            key={index}
            className={twMerge(baseClassName, isCorrect ? '' : 'text-red-500 bg-red-800')}
            style={baseStyle}
          >
            {getChar(char)}
          </span>
        );
      } else if (index === typed.length) {
        // Current character with blinking cursor
        return (
          <span key={index} className={twMerge(baseClassName, focused && "current-char")}
            style={baseStyle}>
            {getChar(char)}
            {/* {showCursor && <span className="blinking-cursor">|</span>} */}
          </span>
        );
      } else {
        // Untyped characters
        return <span
          key={index}
          className={baseClassName}
          style={{
            ...baseStyle,
            opacity: 0.5,
          }}
        >
          {getChar(char)}
        </span>;
      }
    });
  };

  useEffect(() => {
    typingRef.current?.focus();

    // Listen to any keydown events to focus the typing area
    const handleGlobalKeydown = () => {
      typingRef.current?.focus();
    };

    window.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  }, []);

  return (
    <div
      ref={typingRef}
      className="w-full bg-coderacers-bg p-4 rounded-md relative overflow-clip"
      tabIndex={0}
      onKeyDown={handleTyping}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(true)}
    >
      {/* {!focused && !isCompleted && (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-gray-800/20 backdrop-blur-sm'>
          Click to start typing...
        </div>
      )} */}

      {true && (
        <div className="absolute top-0 right-0 px-2 py-1 z-20 bg-gray-600 rounded-bl-lg text-sm">
          {Math.floor(timer / 60).toString().padStart(2, '0')}:
          {(timer % 60).toString().padStart(2, '0')}
        </div>
      )}

      {codeSnippet && (
        <SyntaxHighlighter
          language={selectedLanguage}
          style={atelierCaveDark}
          customStyle={{
            backgroundColor: 'transparent',
            fontSize: '1.5rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
          useInlineStyles={false}
          renderer={() => {
            return renderSnippetWithCursor();
          }}
        >
          {codeSnippet.snippet}
        </SyntaxHighlighter>
      )}

      {/* Completion Message */}
      {isCompleted && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
          🎉 Great job! You completed the snippet in{' '}
          {Math.floor((15 - timer) / 60)}:{((15 - timer) % 60).toString().padStart(2, '0')} minutes!
          <br />
          Your WPM: <strong>{calculateWPM()} WPM</strong>
          <br />
          Accuracy: <strong>{calculateAccuracy().toFixed(2)}%</strong>
        </div>
      )}
    </div>
  );
};

export default TypeRacer;