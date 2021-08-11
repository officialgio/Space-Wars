// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
 *    HSB, background, color, collideRectRect, colorMode, createCanvas, fill, frameRate, keyCode, height,
 *    loop, textSize, noFill, noLoop, noStroke, random, rect, round, stroke, sqrt, text, width
 *    ctx, SPACE, frameCount, loadImage, key, collideRectCircle, particles, image, anime, circle, dist, square, gameOver, line, disable, ENTER, textColor, clear, UP_ARROW, DOWN_ARROW, LEFT_ARROW, math, RIGHT_ARROW, windowWidth, ellipse, windowHeight, const, canvas
 */

let mode,
  backgroundColor,
  score,
  n,
  check,
  time,
  gameIsOver,
  player2,
  lives,
  car1X,
  car1Y,
  car1V,
  car1W,
  car1H,
  b,
  bullets,
  nBullets,
  nFrame;

let hit = false;

let planeImage, virusImage, bulletImage;

function setup() {
  mode = 0 + displayText() + displayText2() + displayText3(); // game has not started && displays intro text

  textSize(21); // text size for startup code

  createCanvas(windowWidth, windowHeight);

  //images that were used.
  planeImage = loadImage(
    "https://cdn.glitch.com/a3d6b8eb-5097-4db3-a52a-9e5dbe9bc078%2FImage%20a.png?v=1627971235658"
  );
  virusImage = loadImage(
    "https://cdn.glitch.com/ecdc56b9-567e-486c-88a6-23afff32c206%2Fcoronavirus-5058252_960_720.png?v=1628176702154"
  );
  bulletImage = loadImage(
    "https://cdn.glitch.com/ecdc56b9-567e-486c-88a6-23afff32c206%2Fpngtree-dark-gold-bullet-decoration-illustration-image_1290993-removebg-preview.png?v=1628181058998"
  );

  colorMode(HSB, 360, 100, 100);
  backgroundColor = 0;
  nFrame = frameCount;

  player1 = new player1(); //player1
  rect1 = new rect1(); //line
  bullets = []; //bullets array
  nBullets = 10; //number of bullets

  //array and for loop for player2(opponent)
  player2 = [];
  n = 3; // number of opponents
  for (let k = 0; k < n; k++) player2.push(new Player2());

  score = 0;
  lives = 10;
  time = 1000;
  gameIsOver = false;

  //car
  car1X = player1.x;
  car1Y = player1.y;
  car1V = -2;
  car1W = 40;
  car1H = 30;

  //Prevents scrolling down bug
  window.addEventListener(
    "keydown",
    function(e) {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
          e.code
        ) > -1
      ) {
        e.preventDefault();
      }
    },
    false
  );

  particles = []; //array for particles (background)

  //particle for loop (background)
  for (let i = 0; i < width / 10; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  clear(); // clears the page at the startup && adds text
  background(backgroundColor);

  if (mode === 0) {
    // text('Press ENTER to start', width/2.3, height/2)
  }

  if (mode == 1) {
    //add everything that goes to the draw function below.

    background("#0f0f0f");
    for (let i = 0; i < particles.length; i++) {
      particles[i].createParticle();
      particles[i].moveParticle();
      particles[i].joinParticles(particles.slice(i));
    }
    //stops displaying beggining text
    stop(displayText());
    stop(displayText2());
    stop(displayText3());

    //player1
    image(planeImage, player1.x, player1.y, 150, 80); //image for player1 (adjust size)
    player1.move();

    rect1.show();
    for (let k = 0; k < bullets.length; k++) {
      //bullets[k].show();
      image(bulletImage, bullets[k].x, bullets[k].y, 20, 30);
      bullets[k].move();
    }

    //player2
    for (let k = 0; k < n; k++) {
      //player2[k].show();
      image(virusImage, player2[k].x, player2[k].y, 30, 30);
      player2[k].move();
    }

    // Check collision: delete a bullet, restart the position of the falling object
    check = true;
    // let size = bullets.length
    for (let k = 0; k < bullets.length && check == true; k++) {
      for (let j = 0; j < player2.length; j++) {
        hit = collideRectCircle(
          bullets[k].x,
          bullets[k].y,
          bullets[k].size,
          bullets[k].size,
          player2[j].x,
          player2[j].y,
          player2[j].size
        );

        if (hit) {
          bullets.splice(k, 1);
          score++;
          player2[j].x = random(width);
          player2[j].y = 0;
          check = false;
          break;
          // size--
        }
      }
    }

    // delete bullets which pass the upper edge -- y = 0
    for (let k = 0; k < bullets.length; k++) {
      if (bullets[k].y < 0) {
        bullets.splice(k, 1);
      }
    }

    displayScore();
    displayTime();
    displayLives();
    handleTime();
    keyPressed();
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    mode = 1; // level 1 started
  }
  //Movement for the player
  if (keyCode === LEFT_ARROW) {
    player1.x -= 8;
  } else if (keyCode === RIGHT_ARROW) {
    player1.x += 8;
  } else if (keyCode === UP_ARROW) {
    player1.y -= 5;
  } else if (keyCode === DOWN_ARROW) {
    player1.y += 5;
  }
  if (key === "w") {
    //shooting bullet with key "w"
    if (bullets.length == 0) {
      bullets.push(new bullet(player1.x, player1.y));
      nFrame = frameCount;
    } else if (bullets.length < nBullets && frameCount > nFrame + 50) {
      bullets.push(new bullet(player1.x, player1.y));
      nFrame = frameCount;
    }
  }
}

