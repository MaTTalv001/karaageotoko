import Matter from 'matter-js';
import {
  PLAYER_RESTITUTION,
  PLAYER_FRICTION,
  PLAYER_FRICTION_AIR,
  PLAYER_FRICTION_STATIC,
  PLAYER_DENSITY,
  PLATFORM_FRICTION,
  PLATFORM_RESTITUTION
} from '../constants/gameConfig';

const createBodies = (width, height) => {
  const player = Matter.Bodies.circle(100, height - 50, 20, { 
    restitution: PLAYER_RESTITUTION,
    friction: PLAYER_FRICTION,
    frictionAir: PLAYER_FRICTION_AIR,
    frictionStatic: PLAYER_FRICTION_STATIC,
    density: PLAYER_DENSITY,
    render: {
      sprite: {
        texture: '/img/karaage001.png',
        xScale: 0.5,  // テクスチャのスケールを調整
        yScale: 0.5
      }
    },
    label: 'player'
  });

  const ground = Matter.Bodies.rectangle(width / 2, height - 10, width, 20, { 
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'silver' }
  });

  const platform1 = Matter.Bodies.rectangle(width / 4, height * 0.85, width / 10, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform2 = Matter.Bodies.rectangle(width / 2.2, height * 0.75, width / 7, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform3 = Matter.Bodies.rectangle(width / 1.5, height * 0.6, width / 9, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform4 = Matter.Bodies.rectangle(width / 1.2, height * 0.5, width / 9, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform5 = Matter.Bodies.rectangle(width / 1.7, height * 0.4, width / 5, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const goal = Matter.Bodies.rectangle(width / 4, height * 0.45, 80, 50, {
    isStatic: true,
    isSensor: true,
    render: { fillStyle: 'black' },
    label: 'goal'
  });

  const bouncingBall = Matter.Bodies.circle(width / 3, height / 2, 30, {
    restitution: 1,
    friction: 0.001,
    frictionAir: 0.001,
    render: { fillStyle: 'orange' },
    label: 'bouncingBall'
  });

  return { player, ground, platform1, platform2, platform3, platform4, platform5, goal };
};

export default createBodies;