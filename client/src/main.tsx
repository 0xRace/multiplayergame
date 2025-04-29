import { Game, AUTO } from 'phaser';
import { MainScene } from './scenes/MainScene';

const config = {
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  parent: 'game',
  scene: MainScene,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

// Create main game instance
const game = new Game(config);

// Handle window resizing
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
