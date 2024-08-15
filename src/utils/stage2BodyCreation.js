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

  const ground = Matter.Bodies.rectangle(width / 5, height - 10, width/2, 20, { 
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'silver' }
  });

  const platform1 = Matter.Bodies.rectangle(width / 3.5, height * 0.85, width / 6, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform2 = Matter.Bodies.rectangle(width / 1.8, height * 0.75, width / 5, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform3 = Matter.Bodies.rectangle(width / 1, height * 0.65, width / 2, 20, {
    isStatic: true,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform4 = Matter.Bodies.rectangle(width / 1.2, height * 0.4, width / 9, 20, {
    isStatic: true,
    angle:15,
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const platform5 = Matter.Bodies.rectangle(width / 0.99, height * 0.58, width / 10, 100, {
    isStatic: true,
    
    friction: PLATFORM_FRICTION,
    restitution: PLATFORM_RESTITUTION,
    render: { fillStyle: 'white' }
  });

  const goal = Matter.Bodies.rectangle(width / 1.1, height * 0.59, 80, 50, {
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

  //鎖
  // 鎖状のオブジェクトを作成
  const group = Matter.Body.nextGroup(true);
  
  const chainA = Matter.Composites.stack(width / 1.7, 30, 3, 1, 10, 10, function(x, y) {
    return Matter.Bodies.rectangle(x, y, 50, 20, { 
      collisionFilter: { group: group },
      render: { fillStyle: '#F3A712' }
    });
  });
  
  Matter.Composites.chain(chainA, 0.5, 0, -0.5, 0, { 
    stiffness: 0.8, 
    length: 1, 
    render: { type: 'line', strokeStyle: '#E16036' } 
  });
  
  Matter.Composite.add(chainA, Matter.Constraint.create({ 
    bodyB: chainA.bodies[0],
    pointB: { x: -25, y: 0 },
    pointA: { x: width / 1.4, y: 50 },
    stiffness: 0.5
  }));

  // const bouncingBall = Matter.Bodies.circle(width / 2, 0, 30, {
  //   restitution: 1,
  //   friction: 0.001,
  //   frictionAir: 0.001,
  //   render: { fillStyle: 'orange' },
  //   label: 'bouncingBall'
  // });

  return { player, ground, platform1, platform2, platform3, platform4, platform5, goal, chainA  };
};

export default createBodies;