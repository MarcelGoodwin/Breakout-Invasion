var main = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function main ()
    {
        Phaser.Scene.call(this, { key: 'main' });
        this.bricks;
        this.paddle;
        this.ball;
        this.counterText;
        this.counter;
        this.HI;
        this.HIText;
    },

    preload: function ()
    {
        this.load.image('red', "../images/red1.png");
        this.load.image('green', "../images/green1.png");
        this.load.image('enemy', "../images/spaceboi.png");
        this.load.image('paddle', "../images/shell.png");
        this.load.image('ball', "../images/ball.png");
        this.cameras.main.backgroundColor.setTo(70,63,140);﻿
        this.counter = 0;
        this.HI = 0;
    },

    create: function ()
    {
        //Text
        this.counterText = this.add.text(32, 568, 'SCORE: 0', { fontSize: '32px', fill: '#000' });
        this.HIText = this.add.text(250, 568, 'HI: 0', { fontSize: '32px', fill: '#000' });

        //Player
        this.ball = this.physics.add.image(400, 500, 'ball').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);
        this.paddle = this.physics.add.image(400, 550, 'paddle').setImmovable();

        //Enemies
        this.bricks = this.physics.add.staticGroup({
            key: 'enemy',
            frame: ['', '', '', '', '', ''],
            frameQuantity: 10,
            gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 50, x: 112, y: 100 }
        });

        //Collision
        this.physics.world.setBoundsCollision(true, true, true, false);
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        //User Input
        this.input.on('pointermove', function (pointer) {
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);
            if (this.ball.getData('onPaddle'))
            {
                this.ball.x = this.paddle.x;
            }
        }, this);
        this.input.on('pointerup', function (pointer) {
            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }
        }, this);
    },

    hitBrick: function (ball, brick)
    {
        brick.disableBody(true, true);
        this.counter++;
        if (this.bricks.countActive() === 0)
        {
            this.resetLevel();
        }
        this.counterText.setText(`SCORE: ${this.counter}`);
    },

    resetBall: function ()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, 500);
        this.ball.setData('onPaddle', true);
    },

    resetLevel: function ()
    {
        if (this.counter > this.HI) {
          this.HI = this.counter;
        }
        this.counter = 0;
        this.counterText.setText(`SCORE: ${this.counter}`);
        this.HIText.setText(`HI: ${this.HI}`);
        this.resetBall();
        this.bricks.children.each(function (brick) {
            brick.enableBody(false, 0, 0, true, true);
        });
    },

    hitPaddle: function (ball, paddle)
    {
        var diff = 0;
        if (ball.x < paddle.x)
        {
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            diff = ball.x -paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            ball.setVelocityX(2 + Math.random() * 8);
        }
    },

    update: function ()
    {
        if (this.ball.y > 600)
        {
            this.resetLevel();
        }
    }
});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ main ],
    physics: {
        default: 'arcade'
    }
};

var game = new Phaser.Game(config);
