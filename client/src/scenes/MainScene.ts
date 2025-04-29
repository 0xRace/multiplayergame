import { Scene } from 'phaser';

export class MainScene extends Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    // This will be populated with game objects in future steps
    this.add.text(16, 16, 'Game Canvas Ready', { 
      color: '#ffffff',
      fontSize: '24px'
    });
  }
} 