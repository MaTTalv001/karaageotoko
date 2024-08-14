export const INITIAL_PLAYER_POSITION = { x: 100, y: 480 };
export const JUMP_FORCE = 0.03;
export const VELOCITY_THRESHOLD = 0.1; // この値以下の速度でのみジャンプ可能

// 物理パラメータ
export const WORLD_GRAVITY = 0.5; // 重力 (デフォルトは 0.001)
export const PLAYER_FRICTION = 0.0001; // プレイヤーの摩擦
export const PLAYER_FRICTION_AIR = 0.01; // プレイヤーの空気抵抗
export const PLAYER_FRICTION_STATIC = 0.01; // プレイヤーの静止摩擦
export const PLAYER_RESTITUTION = 0.8; // プレイヤーの弾性（はねかえり）
export const PLAYER_DENSITY = 0.001; // プレイヤーの密度
export const PLATFORM_FRICTION = 0.02; // プラットフォームの摩擦
export const PLATFORM_RESTITUTION = 0.01; // プラットフォームの弾性