function displayText() {
  //search this up for understanding
  //fixed positioning for HTML
  //animation for ENTER Text
  anime
    .timeline({ loop: true })
    .add({
      targets: ".word",
      scale: [5, 1],
      opacity: [0, 1],
      easing: "easeOutCirc",
      duration: 800,
      delay: 2000
    })
    .add({
      targets: ".ml15",
      opacity: 0,
      duration: 5000,
      easing: "easeOutExpo",
      delay: 2000
    });
}
function displayText2() {
  //animation for 2nd text
  var textWrapper = document.querySelector(".ml11 .letters");
  textWrapper.innerHTML = textWrapper.textContent.replace(
    /([^\x00-\x80]|\w)/g,
    "<span class='letter'>$&</span>"
  );

  anime
    .timeline({ loop: true })
    .add({
      targets: ".ml11 .line",
      scaleY: [0, 1],
      opacity: [0.5, 1],
      easing: "easeOutExpo",
      duration: 950
    })
    .add({
      targets: ".ml11 .line",
      translateX: [
        0,
        document.querySelector(".ml11 .letters").getBoundingClientRect().width +
          10
      ],
      easing: "easeOutExpo",
      duration: 700,
      delay: 100
    })
    .add({
      targets: ".ml11 .letter",
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 5000,
      offset: "-=775",
      delay: (el, i) => 34 * (i + 1)
    })
    .add({
      targets: ".ml11",
      opacity: 0,
      duration: 2000,
      easing: "easeOutExpo",
      delay: 1000
    });
}

function displayText3() {
  // animaiton for the 3rd text
  var textWrapper = document.querySelector(".ml3");
  textWrapper.innerHTML = textWrapper.textContent.replace(
    /\S/g,
    "<span class='letter'>$&</span>"
  );

  anime
    .timeline({ loop: true })
    .add({
      targets: ".ml3 .letter",
      opacity: [0, 1],
      easing: "easeInOutQuad",
      duration: 5000,
      delay: (el, i) => 100 * (i + 1)
    })
    .add({
      targets: ".ml3",
      opacity: 0,
      duration: 3000,
      easing: "easeOutExpo",
      delay: 500
    });
}

function displayScore() {
  //shows score
  fill("white");
  textSize(10);
  text(`Score: ${score}`, 20, 20);
}

function displayLives() {
  //shows lives == 10
  textSize(10);
  fill("white");
  // Display Lives
  text(`lives: ${lives}`, 20, 60);
}
function displayTime() {
  //shows time == 1000
  fill("white");
  textSize(10);
  text(`Time remaining: ${time}`, 20, 40);
}

function handleTime() {
  // We'll write code to handle the time.
  if (time > 0) time -= 1;
  else {
    gameIsOver = true;
  }

  if (lives == 0) gameIsOver = true;

  if (gameIsOver) {
    // if (gameIsOver == true)
    // fill("red")
    fill("white");
    textSize(100);
    text("Game Over!", width / 3, height / 2);
  }
}

class player1 {
  constructor() {
    this.x = windowWidth / 2;
    this.y = windowHeight - 50;
    this.size = 30;
    this.color = color("blue");
    this.speed = 2;
  }

  show() {
    noStroke();
    fill("blue");
    image(planeImage, this.x, this.y);
  }

  move() {
    if (this.y < height / 1.5) {
      //middle line

      this.y = -this.y;
    } else if (this.y > height) {
      //downwards

      this.y = -this.y;
    } else if (this.x < width / 12 - 100) {
      //left

      this.x = -this.x;
    } else if (this.x > width) {
      //right
      this.x = -this.x;
    }
  }
}

class bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.velocity = -5;
  }
  show() {
    fill(50, 100, 70);
    image(bulletImage, this.x, this.y, 10, 30);
  }
  move() {
    this.y += this.velocity;
  }
}

class Player2 {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 35;
    this.color = color("red");
    this.velocity = random(1, 2);
  }

  show() {
    noStroke();
    fill("red");
    image(virusImage, this.x, this.y);
  }
  move() {
    this.y += this.velocity;

    if (this.y > height / 1.5) {
      this.y = 0;
      this.x = random(width);
      lives -= 1;
    }
  }
}

class rect1 {
  //line
  // line
  constructor() {
    this.x = 0;
    this.y = height / 1.5;
    this.color = "white";
  }

  show() {
    noStroke;
    fill(this.color);
    image(bulletImage, this.x, this.y, width, 10);
  }
}

//Background
// this class describes the properties of a single particle.
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(1, 8);
    this.xSpeed = random(-0.5, 0.5);
    this.ySpeed = random(-0.5, 0.5);
  }

  // creation of a particle.
  createParticle() {
    noStroke();
    fill("rgba(255,255,230,100)");
    circle(this.x, this.y, this.r);
  }

  // setting the particle in motion.
  moveParticle() {
    if (this.x < 0 || this.x > width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  // this function creates the connections(lines)
  // between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach(element => {
      let dis = dist(this.x, this.y, element.x, element.y);
      if (dis < 85) {
        stroke("rgba(255,255,255,0.04)");
        line(this.x, this.y, element.x, element.y);
      }
    });
  }
}
