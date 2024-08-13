import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import ResetButton from './ResetButton';
import Timer from './Timer';
import { setupMatter } from '../utils/matterSetup';
import { createBodies } from '../utils/bodyCreation';
import { setupEventListeners } from '../utils/eventHandlers';
import { INITIAL_PLAYER_POSITION } from '../constants/gameConfig';

const Game = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const playerRef = useRef(null);
  const resizeHandlerRef = useRef(null);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [clearTime, setClearTime] = useState(0);
  const [resetTime, setResetTime] = useState(false);

  const handleTimeUpdate = useCallback((time) => {
    if (!goalAchieved) {
      setClearTime(time);
    }
  }, [goalAchieved]);

  const handleGoalAchieved = useCallback(() => {
    setGoalAchieved(true);
    setIsTimerRunning(false);
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { engine, render, world, handleResize } = setupMatter(sceneRef.current);
    engineRef.current = engine;
    renderRef.current = render;
    resizeHandlerRef.current = handleResize;

    const bodies = createBodies();
    playerRef.current = bodies.player;
    Matter.World.add(world, Object.values(bodies));

    const cleanupEvents = setupEventListeners(sceneRef.current, render, bodies.player, engine, handleGoalAchieved);

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
  }, [handleGoalAchieved]);

  const handleReset = () => {
    if (!engineRef.current || !playerRef.current) return;

    const { Body } = Matter;
    Body.setPosition(playerRef.current, INITIAL_PLAYER_POSITION);
    Body.setVelocity(playerRef.current, { x: 0, y: 0 });
    Body.setAngularVelocity(playerRef.current, 0);
    setGoalAchieved(false);
    setIsTimerRunning(true);
    setClearTime(0);
    setResetTime(prev => !prev); // タイマーをリセットするためのトリガー
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
  };

  return (
    <div>
      <div ref={sceneRef} style={{ width: '100vw', height: '100vh' }} />
      <Timer isRunning={isTimerRunning} onTimeUpdate={handleTimeUpdate} resetTime={resetTime} />
      <ResetButton onClick={handleReset} style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
      }} />
      {goalAchieved && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#f1c40f',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            marginBottom: '20px'
          }}>
            ゴール！
          </div>
          <div style={{
            fontSize: '24px',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            marginBottom: '20px'
          }}>
            クリアタイム: {formatTime(clearTime)}
          </div>
          <ResetButton onClick={handleReset} style={{
            fontSize: '20px',
            padding: '10px 20px'
          }} />
        </div>
      )}
    </div>
  );
};

export default Game;