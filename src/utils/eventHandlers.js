import Matter from 'matter-js';
import { JUMP_FORCE } from '../constants/gameConfig';

export const setupEventListeners = (element, render, player) => {
  let jumpAngle = 0;

  const handleMouseMove = (event) => {
    if (render.canvas) {
      const rect = render.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      jumpAngle = Math.atan2(y - player.position.y, x - player.position.x);
    }
  };

  const handleClick = () => {
    const force = Matter.Vector.create(
      Math.cos(jumpAngle) * JUMP_FORCE,
      Math.sin(jumpAngle) * JUMP_FORCE
    );
    Matter.Body.applyForce(player, player.position, force);
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('click', handleClick);

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
      ctx.fillText(`Angle: ${Math.round(jumpAngle * 180 / Math.PI)}°`, 10, 25);
    }
  });

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('click', handleClick);
  };
};