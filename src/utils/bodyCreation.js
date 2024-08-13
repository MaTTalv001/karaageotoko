import Matter from 'matter-js';
import {
  PLAYER_FRICTION,
  PLAYER_FRICTION_AIR,
  PLAYER_FRICTION_STATIC,
  PLAYER_RESTITUTION,
  PLAYER_DENSITY,
  PLATFORM_FRICTION,
  PLATFORM_RESTITUTION
} from '../constants/gameConfig';

export const createBodies = (width, height) => {
  const player = Matter.Bodies.circle(width / 2, height - 50, 20, { 
    restitution: PLAYER_RESTITUTION,
    friction: PLAYER_FRICTION,
    frictionAir: PLAYER_FRICTION_AIR,
    frictionStatic: PLAYER_FRICTION_STATIC,
    density: PLAYER_DENSITY,
    render: { fillStyle: '#e74c3c' },
    label: 'player'
  });

  const ground = Matter.Bodies.rectangle(width / 2, height - 10, width, 20, { 
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#2ecc71' }
  });

  const platform1 = Matter.Bodies.rectangle(width / 4, height * 0.7, width / 4, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#3498db' }
  });

  const platform2 = Matter.Bodies.rectangle(width * 0.75, height * 0.5, width / 4, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#3498db' }
  });

  const platform3 = Matter.Bodies.rectangle(width / 2, height * 0.3, width / 4, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#3498db' }
  });

  const goal = Matter.Bodies.rectangle(width - 50, height * 0.9, 100, 20, {
    isStatic: true,
    isSensor: true,
    render: { fillStyle: '#f1c40f' },
    label: 'goal'
  });

  const bouncingBall = Matter.Bodies.circle(width / 3, height / 2, 30, {
    restitution: 1,
    friction: 0.001,
    frictionAir: 0.001,
    render: { fillStyle: '#9b59b6' },
    label: 'bouncingBall'
  });

  return { player, ground, platform1, platform2, platform3, goal, bouncingBall };
};