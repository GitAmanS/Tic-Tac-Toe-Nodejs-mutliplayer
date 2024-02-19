import { useEffect, useState } from 'react'
import './App.css'

import Square from './square/square'
function App() {
  const gridArray =  [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
  const [gameState, setGameState] = useState(gridArray)
  const [currentPlayer, setCurrentPlayer] = useState('circle')
  const [finishState, setFinishState] = useState(false)
  const [finishedArrayState, setFinishedArrayState] = useState([])
  const [playOnline, setPlayOnline] = useState(false)
  const checkWinner = ()=>{
      // Check rows
      for (let i = 0; i < 3; i++) {
          if (gameState[i][0] === gameState[i][1] && gameState[i][1] === gameState[i][2] && gameState[i][0] !== '') {
              setFinishedArrayState([i*3+0,i*3+1, i*3+2])
              return gameState[i][0];
          }
      }
  
      // Check columns
      for (let i = 0; i < 3; i++) {
          if (gameState[0][i] === gameState[1][i] && gameState[1][i] === gameState[2][i] && gameState[0][i] !== '') {
            setFinishedArrayState([0*3+i,1*3+i, 2*3+i])
              return gameState[0][i];
          }
      }
  
      // Check diagonals
      if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2] && gameState[0][0] !== '') {
        setFinishedArrayState([0, 4, 8]);
          return gameState[0][0];
      }
      if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0] && gameState[0][2] !== '') {
        setFinishedArrayState([2, 4, 6]);
          return gameState[0][2];
      }
  
      // If no winner found
      return '';
  }

  // Function to check if the board is full
  function isBoardFull() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameState[i][j] === '') {
                return null;
            }
        }
    }
    return "draw";
  }
  useEffect(()=>{
    const winner = checkWinner()

    if(winner ==='circle' || winner ==='cross'){
      setFinishState(winner)
      console.log(finishState)
    }

    let draw = isBoardFull();
    if(draw){
      setFinishState(draw)
    }


  }, [gameState])

  if(!playOnline){
    return <div className='mainDiv'>
      <button className='playOnline'>Play Online</button>
    </div>
  }
  return (
    <>
      <div className='mainDiv'>
      <div className='move-detection'>
            <div className='left'>Your Self</div>
            <div className='right'>Opponent</div>
          </div>
        <div>
          <h1 className='game-heading water-background'>Tic-Tac-Toe</h1>
          <div className='square-wrapper'>
            {gameState.map((arr, rowindex)=>{
              return arr.map((e, colindex)=>{
                return <Square
                finishedArrayState = {finishedArrayState}
                finishState ={finishState}
                setFinishState={setFinishState}
                currentPlayer={currentPlayer}
                setCurrentPlayer ={setCurrentPlayer}
                setGameState={setGameState}
                 id={rowindex * 3+ colindex} key={rowindex * 3+ colindex}/>
              })
            })}
          </div>
          {finishState && finishState!=='draw' && <h3 className='finish-state'>{finishState} won the game</h3>}
          {finishState && finishState==='draw' && <h3 className='finish-state'>It's a draw</h3>}
        </div>

      </div>
    </>
  )
}

export default App
