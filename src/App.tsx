import { useEffect, useRef, useState } from 'react'

const stepsCumbiaList = [
  'Base',
  'laterales',
  'diagonales',
  'giro derecho',
  'giro izquierdo',
  'caja',
  'cruzado',
  'enchufla',
  'corazon y chicle'
]

const stepsSalsaList = [
  'Base',
  'giro',
  'diagonal',
  'diagonal con giro',
  'laterales',
  'laterales con cadera',
  'Base de frente',
  'giro inverso'
]

const stepsBachataList = [
  'Base',
  'giro',
  'diagonal',
  'diagonal con giro',
  'laterales',
  'laterales con cadera',
  'Base de frente',
  'giro inverso'
]

function App() {
  // variables a usar: duracion de la base, numero de pasos, numero de repeticiones, genero de baile
  const [baseDuration, setBaseDuration] = useState(3000)
  const [danceStep, setDanseStep] = useState(4)
  const [repetitions, setRepetitions] = useState(4)
  const [dance, setDance] = useState('cumbia')
  const [actualStep, setActualStep] = useState(0)
  const [counter, setCounter] = useState(0);
  const [realStepDuration, setRealStepDuration] = useState(0);
  const [realRepetitions, setRealRepetitions] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [danceArry, setDanceArry] = useState<string[]>([])
  const clapSoundRef = useRef(new Audio('/clap.mp3'));
  const [bg, setBg] = useState('bg-yellow-200')

  useEffect(() => {
    if (isRunning && actualStep === 1) {
      const interval = setInterval(() => {
        setCounter(prevCounter => {
          if (prevCounter + 1 >= realRepetitions) {
            clearInterval(interval);
            setIsRunning(false);
            setActualStep(2)
            return prevCounter;
          }
          return prevCounter + 1;
        });
      }, realStepDuration);
      return () => clearInterval(interval);
    }
  }, [isRunning, counter]);

  const startConfiguration = () => {
    return (
      <>
        <h1 className='text-center font-black text-2xl p-3'>Configuracion</h1>
        <div className='flex md:flex-row flex-col items-center justify-around'>
          <div className='form-group flex flex-col items-center mb-3 md:mb-0 md:me-3'>
            <label htmlFor='baseDuration'
              className='mb-1'>Duracion de la base (ms)</label>
            <input
              type='number'
              className='border rounded px-2 w-32'
              id='baseDuration'
              value={baseDuration}
              step={1000}
              onChange={(e) => setBaseDuration(parseInt(e.target.value))}
            />
          </div>
          <div className='form-group flex flex-col items-center mb-3 md:mb-0 md:me-3'>
            <label htmlFor='steps'
              className='mb-1'>Numero de pasos a practicar</label>
            <input
              type='number'
              className='border rounded px-2 w-32'
              id='steps'
              value={danceStep}
              onChange={(e) => setDanseStep(parseInt(e.target.value))}
            />
          </div>
          <div className='form-group flex flex-col items-center mb-3 md:mb-0 md:me-3'>
            <label htmlFor='repetitions'
              className='mb-1'>Numero de repeticiones</label>
            <input
              type='number'
              className='border rounded px-2 w-32'
              id='repetitions'
              value={repetitions}
              onChange={(e) => setRepetitions(parseInt(e.target.value))}
            />
          </div>
          <div className='form-group flex flex-col items-center mb-3 md:mb-0 md:me-3'>
            <label htmlFor='dance'
              className='mb-1'>Genero de baile</label>
            <select
              id='dance'
              className='border rounded px-2 w-32'
              value={dance}
              onChange={(e) => setDance(e.target.value)}
            >
              <option value='cumbia'>Cumbia</option>
              <option value='salsa'>Salsa</option>
              <option value='bachata'>Bachata</option>
            </select>
          </div>
        </div>
        <button className='mt-4 p-2 bg-blue-500 text-white rounded' onClick={() => startDancePractice()}>
          Empezar
        </button>
      </>
    )
  }

  const generateDanceSteps = () => {
    const danceSteps = []
    danceSteps.push('Base')
    for (let i = 0; i < danceStep-1; i++) {
      if (dance === 'cumbia') {
        danceSteps.push(stepsCumbiaList[Math.floor(Math.random() * stepsCumbiaList.length)])
      } else if (dance === 'salsa') {
        danceSteps.push(stepsSalsaList[Math.floor(Math.random() * stepsSalsaList.length)])
      } else {
        danceSteps.push(stepsBachataList[Math.floor(Math.random() * stepsBachataList.length)])
      }
    }
    return danceSteps
  }

  const showCounter = () => {
    if (dance === 'bachata') {
      clapSoundRef.current.play();
      return counter % 8 + 1
    }
    if (counter % 8 + 1 === 4) {
      return 3
    }
    if (counter % 8 + 1 === 8) {
      return 7
    }
    clapSoundRef.current.play();
    return counter % 8 + 1
  }

  const startDance = () => {
    return (
      <>
        <h1 className='text-center font-black text-2xl p-3'>{dance}</h1>
        <div className='flex flex-col items-center'>
          <div className={`flex justify-center items-center p-5 pb-7 font-bold text-6xl rounded-full ${bg} `}>
            {showCounter()}
          </div>
          <h2 className='text-lg pt-3'>Paso a seguir</h2>
          <h3 className='text-center font-bold text-5xl p-4'>{danceArry[Math.floor(counter / 8) % danceStep]}</h3>
          <h2 className='text-lg'>siguiente</h2>
          <h3 className='text-center font-bold text-3xl p-3'>{((Math.floor(counter / 8) + 1) / danceStep) < repetitions ? danceArry[((Math.floor(counter / 8) % danceStep) + 1) % danceStep] : 'Fin'}</h3>
        </div>
      </>
    )
  }

  const showSteps = () => {
    return (
      <>
        <h1 className='text-center text-2xl p-3'>Pasos</h1>
        <div className='flex flex-col items-center'>
          {danceArry.map((step, index) => (
            <div key={index} className='flex justify-center items-center font-bold text-2xl rounded-full m-1'>
              {`${index + 1}.- ${step}`}
            </div>
          ))}
        </div>
        <div className='flex justify-center items-center space-x-3'>
          <button className='mt-4 p-2 bg-blue-500 text-white rounded' onClick={() => setActualStep(0)}>
            Volver a configuracion
          </button>
          <button className='mt-4 p-2 bg-blue-500 text-white rounded' onClick={() => startDancePractice()}>
            Empezar de nuevo (nuevos pasos)
          </button>
        </div>
      </>
    )
  }

  const startDancePractice = () => {
    const danceSteps = generateDanceSteps()
    setDanceArry(danceSteps)
    setActualStep(1)
    setCounter(4)
    setBg('bg-yellow-200')
    setRealStepDuration(baseDuration / 8)
    setRealRepetitions(repetitions * danceStep * 8)
    setIsRunning(true);
    setTimeout(() => {
      setBg('bg-green-500')
      setCounter(0)
      setIsRunning(true);
    }, (baseDuration / 8)*4)
  }

  const main = () => {
    switch (actualStep) {
      case 0:
        return startConfiguration()
      case 1:
        return startDance()
      case 2:
        return showSteps()
      default:
        return startConfiguration()
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      {main()}
    </div>
  )
}

export default App