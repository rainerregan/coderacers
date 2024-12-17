import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/common/Button'
import Select from './components/common/Select'
import TypeRacer, { TypingResult } from './components/Typeracer'
import { CodeSnippet, ProgrammingLanguageEnum, programmingLanguages, SnippetData } from './data/languages'

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
    <div className='flex h-screen w-full items-center justify-center flex-col'>
      <div className='flex flex-col gap-2 text-center mb-8'>
        <h1>CodeRacers</h1>
        <p>Be the best! Showcase your coding typing skill!</p>
      </div>

      <div className='mb-8'>
        <Select
          options={programmingLanguages.map((language) => ({
            value: language.id,
            label: language.name,
          }))}
          onChange={handleLanguageChange}
          defaultValue={selectedLanguage}
        />
      </div>

      <div className='min-w-[70%]'>
        <div className='mb-8'>
          {selectedSnippet ? (
            <TypeRacer language={selectedLanguage} codeSnippet={selectedSnippet} onTestComplete={handleOnTestComplete} />
          ) : (
            <div>Language is still not available</div>
          )}
        </div>

        <div className='w-full flex justify-center'>
          <Button icon={"Restart"} />
        </div>
      </div>
    </div>
  )
}

export default App
