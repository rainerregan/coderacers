import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierCaveDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { TypingResult } from '../components/Typeracer';
import { CodeSnippet, ProgrammingLanguageEnum } from '../data/languages';

export interface CharacterInfo {
  character: string;
  className: string;
  style: any;
}

interface TyperacerContextType {
  timer: number;
  typed: string;
  isCompleted: boolean;
  focused: boolean;
  started: boolean;
  charactersData: CharacterInfo[] | null;
  typingRef: React.RefObject<HTMLDivElement>;
  selectedLanguage?: ProgrammingLanguageEnum;
  codeSnippet: CodeSnippet | null;
  handleTyping: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onTestComplete?: (result: TypingResult) => void;
  setTyped: React.Dispatch<React.SetStateAction<string>>;
  setFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setCharactersData: React.Dispatch<React.SetStateAction<CharacterInfo[] | null>>;
  calculateWPM: () => number;
  calculateAccuracy: () => number;
}

interface TyperacerProviderType {
  children: ReactNode;
  selectedLanguage: ProgrammingLanguageEnum;
  codeSnippet: CodeSnippet | null;
  onTestComplete?: (result: TypingResult) => void;
}

const TyperacerContext = createContext<TyperacerContextType | undefined>(undefined);

export const TyperacerProvider: React.FC<TyperacerProviderType> = ({
  children,
  codeSnippet,
  selectedLanguage,
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
    const currentSnippet = codeSnippet?.snippet;

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
    } else if (typed.length < (currentSnippet?.length || 0) && key.length === 1) {
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

  const calculateWPM = () => {
    const wordCount = typed.length / 5; // Average word length is 5 characters
    const minutes = timer / 60;
    return Math.round(wordCount / (minutes || 1)); // Avoid divide by zero
  };

  const calculateAccuracy = () => {
    const correctCharacters = typed.split('').filter((char, index) => char === codeSnippet?.snippet[index]);
    return (correctCharacters.length / typed.length) * 100;
  }

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


  const value: TyperacerContextType = {
    timer,
    typed,
    isCompleted,
    focused,
    started,
    charactersData,
    typingRef,
    handleTyping,
    selectedLanguage,
    codeSnippet,
    onTestComplete,
    setTyped,
    setFocused,
    setIsCompleted,
    setStarted,
    setCharactersData,
    calculateWPM,
    calculateAccuracy,
  };

  useEffect(() => {
    const calculateCharacters = async () => {
      if (!codeSnippet) return;
      // Mock rendererProps using SyntaxHighlighter's rendering logic.
      let p = null;
      new SyntaxHighlighter({
        language: selectedLanguage,
        style: atelierCaveDark,
        children: codeSnippet?.snippet,
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
    return () => {
      stopTimer();
    }
  }, []);

  return (
    <TyperacerContext.Provider value={value}>
      {children}
    </TyperacerContext.Provider>
  );
};

export const useTyperacer = () => {
  const context = useContext(TyperacerContext);
  if (context === undefined) {
    throw new Error('useTyperacer must be used within a TyperacerProvider');
  }
  return context;
};