import './App.css'
import Button from './components/common/Button'
import TypeRacer from './components/Typeracer'
import codeSnippets from './data/snippets'

function App() {
  return (
    <div className='flex h-screen w-full items-center justify-center flex-col'>
      <div className='flex flex-col gap-2 text-center mb-8'>
        <h1>CodeRacers</h1>
        <p>Jadilah si paling ngoding, showcase speed coding kamu!</p>
      </div>

      <div className='min-w-[70%]'>
        <div className='mb-8'>
          <TypeRacer codeSnippet={codeSnippets[0]} />
        </div>

        <div className='w-full flex justify-center'>
          <Button icon={"Restart"} />
        </div>
      </div>
    </div>
  )
}

export default App
