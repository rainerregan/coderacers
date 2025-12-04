import React, { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierCaveDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { twMerge } from 'tailwind-merge';
import './typeracer.css';
import { CodeSnippet, ProgrammingLanguageEnum } from '../data/languages';

interface TypeRacerProps {
  codeSnippet: CodeSnippet;
  language: ProgrammingLanguageEnum;
  onTestComplete?: (result: TypingResult) => void;
}

interface CharacterInfo {
  character: string;
  className: string;
  style: any;
}

export interface TypingResult {
  wpm: number;
  accuracy: number;
}

const TypeRacer: React.FC<TypeRacerProps> = ({
  codeSnippet,
  language,
  onTestComplete
}) => {
  const typingRef = useRef<HTMLDivElement>(null);

  const [typed, setTyped] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [started, setStarted] = useState(false);

  const [charactersData, setCharactersData] = useState<CharacterInfo[] | null>(null);

  // Timer
  const [timer, setTimer] = useState(15); // Start countdown from 15 seconds

  const timerRef = useRef<number | null>(null); // Use number for browser setInterval

  const handleTyping = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isCompleted) return;
    if (!focused) return;

    const key = e.key;
    const currentSnippet = codeSnippet.snippet;

    // If typing has not started, start it
    // Start timer on first keypress
    if (!started) {
      setStarted(true);
      startTimer();
    }

    // If command/ctrl + backspace, delete last word
    // If on mac, use command key
    if ((e.metaKey || e.ctrlKey) && key === 'Backspace') {
      setTyped((prev) => prev.replace(/(\S+)\s*$/, ''));
    }

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
      handleOnComplete();
    }
  };

  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleOnComplete();
            clearInterval(timerRef.current as number);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Decrease timer every second
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current as number);
      timerRef.current = null;
    }
  };

  const extractCharacters = (props: rendererProps): CharacterInfo[] => {
    const { rows, stylesheet } = props;
    const characters: CharacterInfo[] = [];

    const traverseNode = (node: rendererNode, parentClassName = '', parentColor = '') => {
      if (node.type === 'text' && node.value) {
        // If it's a text node, split the value into characters
        const word = node.value as string;
        word.split('').forEach((char) => {
          characters.push({
            character: char,
            className: parentClassName || '',
            style: stylesheet[parentClassName] || '',
          });
        });
      } else if (node.type === 'element') {
        // If it's an element, recursively process its children
        const className = (node.properties?.className || []).filter(x => x !== 'hljs-function').join(' ');
        const color = node.properties?.style?.color || parentColor;

        if (node.children) {
          node.children.forEach((child: rendererNode) =>
            traverseNode(child, className, color)
          );
        }
      }
    };

    rows.forEach((row: rendererNode) => {
      traverseNode(row);
    });

    return characters;
  };

  const handleOnComplete = () => {
    setIsCompleted(true);
    setStarted(false);
    stopTimer();

    const result: TypingResult = {
      wpm: calculateWPM(),
      accuracy: calculateAccuracy(),
    };

    if (onTestComplete) {
      onTestComplete(result);
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

  const calculateWPM = () => {
    const wordCount = typed.length / 5; // Average word length is 5 characters
    const minutes = timer / 60;
    return Math.round(wordCount / (minutes || 1)); // Avoid divide by zero
  };

  const calculateAccuracy = () => {
    const correctCharacters = typed.split('').filter((char, index) => char === codeSnippet.snippet[index]);
    return (correctCharacters.length / typed.length) * 100;
  }

  useEffect(() => {
    const calculateCharacters = async () => {
      // Mock rendererProps using SyntaxHighlighter's rendering logic.
      let p = null;
      new SyntaxHighlighter({
        language: language,
        style: atelierCaveDark,
        children: codeSnippet.snippet,
        renderer: (props) => {
          p = props;
          return null;
        },
      });

      if (!p) return;

      const extractedCharacters = extractCharacters(p);
      setCharactersData(extractedCharacters);
    };

    calculateCharacters();
  }, [codeSnippet]);

  useEffect(() => {
    typingRef.current?.focus();
    return () => stopTimer();
  }, []);

  return (
    <div
      ref={typingRef}
      className="w-full bg-[#282c34] p-4 rounded-md relative overflow-clip"
      tabIndex={0}
      onKeyDown={handleTyping}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
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

      <SyntaxHighlighter
        language={language}
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