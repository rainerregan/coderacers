import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierCaveDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { twMerge } from 'tailwind-merge';
import { CodeSnippet } from '../data/snippets';
import './typeracer.css';

interface TypeRacerProps {
  codeSnippet: CodeSnippet;
}

interface CharacterInfo {
  /** The individual character */
  character: string;
  /** The CSS class name(s) applied to the character */
  className: string;
  style: any;
}

const TypeRacer: React.FC<TypeRacerProps> = ({ codeSnippet }) => {
  const [typed, setTyped] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [started, setStarted] = useState(false);

  const [charactersData, setCharactersData] = useState<CharacterInfo[] | null>(null);

  const handleTyping = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isCompleted) return;
    if (!focused) return;

    const key = e.key;
    const currentSnippet = codeSnippet.snippet;

    // If typing has not started, start it
    if (!started) {
      setStarted(true);
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

  const handleOnComplete = () => {
    setIsCompleted(true);
    setStarted(false);
  }

  useEffect(() => {
    const calculateCharacters = async () => {
      // Mock rendererProps using SyntaxHighlighter's rendering logic.
      let p = null;
      new SyntaxHighlighter({
        language: codeSnippet.language,
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

  return (
    <div
      className="w-full bg-[#282c34] p-4 rounded-md relative overflow-clip"
      tabIndex={0}
      onKeyDown={handleTyping}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {!focused && !isCompleted && (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-gray-800/20 backdrop-blur-sm'>
          Click to start typing...
        </div>
      )}

      {started && (
        <div className='absolute top-0 right-0 px-2 py-1 z-20 bg-gray-600 rounded-bl-lg text-sm'>
          00:00
        </div>
      )}

      <SyntaxHighlighter
        language={codeSnippet.language}
        style={atelierCaveDark}
        customStyle={{
          backgroundColor: 'transparent',
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
          🎉 Great job! You completed the snippet!
        </div>
      )}
    </div>
  );
};

export default TypeRacer;