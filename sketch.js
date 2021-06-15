var PLAY = 1;
var END = 0;
var gameState = PLAY;

var obj;
var img;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  // trex_running = loadAnimation("trex1.png","trex3.png","trex4.png")
  trex_running = loadAnimation("dinosaur1.png","dinosaur9.png","dinosaur8.png","dinosaur7.png","dinosaur6.png","dinosaur5.png","dinosaur4.png","dinosaur3.png","dinosaur2.png","dinosaur10.png");
  trex_collided = loadAnimation("dinosaur_collided.png");
  
  img = loadImage("realimage2.png");

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("cactus1.png");
  obstacle2 = loadImage("cactus2.png");
  obstacle3 = loadImage("cactus3.png");
  obstacle4 = loadImage("cactus4.png");
  obstacle5 = loadImage("cactus5.png");
  obstacle6 = loadImage("cactus6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);

  obj = createSprite(320,100,150, 50);
  obj.addImage("obj",img);
  obj.scale=0.8;
 // obj.x=obj.width/2.5;
 // obj.velocityX=-4;
  obj.velocityX = -(6 + 3*score/100);
   
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1;
  trex.width=trex.width-1
    
  //trex.setCollider("circle",0,0,40)
  //trex.debug = true

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
    
}

function draw() {
  
//  background("pink");
  if (gameState === PLAY){

      obj.velocityX = -(6 + 3*score/100);

      score = score + Math.round(getFrameRate()/60);
    
      if(keyDown("space") && trex.y >= 159) {
        trex.velocityY = -12;
      }
    
      trex.velocityY = trex.velocityY + 0.7;
      
    if (obj.x-50 < 0){
      obj.x = obj.width/2.5;  
    }
    
      trex.collide(invisibleGround);
      spawnClouds();
      spawnObstacles();

      if(obstaclesGroup.isTouching(trex)){
          gameState = END;
    }
  }
  else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
      //set velcity of each game object to 0
      trex.velocityY = 0;
      obj.velocityX=0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      
      //change the trex animation
      trex.changeAnimation("collided",trex_collided);
      
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      
      if(mousePressedOver(restart)) {  // keyCode === 82 || keyDown("space")
        reset();
      }
  }
  
  drawSprites();
  text("Score: "+ score, 500,50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,155,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
      obstacle.scale=0.2;
              break;
      case 2: obstacle.addImage(obstacle2);
      obstacle.scale=0.05;
              break;
      case 3: obstacle.addImage(obstacle3);
      obstacle.scale=0.06;
              break;
      case 4: obstacle.addImage(obstacle4);
      obstacle.scale=0.07;
              break;
      case 5: obstacle.addImage(obstacle5);
      obstacle.scale=0.3;
              break;
      case 6: obstacle.addImage(obstacle6);
      obstacle.scale=0.06;
              break;
      default: break; 
    }
    
  //assign scale and lifetime to the obstacle           
    //obstacle.scale = 0.5;
    obstacle.lifetime = 300;

  //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}