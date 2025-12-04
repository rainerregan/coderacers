import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/common/Button'
import Select from './components/common/Select'
import TypeRacer, { TypingResult } from './components/Typeracer'
import { CodeSnippet, ProgrammingLanguageEnum, programmingLanguages, SnippetData } from './data/languages'
import { TyperacerProvider } from './contexts/typeracer-context'

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

        <div className='mb-8 bg-coderacers-bg p-4 rounded-md w-full'>
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
            <Button icon={"Restart"} />
          </div>
        </div>
      </TyperacerProvider>
    </div>
  )
}

export default App
