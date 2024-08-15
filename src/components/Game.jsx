import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Link, useParams } from 'react-router-dom';
import ResetButton from './ResetButton';
import Timer from './Timer';
import KaraageStatement from './KaraageStatement';
import GameCanvas from './Game/GameCanvas';
import GameControls from './Game/GameControls';
import StartModal from './Game/StartModal';
import GoalModal from './Game/GoalModal';
import { setupMatter } from '../utils/matterSetup';
import { setupEventListeners } from '../utils/eventHandlers';
import { INITIAL_PLAYER_POSITION } from '../constants/gameConfig';
import useRankings from '../hooks/useRankings';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const Game = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const playerRef = useRef(null);
  const resizeHandlerRef = useRef(null);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [clearTime, setClearTime] = useState(0);
  const [resetTimeStamp, setResetTimeStamp] = useState(Date.now());
  const [showStatement, setShowStatement] = useState(false);
  const [gameState, setGameState] = useState('initial');
  const [isInitialInteraction, setIsInitialInteraction] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [isRecordSubmitted, setIsRecordSubmitted] = useState(false);
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const { stageId } = useParams();
  const [bodyCreation, setBodyCreation] = useState(null);
  const [gameActive, setGameActive] = useState(false);

  const { rankings, loading, error, addRanking } = useRankings();

  useEffect(() => {
    const loadBodyCreation = async () => {
      try {
        const module = await import(`../utils/stage${stageId}BodyCreation.js`);
        setBodyCreation(() => module.default);
      } catch (error) {
        console.error('Failed to load body creation module:', error);
      }
    };

    loadBodyCreation();
    const loadTexture = () => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setIsTextureLoaded(true);
          resolve();
        };
        img.onerror = reject;
        img.src = '/img/karaage001.png';
      });
    };

    loadTexture().catch(console.error);

    audioRef.current = new Audio('/bgm/muzik01.mp3');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [stageId]);

  const playAudio = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [isMuted]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = useCallback((time) => {
    if (gameState === 'playing' && !goalAchieved) {
      setClearTime(time);
    }
  }, [gameState, goalAchieved]);

  const handleGoalAchieved = useCallback(() => {
    setGoalAchieved(true);
    setIsTimerRunning(false);
    setGameState('finished');
    setIsRecordSubmitted(false);
  }, []);

  const handleInitialInteraction = useCallback(() => {
    setIsInitialInteraction(false);
    setShowStatement(true);
    setGameState('ready');
    playAudio();
  }, [playAudio]);

  const handleStatementComplete = useCallback(() => {
    setShowStatement(false);
    setIsTimerRunning(true);
    setGameState('playing');
    setGameActive(true);
  }, []);

  useEffect(() => {
    console.log('gameActive:', gameActive);
  }, [gameActive]);

  const handleAddRanking = useCallback(() => {
    const timeInSeconds = Math.floor(clearTime / 1000);
    const name = playerName.trim() || 'guest';
    addRanking(name, parseInt(stageId), timeInSeconds);
    setPlayerName('');
    setIsRecordSubmitted(true);
  }, [clearTime, addRanking, playerName, stageId]);

  const handleReset = useCallback(() => {
    if (!engineRef.current || !playerRef.current) return;

    const { Body } = Matter;
    Body.setPosition(playerRef.current, INITIAL_PLAYER_POSITION);
    Body.setVelocity(playerRef.current, { x: 0, y: 0 });
    Body.setAngularVelocity(playerRef.current, 0);
    setGoalAchieved(false);
    setIsTimerRunning(false);
    setClearTime(0);
    setResetTimeStamp(Date.now());
    setShowStatement(true);
    setGameState('ready');
    setIsRecordSubmitted(false);
    playAudio();
  }, [playAudio]);

  useEffect(() => {
    if (!sceneRef.current || !isTextureLoaded || !bodyCreation) return;

    const { engine, render, world, handleResize } = setupMatter(sceneRef.current, GAME_WIDTH, GAME_HEIGHT);
    engineRef.current = engine;
    renderRef.current = render;
    resizeHandlerRef.current = handleResize;

    const bodies = bodyCreation(GAME_WIDTH, GAME_HEIGHT);
    playerRef.current = bodies.player;
    Matter.World.add(world, Object.values(bodies));

    const cleanupEvents = setupEventListeners(sceneRef.current, render, bodies.player, engine, handleGoalAchieved, gameActive);

    return () => {
      cleanupEvents();
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
      }
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
        renderRef.current.canvas = null;
        renderRef.current.context = null;
        renderRef.current.textures = {};
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [handleGoalAchieved, isTextureLoaded, bodyCreation, gameActive]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative w-[800px] h-[600px] overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url("/img/karaage_bg.jpg")'}}>
        <GameCanvas sceneRef={sceneRef} />
        <Timer
          isRunning={isTimerRunning}
          onTimeUpdate={handleTimeUpdate}
          resetTimeStamp={resetTimeStamp}
          className="absolute top-2 right-2 z-50"
        />
        <GameControls
          toggleMute={toggleMute}
          isMuted={isMuted}
          handleReset={handleReset}
        />
        {isInitialInteraction && (
          <StartModal onStart={handleInitialInteraction} />
        )}
        {showStatement && <KaraageStatement onComplete={handleStatementComplete} />}
        {goalAchieved && (
          <GoalModal
            clearTime={clearTime}
            playerName={playerName}
            setPlayerName={setPlayerName}
            isRecordSubmitted={isRecordSubmitted}
            handleAddRanking={handleAddRanking}
            handleReset={handleReset}
            formatTime={formatTime}
          />
        )}
      </div>
    </div>
  );
};

export default Game;