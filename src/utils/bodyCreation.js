import Matter from 'matter-js';
import {
  INITIAL_PLAYER_POSITION,
  PLAYER_FRICTION,
  PLAYER_FRICTION_AIR,
  PLAYER_FRICTION_STATIC,
  PLAYER_RESTITUTION,
  PLAYER_DENSITY,
  PLATFORM_FRICTION,
  PLATFORM_RESTITUTION
} from '../constants/gameConfig';

export const createBodies = () => {
  const player = Matter.Bodies.circle(INITIAL_PLAYER_POSITION.x, INITIAL_PLAYER_POSITION.y, 20, { 
    restitution: PLAYER_RESTITUTION,
    friction: PLAYER_FRICTION,
    frictionAir: PLAYER_FRICTION_AIR,
    frictionStatic: PLAYER_FRICTION_STATIC,
    density: PLAYER_DENSITY,
    render: { fillStyle: '#e74c3c' },
    label: 'player'
  });

  const ground = Matter.Bodies.rectangle(400, 590, 810, 60, { 
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#2ecc71' }
  });

  const platform1 = Matter.Bodies.rectangle(200, 400, 200, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#3498db' }
  });

  const platform2 = Matter.Bodies.rectangle(600, 300, 200, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#3498db' }
  });

  const platform3 = Matter.Bodies.rectangle(400, 200, 200, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#3498db' }
  });

  // ゴールオブジェクトを追加
  const goal = Matter.Bodies.rectangle(700, 550, 100, 20, {
    isStatic: true,
    isSensor: true, // 物理的な衝突を無効にし、センサーとして機能させる
    render: { fillStyle: '#f1c40f' },
    label: 'goal'
  });

  return { player, ground, platform1, platform2, platform3, goal };
};