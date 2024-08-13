import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import ResetButton from './ResetButton';
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

  useEffect(() => {
    if (!sceneRef.current) return;

    const { engine, render, world, handleResize } = setupMatter(sceneRef.current);
    engineRef.current = engine;
    renderRef.current = render;
    resizeHandlerRef.current = handleResize;

    const bodies = createBodies();
    playerRef.current = bodies.player;
    Matter.World.add(world, Object.values(bodies));

    const cleanupEvents = setupEventListeners(sceneRef.current, render, bodies.player, engine, setGoalAchieved);

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
  }, []);

  const handleReset = () => {
    if (!engineRef.current || !playerRef.current) return;

    const { Body } = Matter;
    Body.setPosition(playerRef.current, INITIAL_PLAYER_POSITION);
    Body.setVelocity(playerRef.current, { x: 0, y: 0 });
    Body.setAngularVelocity(playerRef.current, 0);
    setGoalAchieved(false);
  };

  return (
    <div>
      <div ref={sceneRef} style={{ width: '100vw', height: '100vh' }} />
      <ResetButton onClick={handleReset} />
      {goalAchieved && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#f1c40f',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          ゴール！
        </div>
      )}
    </div>
  );
};

export default Game;