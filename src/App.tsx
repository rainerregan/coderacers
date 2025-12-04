import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/common/Button'
import Select from './components/common/Select'
import TypeRacer, { TypingResult } from './components/Typeracer'
import { CodeSnippet, ProgrammingLanguageEnum, programmingLanguages, SnippetData } from './data/languages'
import { TyperacerProvider, useTyperacer } from './contexts/typeracer-context'

const defaultLanguage = ProgrammingLanguageEnum.JAVASCRIPT;

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguageEnum>(defaultLanguage)
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(SnippetData[defaultLanguage]?.[0])

  const handleOnTestComplete = (result: TypingResult) => {
    console.log(result)
  }

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as ProgrammingLanguageEnum)
  }

  useEffect(() => {
    console.log(selectedLanguage)
    setSelectedSnippet(SnippetData[selectedLanguage]?.[0])
  }, [selectedLanguage])

  return (
    <div className='flex h-screen w-full items-center justify-center flex-col max-w-[70%] mx-auto' >
      <TyperacerProvider
        selectedLanguage={selectedLanguage}
        codeSnippet={selectedSnippet}
        onTestComplete={handleOnTestComplete}
      >
        <div className='flex flex-col gap-2 text-center mb-8'>
          <h1>CodeRacers</h1>
          <p>Be the best! Showcase your coding typing skill!</p>
        </div>

        <CodeRacerApp
          handleLanguageChange={handleLanguageChange}
          selectedLanguage={selectedLanguage}
          selectedSnippet={selectedSnippet}
        />
      </TyperacerProvider>
    </div>
  )
}

const CodeRacerApp = ({
  handleLanguageChange,
  selectedLanguage,
  selectedSnippet
}: {
  handleLanguageChange: (value: string) => void;
  selectedLanguage: ProgrammingLanguageEnum;
  selectedSnippet: CodeSnippet | null;
}) => {
  const { restartGame, gameId } = useTyperacer();

  return (
    <div className='w-full'>
      <small>{gameId}</small>

      <div className='mb-8 w-full flex justify-center bg-coderacers-bg p-2 rounded-md'>
        <Select
          options={programmingLanguages.map((language) => ({
            value: language.id,
            label: language.name,
          }))}
          onChange={handleLanguageChange}
          defaultValue={selectedLanguage}
        />
      </div>

      <div className='w-full'>
        <div className='mb-8'>
          {selectedSnippet ? (
            <TypeRacer />
          ) : (
            <div>Language is still not available</div>
          )}
        </div>

        <div className='w-full flex justify-center'>
          <Button icon={"Restart"} onClick={restartGame} />
        </div>
      </div>
    </div>
  )
}

export default App
