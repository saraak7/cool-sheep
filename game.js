// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 65;

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(150 , 480, 'apple'); //first apple
  createItem(350, 450, 'ax'); //middle ax
  createItem(120 , 235, 'apple'); //2nd apple
  createItem(460, 188, 'apple'); //3rd apple
//platforms.scale.setTo(0.70 , 0.70 );



  createItem(680, 390, 'ax'); //bottom corner 
  createItem(620 , 320, 'leaf');
  createItem(620 , 200, 'leaf');
  createItem(520, 470, 'leaf');// leaf between 2 ax
   
  createItem(125 , 60, 'leaf');// top left
  createItem(230, 130, 'leaf');
  createItem(340, 80, 'leaf'); 
  createItem(450, 50, 'leaf');
  createItem(420, 362, 'apple');
  createItem(680, -15, 'ax');
  createItem(600, 40, 'apple');
}

// add platforms to the game
// (low(L), high(R )   low(up) , high(down) )
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(90, 720, 'platform1');
  platforms.create(400, 550 , 'platform3'); 
  platforms.create(845, 690 , 'platform3');
  platforms.create(115 , 370 ,  'platform1');
//  platforms.create(460, 110, 'platform3');
  platforms.create(585 , 300 , 'platform1');
  platforms.create(820, 98 , 'platform3');
  platforms.create(500, 780 , 'platform1');
  platforms.scale.setTo(0.70 , 0.70 );
  platforms.setAll('body.immovable', true);
}



// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup(); 
  var badge = badges.create(600, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  if (item.key === 'leaf') {
     currentScore = currentScore + 10;
  } 
  if (item.key === 'apple') {
     currentScore = currentScore + 5;
  }
  if (item.key === 'ax') {
     currentScore = currentScore - 10;
  }
    if (currentScore === winningScore) {
      createBadge();
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#666699';
    
    //Load images
    game.load.image('platform1', 'platform-1.png');
//    game.load.image('platform2', 'platform-2.png');
    game.load.image('platform3', 'plat2.png');
    
    //Load spritesheets
    game.load.spritesheet('player', 'sheep1.png', 80, 64);
//    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('leaf', 'leaf.png',32, 32);
    game.load.spritesheet('ax', 'ax.png', 121, 111);
    game.load.spritesheet('apple', 'apple.png', 32, 32);
     game.load.spritesheet('badge', 'star.png', 32, 32);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 500, 'player');
    player.animations.add('walk');
    player.anchor.setTo(1, 2);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
  }

  function render() {

  }

};
