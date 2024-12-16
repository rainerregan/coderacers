import React, { useState } from 'react';
import { atelierCaveDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CodeSnippet } from '../data/snippets';
import './typeracer.css';

interface TypeRacerProps {
  codeSnippet: CodeSnippet;
}

const TypeRacer: React.FC<TypeRacerProps> = ({ codeSnippet }) => {
  const [typed, setTyped] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleTyping = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isCompleted) return;

    const key = e.key;
    const currentSnippet = codeSnippet.snippet;

    console.log(key);
    // Handle typing and backspace
    if (key === 'Backspace') {
      setTyped((prev) => prev.slice(0, -1));
    } else if (key === 'Enter') {
      setTyped((prev) => prev + '\n');
    } else if (key === 'Tab') {
      e.preventDefault();
      setTyped((prev) => prev + '  ');
    } else if (typed.length < currentSnippet.length && key.length === 1) {
      setTyped((prev) => prev + key);
    }

    // Check if typing is complete
    if (typed + key === currentSnippet) {
      setIsCompleted(true);
    }
  };

  const renderSnippetWithCursor = () => {
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
      if (index < typed.length) {
        // Typed characters: correct or incorrect
        const isCorrect = typed[index] === char;
        return (
          <span
            key={index}
            className={isCorrect ? 'text-green-500' : 'text-red-500 bg-red-800'}
          >
            {getChar(char)}
          </span>
        );
      } else if (index === typed.length) {
        // Current character with blinking cursor
        return (
          <span key={index} className="current-char">
            {getChar(char)}
            {/* {showCursor && <span className="blinking-cursor">|</span>} */}
          </span>
        );
      } else {
        // Untyped characters
        return <span key={index}>
          {getChar(char)}
        </span>;
      }
    });
  };

  return (
    <div
      className="min-w-[70%] bg-[#282c34] p-4 rounded-md"
      tabIndex={0}
      onKeyDown={handleTyping}
      onFocus={() => console.log('Focused')}
      onBlur={() => console.log('Blurred')}
    >
      {/* Render the code snippet */}
      <pre
        style={{
          ...atelierCaveDark,
          backgroundColor: 'transparent',
          padding: '1rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        {renderSnippetWithCursor()}
      </pre>

      {/* Completion Message */}
      {isCompleted && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
          🎉 Great job! You completed the snippet!
        </div>
      )}
    </div>
  );
};

export default TypeRacer;