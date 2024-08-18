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
    //Matter.World.add(world, Object.values(bodies));

    // 全てのボディをワールドに追加
    Object.values(bodies).forEach(body => {
      if (Array.isArray(body)) {
        Matter.World.add(world, body);
      } else if (body.type === 'composite') {
        Matter.World.add(world, body);
      } else {
        Matter.World.add(world, [body]);
      }
    });

    // 動く平台の動きを制御
    // 動く平台の動きを制御
    Matter.Events.on(engine, 'beforeUpdate', function() {
      const time = engine.timing.timestamp;
      
      // 動く平台の制御
      if (time > 1500) {
        const px = GAME_WIDTH / 2 + 100 * Math.sin((time - 1500) * 0.002);
        Matter.Body.setPosition(bodies.movingPlatform, {
          x: px,
          y: bodies.movingPlatform.position.y
        }, true);
      }

      // 風車の回転
      if (bodies.windmill && bodies.windmill.bodies) {
        Matter.Body.rotate(bodies.windmill.bodies[1], 0.05);
      }
    });

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

  const post = {
    title: "からあげ様は揚げられたい",
    url: "https://karaageotoko.vercel.app/",
  };

  const handleTweet = useCallback(() => {
    const tweetText = `【からあげ様は揚げられたい】ステージ${stageId}を${formatTime(clearTime)}でクリアしました！ #からあげ様 #RUNTEQ祭 @RckLVnPtRv61824`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      "https://karaageotoko.vercel.app/"
    )}&text=${encodeURIComponent(tweetText)}`;

    window.open(twitterUrl, "_blank");
  }, [stageId, clearTime]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-[832px]">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">からあげ様は揚げられたい</h1>
        <div className="relative w-[800px] h-[600px] overflow-hidden rounded-lg shadow-inner mx-auto" style={{backgroundImage: 'url("/img/karaage_bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <GameCanvas sceneRef={sceneRef} width={GAME_WIDTH} height={GAME_HEIGHT} />
          <Timer
            isRunning={isTimerRunning}
            onTimeUpdate={handleTimeUpdate}
            resetTimeStamp={resetTimeStamp}
            className="absolute top-2 right-2 z-50 bg-white bg-opacity-70 rounded p-2"
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
              handleTweet={handleTweet}
            />
          )}
        </div>
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            ステージ選択に戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Game;