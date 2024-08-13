import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!sceneRef.current) return;

    const { engine, render, world } = setupMatter(sceneRef.current);
    engineRef.current = engine;
    renderRef.current = render;

    const bodies = createBodies();
    Matter.World.add(world, Object.values(bodies));

    const cleanupEvents = setupEventListeners(sceneRef.current, render, bodies.player);

    return () => {
      cleanupEvents();
      Matter.Render.stop(render);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  const handleReset = () => {
    if (!engineRef.current) return;

    const { Body } = Matter;
    const player = engineRef.current.world.bodies.find(body => body.label === 'player');
    if (player) {
      Body.setPosition(player, INITIAL_PLAYER_POSITION);
      Body.setVelocity(player, { x: 0, y: 0 });
      Body.setAngularVelocity(player, 0);
    }
  };

  return (
    <div>
      <div ref={sceneRef} style={{ width: '100vw', height: '100vh' }} />
      <ResetButton onClick={handleReset} />
    </div>
  );
};

export default Game;