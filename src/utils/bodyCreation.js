import Matter from 'matter-js';
import { INITIAL_PLAYER_POSITION } from '../constants/gameConfig';

export const createBodies = () => {
  const player = Matter.Bodies.circle(INITIAL_PLAYER_POSITION.x, INITIAL_PLAYER_POSITION.y, 20, { 
    restitution: 0.5,
    render: { fillStyle: '#e74c3c' },
    label: 'player'
  });

  const ground = Matter.Bodies.rectangle(400, 590, 810, 60, { 
    isStatic: true,
    render: { fillStyle: '#2ecc71' }
  });

  const platform1 = Matter.Bodies.rectangle(200, 400, 200, 20, {
    isStatic: true,
    render: { fillStyle: '#3498db' }
  });

  const platform2 = Matter.Bodies.rectangle(600, 300, 200, 20, {
    isStatic: true,
    render: { fillStyle: '#3498db' }
  });

  const platform3 = Matter.Bodies.rectangle(400, 200, 200, 20, {
    isStatic: true,
    render: { fillStyle: '#3498db' }
  });

  return { player, ground, platform1, platform2, platform3 };
};