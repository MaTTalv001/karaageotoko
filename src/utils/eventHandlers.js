import Matter from 'matter-js';
import { JUMP_FORCE, VELOCITY_THRESHOLD } from '../constants/gameConfig';

export const setupEventListeners = (element, render, player, engine, setGoalAchieved,gameActive) => {
  let jumpAngle = 0;

  const handleMouseMove = (event) => {
    if (!gameActive) return;
    if (render.canvas) {
      const rect = render.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      jumpAngle = Math.atan2(y - player.position.y, x - player.position.x);
    }
  };

  const handleClick = () => {
    if (!gameActive) return;
    const velocity = Matter.Vector.magnitude(player.velocity);
    if (velocity < VELOCITY_THRESHOLD) {
      const force = Matter.Vector.create(
        Math.cos(jumpAngle) * JUMP_FORCE,
        Math.sin(jumpAngle) * JUMP_FORCE
      );
      Matter.Body.applyForce(player, player.position, force);
    } else {
      console.log("プレイヤーが動いているためジャンプできません");
    }
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('click', handleClick);

  // 衝突検出イベントを追加
  Matter.Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const { bodyA, bodyB } = pairs[i];
      if (
        (bodyA.label === 'player' && bodyB.label === 'goal') ||
        (bodyA.label === 'goal' && bodyB.label === 'player')
      ) {
        console.log('ゴール達成！');
        setGoalAchieved(true);
      }
    }
  });

  Matter.Events.on(render, 'afterRender', () => {
    if (render.context) {
      const ctx = render.context;
      ctx.save();
      ctx.translate(player.position.x, player.position.y);
      ctx.rotate(jumpAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(50, 0);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.font = '16px Arial';
      ctx.fillStyle = 'black';
      //ctx.fillText(`Angle: ${Math.round(jumpAngle * 180 / Math.PI)}°`, 10, 25);
      
      const velocity = Matter.Vector.magnitude(player.velocity);
      // ctx.fillText(`Velocity: ${velocity.toFixed(2)}`, 10, 50);
      // ctx.fillText(`Can Jump: ${velocity < VELOCITY_THRESHOLD ? 'Yes' : 'No'}`, 10, 75);
    }
  });

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('click', handleClick);
    Matter.Events.off(engine, 'collisionStart');
  };
};