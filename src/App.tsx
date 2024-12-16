import './App.css'
import TypeRacer from './components/Typeracer'
import codeSnippets from './data/snippets'

function App() {
  return (
    <div className='flex h-screen w-full items-center justify-center flex-col'>
      <div className='flex flex-col gap-2 text-center mb-8'>
        <h1>CodeRacers</h1>
        <p>Jadilah si paling ngoding, showcase speed coding kamu!</p>
      </div>

      <TypeRacer codeSnippet={codeSnippets[0]} />
    </div>
  )
}

export default App
