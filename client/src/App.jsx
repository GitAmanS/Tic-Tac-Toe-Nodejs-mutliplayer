import { useEffect, useState } from 'react'
import './App.css'
import {io} from 'socket.io-client'
import Square from './square/square'
import Swal from 'sweetalert2'
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
  const [socket, setSocket] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [oppoentName, setOpponentName] = useState(null)
  const [playingAs, setPlayingAs] = useState(null)
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


    socket?.on("connect", function(){
      setPlayOnline(true)
    })
    socket?.on("OpponentNotFound", function(){
      setOpponentName(false)
    })
    socket?.on("OpponentFound", function(data){
      setPlayingAs(data.playingAs);
      setOpponentName(data.opponentName)
    })

    
  const takePlayerName = async ()=>{
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });

    return result;
  }
  const playOnlineClick = async()=>{
    const result = await takePlayerName()

    if(!result.isConfirmed){
      return
    }

    const userName = result.value;
    setPlayerName(userName)
    const newSocktet = io("http://localhost:3000",{
      autoConnect:true,
    })
    newSocktet?.emit("request_to_play",{
      playerName: userName,
    })
    setSocket(newSocktet)
  }

  if(!playOnline){
    return <div className='mainDiv'>
      <button className='playOnline' onClick={playOnlineClick}>Play Online</button>
    </div>
  }

  if(playOnline && !oppoentName){
    return <div className='waiting'>
      <p>...Waiting for an opponent</p>
    </div>
  }

  return (
    <>
      <div className='mainDiv'>
      <div className='move-detection'>
            <div className={`left ${currentPlayer === playingAs ? 'current-move-'+currentPlayer:''}`}>{playerName}</div>
            <div className={`right ${currentPlayer === playingAs ? 'current-move-'+currentPlayer:''}`}>{oppoentName}</div>
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
