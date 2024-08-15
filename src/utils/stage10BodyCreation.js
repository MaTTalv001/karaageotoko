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

const createWindmill = (x, y, width, height) => {
  const center = Matter.Bodies.circle(x, y, 10, { isStatic: true });
  const blade = Matter.Bodies.rectangle(x, y - height/2, width, height, {
    collisionFilter: { group: Matter.Body.nextGroup(true) },
    render: { fillStyle: '#F3A712' }
  });

  const constraint = Matter.Constraint.create({
    bodyA: center,
    bodyB: blade,
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: height/2 },
    stiffness: 1,
    length: 0
  });

  return Matter.Composite.create({
    bodies: [center, blade],
    constraints: [constraint],
    label: 'windmill'
  });
};


const createBodies = (width, height) => {
  const player = Matter.Bodies.circle(100, height - 50, 20, { 
    restitution: 0.99,
    friction: 0.0001,
    frictionAir: 0.01,
    frictionStatic: 0.0001,
    density: 0.001,
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

  const platform6 = Matter.Bodies.rectangle(width / 3.7, height * 0.53, width / 6, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform7 = Matter.Bodies.rectangle(width / 4.85, height * 0.45, width / 25, 100, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });


  const goal = Matter.Bodies.rectangle(width / 3.8, height * 0.45, 80, 50, {
    isStatic: true,
    isSensor: true,
    render: {
      sprite: {
        texture: '/img/oil.png',
        xScale: 0.3,  // テクスチャのスケールを調整
        yScale: 0.3
      }
    },
    label: 'goal'
  });

  const bouncingBall = Matter.Bodies.circle(width / 3, height / 2, 30, {
    restitution: 1,
    friction: 0.001,
    frictionAir: 0.001,
    render: { fillStyle: 'orange' },
    label: 'bouncingBall'
  });

  const movingPlatform = Matter.Bodies.rectangle(width / 2, height * 0.9, 200, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: '#060a19' },
    label: 'movingPlatform'
  });

  const windmill = createWindmill(3 * width / 16, 1000, 20, 100);

  return { player, ground, platform1, platform2, platform3, platform4, platform5, platform6,platform7, goal,
    movingPlatform ,windmill};
};

export default createBodies;