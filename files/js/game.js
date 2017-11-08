// game.js

var develop=false; // use this to enter develop mode

// global variables ************************************************************
var key_value="null", paused=0, full_time=[3600,2400,1200], lev_num=0, time=full_time[0], number_levels;
var player={x:290,y:260,w:20,h:20}; // the player object
var score=0, seconds, levelScore=0, diff_lev=0, highscore, levelGfx;

$(document).on("pagecreate","#titleScreen",function(){ // only runs this once the html page has loaded

//  $("#gameOverText").hide(); // hide the game over text
//  $("end_text").hide(); // hide the end screen text
// onload variables ************************************************************
  // load sprites for player
  var spriteUp=new Image(); // creates an  placeholder
  var spriteDown=new Image();
  var spriteLeft=new Image();
  var spriteRight=new Image();
  var easyGfx=new Image();
  var mediGfx=new Image();
  var hardGfx=new Image();
  spriteUp.src="files/graphics/ratUp.png"; // gives the placeholder a source
  spriteDown.src="files/graphics/ratDown.png";
  spriteLeft.src="files/graphics/ratLeft.png";
  spriteRight.src="files/graphics/ratRight.png";
  easyGfx.src="files/graphics/Easy.png";
  mediGfx.src="files/graphics/Medium.png";
  hardGfx.src="files/graphics/Hard.png";

  var flag=0, speed=10, which=0, sprite=spriteUp, lives=3, sound=true, beep_end_flag=false, text_left, text_right, text_left_extra, text_right_extra;
  var game_canvas=document.getElementById("gameArea"); // puts the canvas into a variable
  var score_canvas=document.getElementById("scoreArea");
  var cv1=game_canvas.getContext("2d"); // sets the context to 2d
  var cv2=score_canvas.getContext("2d");

  // load sound effects in
  var beep=new Audio("files/sounds/beep.mp3"); // puts the sound file at the given file address into the named variable
  var beep_end=new Audio("files/sounds/beep_end.mp3");
  var scratch=new Audio("files/sounds/scratch.mp3");
  var knock=new Audio("files/sounds/knock.mp3");
  var lev_com=new Audio("files/sounds/level_complete.mp3");
  var win_sound=new Audio("files/sounds/win.mp3");
  var powerup=new Audio("files/sounds/powerup.mp3");
  var game_over=new Audio("files/sounds/gameOver.mp3")

  // define level walls
  var level=[
  { // bl_x is the start x position, bl_y is the start y position, bl_sx is the length of x, bl_sy is the length of y and exit is where to place the exit
    // level 1 - these levels can have any number of walls (up to about 4 billion!) so long as there are start positions and sizes for each
	  bl_x:[270,320,100,100,240,320,440,440,50, 100,50, 50, 150,150,240,190,240,440,240,330,320,50, 390,440,240,100,0,  20, 290,50, 50, 90, 140,140,140,280,230,300,280,320,370,390,440,440,440,490,540,440,500,500,340,440,540],
    bl_y:[200,200,150,200,200,200,200,150,10, 200,100,330,250,250,200,250,280,280,330,330,330,380,200,200,50, 50, 0,  540,10, 380,490,380,430,430,490,380,430,100,440,390,330,330,330,330,490,380,100,100,380,440,50, 50, 50],
    bl_sx:[10,10, 300,100,30, 80, 100,60, 10, 10, 150,150,10, 50, 10, 10, 160,100,40, 70, 10, 280,10, 10, 10, 140,600,580,10, 10, 40, 10, 10, 100,260,10, 10, 100,40, 10, 10, 10, 60, 10, 160,10, 10, 100,40, 40,200, 10, 10],
    bl_sy:[80,80, 10, 10, 10, 10, 10, 10, 330,90, 10, 10, 90, 10, 90, 80, 10, 10, 10, 10, 50, 10, 80, 80, 100, 10,10, 10, 100,120,10, 120,120,10, 10, 70, 60, 10, 10, 60, 160,160,10, 170,10, 70, 350,10, 10, 10, 10, 50, 50],
    exit:[150,500,20,40]
  },
  {
    // level 2 - the weird spacings on these levels are to help the author keep track of each wall
    bl_x:[0,0,110,280,290,310,290,180,180,400,360,320,180,180,500,460,500,560,180,100,100,350,550,430,430,550,530],
    bl_y:[130,220,170,250,250,250,360,300,400,300,400,370,130,170,170,120,120,250,500,30,30,100,100,450,500,450,0],
    bl_sx:[100,100,50,10,20,10,50,10,100,10,50,10,10,40,10,40,10,40,10,90,10,80,50,10,120,10,10],
    bl_sy:[10,10,10,60,10,60,10,100,10,70,10,60,100,10,50,10,20,10,50,10,30,10,10,50,10,60,30],
    exit:[0,140,20,80]
  },
  {
    // level 3
    bl_x:[270,270,320,270,210,380,180,170,180,210,370,380,380,410,260,260,330,240,100,100,420,50, 0, 500,480,100,350,380,30,580,100,0],
    bl_y:[280,250,250,200,200,200,100,100,130,100,100,100,130,100,500,500,530,70, 40, 400,380,100,20,0,  530,40, 200,530,530,170,380,100],
    bl_sx:[60,10, 10, 60, 10, 10, 10, 60, 40, 10, 60, 10, 40, 10, 10, 60, 10, 40, 10, 40, 10, 10, 40,10, 30, 20, 40, 10, 10, 20, 10, 60],
    bl_sy:[10,40, 40, 10, 60, 60, 40, 10, 10, 40, 10, 40, 10, 40, 50, 10, 20, 10, 60, 10, 40, 50, 10,40, 20, 10, 10, 20, 20, 10, 20, 10],
    exit:[270,530,60,20]
  },
  {
    // level 4
    bl_x:[300,270,200,180,300,380,350,150,130,80, 70, 500,470,560,520,230,230,450,420,420,450,70, 170,20, 20,260,490,20],
    bl_y:[0,  280,250,350,320,280,200,180,380,350,130,130,380,350,520,470,100,90, 450,480,450,500,20, 320,60,450,30, 100],
    bl_sx:[10,60, 10, 60, 10, 10, 60, 10, 60, 10, 60, 10, 60, 10, 60, 10, 50, 10, 10, 40, 10, 60, 60, 10, 60,60, 70, 10],
    bl_sy:[60,10, 60, 10, 60, 60, 10, 60, 10, 60, 10, 60, 10, 60, 10, 60, 10, 40, 30, 10, 30, 10, 10, 60, 10,10, 10, 60],
    exit:[430,460,20,20]
  },
  {
    // level 5
    bl_x:[50 ,60 ,50 ,50 ,60 ,50 ,50, 120,130,130,130,130,130,140,210,200,210,210,210,220,210,290,300,290,290,290,300,300,370,360,370,370,370,370,370,450,450,450,450,440,450,450,520,530,530,530,530,530,530,370],
    bl_y:[40, 120,200,270,360,450,510,40, 110,200,280,350,440,520,50, 120,200,280,360,440,520,280,200,120,40, 350,440,520,40, 110,200,280,370,440,520,40, 120,190,280,360,430,520,40, 120,200,280,360,440,510,540],
    bl_sx:[20,20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 100],
    bl_sy:[20,20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 10],
    exit:[390,520,60,20]
  },
  {
    // level 6
    bl_x:[290,240,270,300,290,200,230,110,110,150,330,310,380,370,440,430,350,500,490,310,20, 50, 100,80, 180,100,130,50, 80, 300,440,520,500,100,270,20, 210,480,180],
    bl_y:[280,260,200,230,140,170,90, 400,400,400,120,70, 100,150,130,170,140,150,20, 0,  50, 100,90, 180,240,220,300,280,500,490,310,200,470,450,400,380,520,350,20],
    bl_sx:[10,30, 10, 30, 10, 30, 10, 10, 40, 10, 30, 10, 30, 10, 30, 10, 10, 30, 10, 10, 30, 10, 30, 10, 10, 30, 10, 30, 10, 30, 30, 30, 10, 30, 10, 30, 10, 10, 10],
    bl_sy:[30,10, 30, 10, 30, 10, 30, 30, 10, 30, 10, 30, 10, 30, 10, 30, 30, 10, 30, 30, 10, 30, 10, 30, 30, 10, 30, 10, 30, 10, 10, 10, 30, 10, 30, 10, 30, 30, 30],
    exit:[120,410,30,20]
  },
  {
    // level 7
    bl_x:[550, 270,500,200,0,  150,400,530,300,200,200,270,360,260,500,450,40, 40, 240],
    bl_y:[30,  290,150,90, 70, 320,240,240,420,400,470,260,260,0,  450,520,450,190,160],
    bl_sx:[100,100,100,10, 100,100,10, 100,100,10, 100,10, 10, 10, 10, 50, 10, 30, 10],
    bl_sy:[10, 10, 10, 100,10, 10, 100,10, 10, 80, 10, 20, 20, 10, 80, 10, 70, 10, 40],
    exit:[580,160,20,80]
  },
  {
    // level 8
    bl_x:[280,270,320,250,240,350,220,210,270,330,320,380,200,350,240,350,30, 30, 0,  300,560,520,520,30, 30, 30, 200,150,150,30, 30, 30, 200,150,150,30, 30, 30, 300,420,390,500,580,430,100,110,570,550,450,460,310,480,550,530],
    bl_y:[280,250,250,200,200,200,500,460,460,500,460,460,80, 80, 80, 80, 50, 50, 110,0,  20, 20, 110,170,170,230,200,200,300,270,270,370,340,340,440,410,410,510,180,180,0,  200,200,340,320,140,150,300,280,400,380,440,410,530],
    bl_sx:[40,10, 10, 100,10, 10, 50, 10, 10, 50, 10, 10, 50, 50, 10, 10, 50, 10, 120,10, 10, 50, 50, 10, 50, 50, 10, 50, 50, 10, 50, 50, 10, 50, 50, 10, 50, 50, 10, 10, 10, 20, 20, 20, 10, 20, 10, 20, 10, 20, 10, 10, 10, 20],
    bl_sy:[10,70, 70, 10, 100,100,10, 90, 70, 10, 50, 50, 10, 10, 50, 50, 10, 60, 10, 110,100,10, 10, 60, 10, 10, 110,10, 10, 110,10, 10, 110,10, 10, 110,10, 10, 20, 20, 20, 10, 10, 10, 20, 10, 20, 10, 20, 10, 20, 20, 20, 10],
    exit:[280,290,40,20]
  },
  {
    // level 9
    bl_x:[270,20, 90, 230,400,370,520,310,490,460,260,110,140,50, 230,100,300,300,520,530,400,20, 100],
    bl_y:[50, 80, 30, 170,140,20, 50, 250,220,300,310,150,330,310,410,480,410,470,340,400,470,420,210],
    bl_sx:[60,60, 60, 60, 60, 50, 60, 60, 60, 50, 60, 50, 60, 60, 50, 50, 50, 60, 50, 50, 60, 50, 50],
    bl_sy:[60,60, 60, 60, 60, 50, 60, 60, 60, 50, 60, 50, 60, 60, 50, 50, 50, 60, 50, 50, 60, 50, 50],
    exit:[320,300,40,10]
  },
  {
    // level 10 - you can create more levels by creating more objects after this one
    bl_x:[100,100,100,100,100,200,200,200,200,200,300,300,300,300,300,400,400,400,400,400,500,500,500,500,500,150,230,380,450,510,160,210,370,450,540,590,80, 130,220,350,460,530,20,120,280,360,440,510,30, 130,270,320,410,510,130,280,320,280],
    bl_y:[100,200,300,400,500,100,200,300,400,500,100,200,300,400,500,100,200,300,400,500,100,200,300,400,500,260,240,280,210,210,430,450,420,470,470,250,140,160,120,120,110,190,20,80, 60, 60, 40, 20, 330,310,330,340,340,350,30, 30, 30, 60],
    bl_sx:[10,10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 40, 10, 40],
    bl_sy:[10,10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 40, 10],
    exit:[280,40,40,20]
  }
  ]

  number_levels=level.length; // find out how many levels there are, enabling more levels than are currently here

  screen_size(); // set the screen dimensions so the game works on different sized screens (up to a point..)
  splash_screen();  // run the splash/title screen
  welcome_screen();
  requestAnimationFrame(computeAndRender); // begin to run the game

// the splash/title screen function ********************************************

  function splash_screen()
  {
    var splash=new Audio("files/sounds/intro.mp3"); // set the intro music
    splash.play(); // play the intro music
/*    $("#container").hide(); // hide the box that contains the canvases
    $("#whole_page").hide(); // hide the whole page blank-out
    $("#inner_modal_box").hide(); // hide the inner box that contains the text for the blank-out box */
    $("#pic").animate({top: "100px"},3000) // animate in the rat picture
    $("#left").animate({top: "-400px"},4500) // animate in the left part of the text
    $("#right").animate({top: "-200px"},4500) // animate in the right part of the text
/*    $("#container").delay(6000).fadeIn(4000); // wait for 6 seconds then fade the canvases in
    $("#whole_page").delay(6000).fadeIn(4000); // wait for six seconds then fade the blank-out box in
    $("#inner_modal_box").delay(6000).fadeIn(4000); // wait for six seconds then fade the blank-out box text area in */
    $("#pic").on("tap", function(){
      $.mobile.navigate("#pauseScreen");
    })
  }

  // the welcome screen function *************************************************

    function welcome_screen()
    {
      var head="Welcome to Rat Escape!"; // this will be passed to the blank screen function
      var text="Escape the maze using the<br>arrow keys or W A S D.<br>Choose a difficulty to begin"
      blank_screen("intro", head, text); // pass these parameters to the blank screen function
    }

  // end of welcome screen function ----------------------------------------------

// compute and render function *************************************************

  function computeAndRender()
  {
    if(paused%2==0) // run this if the game is not paused
    {
      compute(); // run the compute function
      render(); // run the render function
    }
    requestAnimationFrame(computeAndRender); // continuously run the compute and render cycle, using requestAnimationFrame
  }

// end of compute and render function ------------------------------------------

// compute function ************************************************************

  function compute()
  {
    // using switch here because it's easier than an if....else statement
    switch(key_value)
    {
      case "left": // if keyvalue is left...
        player.x-=speed; // ...remove (speed) from player.x
        if(sound) // if sound is on...
          scratch.play(); // ...play the movement sound effect
        if(player.x<0) // if player is against or further left than the left-hand wall...
          player.x=0, key_value="null", flag=0; // ...set player.x to 0 (prevents going through the wall), set the key_value to null (prevents the player continuously bashing the wall) and set the flag to 0 (lets the game know that the rat has stopped)
        var checked=obstacle(); // check to see if we've hit a wall
        if(checked) // if we have hit a wall...
          player.x=level[lev_num].bl_x[which]+level[lev_num].bl_sx[which], key_value="null", flag=0; // ...set player.x to the edge of the wall, key_value to null and the flag to 0
        break; // end this cycle, go directly to the next code without evaluating the others in the switch

      case "right":
        player.x+=speed;
        if(sound)
          scratch.play();
        if(player.x>600-player.w)
          player.x=600-player.w, key_value="null", flag=0;
        var checked=obstacle();
        if(checked)
          player.x=level[lev_num].bl_x[which]-player.w, key_value="null", flag=0;
        break;

      case "up":
        player.y-=speed;
        if(sound)
          scratch.play();
        if(player.y<0)
          player.y=0, key_value="null", flag=0;
        var checked=obstacle();
        if(checked)
          player.y=level[lev_num].bl_y[which]+level[lev_num].bl_sy[which], key_value="null", flag=0;
        break;

      case "down":
        player.y+=speed;
        if(sound)
          scratch.play();
        if(player.y>550-player.h)
          player.y=550-player.h, key_value="null", flag=0;
        var checked=obstacle();
        if(checked)
          player.y=level[lev_num].bl_y[which]-player.h, key_value="null", flag=0;
        break;
    }

    // countdown timer and time check
    if(!develop)
      time--; // removes 1 from the time-counter (comment this out to turn time off)
    if(time<0) // if the time is below 0...
    {
      lives--; // ...remove one from the life counter
      score-=100
      if(lives>0) // if the lives counter is more than 0...
        gameover("timeout"); // ...run the gameover function, passing timeout to it
    }
    if(lives==0) // but if the lives counter is at 0...
      gameover("lives"); // ...run the gameover function but pass lives to it
  }

// end of compute function -----------------------------------------------------

// obstacle detection **********************************************************

  function obstacle()
  {
    var len=level[lev_num].bl_x.length; // put the number of walls in the current level into a variable
      for(i=0;i<len;i++) // run this code x amount of times, where x is the number of walls in the current level
      { // this next bit of code checks to see if the player is inside the boundary of the wall being checked
        if(level[lev_num].bl_x[i]<player.x+player.w&&
          level[lev_num].bl_x[i]+level[lev_num].bl_sx[i]>player.x&&
          level[lev_num].bl_y[i]<player.y+player.h&&
          level[lev_num].bl_y[i]+level[lev_num].bl_sy[i]>player.y)
        {
          which=i; // the variable which is now the number of the wall that the player is inside
          return true; // return true, exiting the obstacle function
        }
      }
      // exit detection -- checks to see if the player is inside the boundary of the exit...
      if(player.x>=level[lev_num].exit[0]&&
        player.x<=level[lev_num].exit[0]+level[lev_num].exit[2]&&
        player.y>=level[lev_num].exit[1]&&
        player.y<=level[lev_num].exit[1]+level[lev_num].exit[3])
      { // ...and if it is...
        lev_num++; // ...increase the level number
        var dL=Math.floor((full_time[diff_lev]/60)-(time/60)); // calculate how many seconds it took to complete
        levelScore=((diff_lev+6)*100)-(dL*10); // remove the seconds took from the base level score
        score+=levelScore; // add the level score to the total score
        if(lev_num==number_levels) // if the level number is equal to the number of levels+1 (lev_num is zero indexed, number_levels is not)...
        {
          gameover("win"); // ...run the gameover function, passing it the parameter run
          return; // exit this function
        }
        if(sound)
          lev_com.play();
        var head="Level "+lev_num+" Complete";
        var text="Well Done!<br>Click OK to continue to the next level<br>Score "+levelScore+" for this level<br>Total score "+score;
        blank_screen("next_level", head, text);
      }
      return false; // default return if no wall or exit
    }

// end of obstacle function ----------------------------------------------------

// render function *************************************************************

  function render()
  {
    cv1.clearRect(0,0,game_canvas.width,game_canvas.height); // clear the game canvas

    // draw a grid for design purposes (remove or comment out when complete)
    if(develop)
    {
    cv1.beginPath();
    cv1.strokeStyle="rgb(255,255,255)";
    for(i=0;i<60;i++)
    {
      cv1.moveTo(i*10,0);
      cv1.lineTo(i*10,550);
      cv1.stroke();
    }
    for(i=0;i<55;i++)
    {
      cv1.moveTo(0,i*10);
      cv1.lineTo(600,i*10);
      cv1.stroke();
    }
    cv1.closePath();
    cv1.strokeStyle="black";
    cv1.beginPath();
    for(i=0;i<6;i++)
    {
      cv1.moveTo(i*100,0);
      cv1.lineTo(i*100,550);
      cv1.stroke();
    }
    for(i=0;i<6;i++)
    {
      cv1.moveTo(0,i*100);
      cv1.lineTo(600,i*100);
      cv1.stroke();
    }
    cv1.closePath();
    }

    // draw the player on the screen
    cv1.drawImage(sprite,player.x,player.y,player.w,player.h);
    cv1.fill();

    // iterate through the level object to draw the walls
    var lev_len=level[lev_num].bl_x.length; // put the current levels object length into a variable 9doing it this way, outside of the loop, is apparently a bettter way of doing this)
    for(i=0;i<lev_len;i++) // iterate through the number of walls in the object
    {
      cv1.beginPath();
      cv1.rect(level[lev_num].bl_x[i],level[lev_num].bl_y[i],level[lev_num].bl_sx[i],level[lev_num].bl_sy[i]);
      cv1.fillStyle="rgb(255,0,0)";
      cv1.fill();
    }

    // draw the exit
    cv1.beginPath();
    cv1.rect(level[lev_num].exit[0],level[lev_num].exit[1],level[lev_num].exit[2],level[lev_num].exit[3]);
    cv1.fillStyle="rgb(0,255,0)";
    cv1.fill();

    // draw the second canvas (scoreboard)
    var thisLevel=lev_num+1; // add 1 to the zero-indexed lev_num
    cv2.clearRect(0,0,score_canvas.width,score_canvas.height); // clear the scoreboard canvas
    cv2.font="40px Raleway"; // select a font
    if(time<=660) // if the time is 10 seconds or less...
    {
      cv2.fillStyle="red"; // ...change the following text to red
      if(sound==true&&time%60==0&&time>60)  // if sound is on and the cycle is on a second and 1 second or more
        beep.play(); // play the seconds beep
      if(sound==true&&time<=60&&beep_end_flag!=true) // beep_end_flag prevents the sound playing over and over and over and .....
      {
        beep_end.play();
        beep_end_flag=true; // the sound has played, change the flag to true
      }
    }
    else
      cv2.fillStyle="black"; // set the text colour to black
    seconds=Math.floor(time/60); // convert the time counter (in milliseconds) to seconds
    if(seconds<1) // if seconds are less than one
      seconds=0; // keep the seconds from going below zero
    cv2.fillText("Time : "+seconds,20,40);
    cv2.fillStyle="black"; // the reset of the text is in black
    //cv2.fillText("X position : "+player.x,20,70); // remove from final game
    //cv2.fillText("Y position : "+player.y,20,100); // remove from final game
    cv2.fillText("Lives : "+lives,20,90);
    cv2.fillText("Highscore : "+highscore,20,140);
    cv2.fillText("Level "+thisLevel,20,190);
    cv2.fillText("Score "+score,20,240);
    cv2.drawImage(levelGfx,400,0);
  }

// end of render function ------------------------------------------------------

// screen overlay function *****************************************************
  function blank_screen(reason,head,text)
  {
    paused=1 // like setting the paused flag to true
    $("#whole_page").slideDown("slow");
    document.getElementById("modal_header").innerHTML=head; // change the text to whatever has been passed to this function
    document.getElementById("modal_text").innerHTML=text;
    $("#yes_no_game").hide();
    $("#yes_no_level").hide();
    $("#ok_but").hide();
    $("#difficulty").hide();
    switch(reason)
    {
      case "pause":
        $("#confirmButtons").show();
        $("#ok_but").show().on("click",function()
        {
          if(sound)
            knock.play();
		  $("#whole_page").slideUp("slow");
		  paused=0;
        });
        break;

      case "game_reset": // this resets the game to level 1 with no score and all lives if yes is clicked
        $("#confirmButtons").show();
        $("#yes_no_game").show();
        $("#confirmButtons").on("click", "#gameYes", function()
        {
          time=full_time[diff_lev], player.x=290, player.y=260, key_value="null", paused=0, lev_num=0, lives=3, score=0;
          $("#whole_page").slideUp("slow");
          if(sound)
            knock.play();
            return true;
        })
        $("#confirmButtons").on("click", "#gameNo", function() // this returns the to the game with nothing altered
        {
          if(sound)
            knock.play();
          $("#whole_page").slideUp("slow");
          paused=0;
        })
        break;

      case "level_reset": // this resets the current level but with one life lost, if yes is clicked
        $("#confirmButtons").show();
        $("#yes_no_level").show();
        $("#confirmButtons").off().on("click", "#levelYes", function()
        {
          if(sound)
            knock.play();
          if(lives>0)
            time=full_time[diff_lev], player.x=290, player.y=260, key_value="null", paused=0, lives--;
          $("#whole_page").slideUp("slow");
        })
        $("#confirmButtons").on("click", "#levelNo", function() // returns to the game with no parameters changed
        {
          if(sound)
            knock.play();
          $("#whole_page").slideUp("slow");
          paused=0;
        })
        break;

      case "timeout": // shows the blank-out screen for the timeout scenario.  the level is reset with one life lost
        $("#confirmButtons").show();
        $("#ok_but").show();
        $(document).on("click", "#ok_but", function()
        {
          if(sound)
            knock.play();
          time=full_time[diff_lev], player.x=290, player.y=260, key_value="null", paused=0, beep_end_flag=false;
          $("#whole_page").slideUp("slow");
        })
        break;

      case "next_level": // this shows the blank-out screen for the next level
        $("#confirmButtons").show();
        $("#ok_but").show();
        if(lev_num%5==0)
          extra_life(); // this runs the extra life function every 5th level reached
        $(document).on("click", "#ok_but", function()
        {
          if(sound)
            knock.play();
          time=full_time[diff_lev], player.x=290, player.y=260, key_value="null", paused=0, flag=0;
          $("#whole_page").slideUp("slow");
        })
        break;

      case "intro": // this shows the difficulty select screen
        $("#confirmButtons").show();
        $("#difficulty").show();
        $(document).on("click", "#easy", function()
        {
          knock.play();
          time=full_time[0], player.x=290, player.y=260, key_value="null", paused=0, flag=0, diff_lev=0, levelGfx=easyGfx;
          highscore=savescore("load"); // put the previous highscores into the variable highscore
          $("#whole_page").slideUp("slow");
        }).on("click","#medium",function()
        {
          knock.play();
          time=full_time[1], player.x=290, player.y=260, key_value="null", paused=0, flag=0, diff_lev=1, levelGfx=mediGfx;
          highscore=savescore("load"); // put the previous highscores into the variable highscore
          $("#whole_page").slideUp("slow");
        }).on("click","#hard",function()
        {
          knock.play();
          time=full_time[2], player.x=290, player.y=260, key_value="null", paused=0, flag=0, diff_lev=2, levelGfx=hardGfx;
          highscore=savescore("load"); // put the previous highscores into the variable highscore
          $("#whole_page").slideUp("slow");
        });
        break;
    }
  }

// end of screen overlay function ----------------------------------------------

// extra life function *********************************************************

function extra_life()
{
  $("#gameOverText").show();
  $("#extra_text").css({"left":"-50%"}).show();
  $("#life_text").css({"left":"120%"}).show();
  $("#extra_text").animate({left: text_left_extra}, 2000).fadeOut("slow");
  $("#life_text").animate({left: text_right_extra},2000).fadeOut("slow");
  powerup.play();
  lives++;
}

// end of extra life function --------------------------------------------------

// gameover function ***********************************************************

  function gameover(reason)
  {
    switch(reason)
    {
      case "timeout":
        var head="Timeout";
        var text="Lose 100 points<br>Click OK to restart this level";
        blank_screen("timeout", head, text);
        break;

      case "win":
        document.getElementById("game_text").src="files/graphics/ratEnd.png";
        document.getElementById("over_text").src="files/graphics/escaped.png";
        savescore("save");
        game_ended("gameWin");
        break;

      case "lives":
        savescore("save");
        time=0,beep_end_flag=true;
        game_ended("gameOver");
        break;
    }
  }

// end of gameover function ----------------------------------------------------

// local storage for high score ************************************************

  function savescore(reason) // this will only work on non-MS products
  {
    if(reason=="load")
    {
      var retrieve
      if(diff_lev==0)
        retrieve=localStorage.getItem("highscoreEasy");
      if(diff_lev==1)
        retrieve=localStorage.getItem("highscoreMedium");
      if(diff_lev==2)
        retrieve=localStorage.getItem("highscoreHard");
      var convert=parseInt(retrieve);
      if(isNaN(convert))
        convert=0;
      return convert;
    }
    if(reason=="save")
    {
      if(score>highscore)
      {
        if(diff_lev==0)
          localStorage.setItem("highscoreEasy",score);
        if(diff_lev==1)
          localStorage.setItem("highscoreMedium",score);
        if(diff_lev==2)
          localStorage.setItem("highscoreHard",score);
      }
    }
  }

// end of high score save function ---------------------------------------------

// resize the canvases based on the size of the screen *************************

  function screen_size()
  {
    game_canvas.width=600; // set the canvas width
    game_canvas.height=550; // set the canvas height
    score_canvas.width=520;
    score_canvas.height=250;
    game_canvas.style.marginLeft="10%"; // set the canvas margin
    game_canvas.style.marginRight="auto";



    var wp_w=$(window).width(); // get the width of the page (body)
    var wp_h=$(window).height(); // get the height of the page (document)
    $("#whole_page").css( // set the height and width of the whole page
    {
      "height":wp_h,
      "width":wp_w
    });
    $("inner_modal_box").css( // set the height and width of the modal box
    {
      "height":wp_h,
      "width":wp_w
    });

	var img1=document.getElementById("game_text"); // get the 'game'
	var img4=document.getElementById("extra_text"); // get the 'extra' image
	var img3=document.getElementById("pic"); // get the rat image
	var g_o_image_1=img1.width; // set the value of 'game over image 1' to the width of 'game'
	var g_o_rat=img3.width;
	var e_l_im_1=img4.width;
	middle=wp_w/2; // find the middle of the page
	text_left=middle-g_o_image_1+"px"; // left text position equals middle of the page, minus image length (add "px" on the end because that's the measurement)
	text_right=middle+"px";
	text_left_extra=middle-e_l_im_1+"px";
	text_right_extra=middle+"px";
  }

// end of screen size function -------------------------------------------------

// sound on / off toggle *******************************************************

  $("#sound_buttonInput").click(function()
  {
    var onOff=document.getElementById("sound_buttonInput").checked;
    if(onOff==true) // checks to see if the sound button is checked (on) or not
    {
      sound=true
      knock.play();
    }
    else
      sound=false
  })

// end of sound toggle function ------------------------------------------------

// pause game function *********************************************************

  $("#pauseGame").click(function()
  {
    if(sound)
      knock.play();
    blank_screen("pause","Game Paused","Click 'Ok' to resume");
  });

// end of pause game function --------------------------------------------------

// reset game function *********************************************************

  $("#resetGame").click(function()
  {
    if(sound)
      knock.play();
    blank_screen("game_reset","Reset this game","Are you sure?<br>You will lose all progress...");
  })

// reset level function ********************************************************

  $("#resetLevel").click(function()
  {
    if(sound)
      knock.play();
    blank_screen("level_reset","Reset this level","Are you sure?<br>This will incur a 1 life penalty...");
  })

// game ended functions *********************************************************

  function game_ended(reason)
  {
    $("#container").hide();
    $("#whole_page").hide();
    $("end_text").css({"visibility":"visible"});
    $("#gameOverText").show();
    document.getElementById("final_score").innerHTML="Your Final Score is "+score;
    if(reason=="gameOver")
    {
      $("#game_text").animate({left: text_left},3500);
      $("#over_text").animate({left: text_right},3500);
      $("#final_score").animate({top: "60%"},4000);
      $("#last_act").animate({top: "70%"},4000);
      game_over.play();
    }
    if(reason=="gameWin")
    {
      $("#game_text").animate({left: "10%"},3500);
      $("#over_text").animate({left: "55%"},3500);
      $("#pic").css({"left":"35%"}).fadeIn(7000);
      $("#final_score").animate({top: "70%"},4000);
      $("#last_act").animate({top: "80%"},4000);
      win_sound.play();
    }
  }

// end of game ended functions --------------------------------------------------

}) // end of onload function ----------------------------------------------------

// change buttons based on mouseover event *************************************

$(document).on("mouseenter", "#pauseGame, #easy, #gameNo, #levelNo, #ok", function()
{
  $(this).css(
  {
    "background-color":"#198c19"
  })
}).on("mouseleave", "#pauseGame, #easy, #gameNo, #levelno, #ok", function()
{
  $(this).css(
  {
    "background-color":"#329932"
  })
}).on("mouseenter", "#resetGame, #hard, #gameYes, #levelYes", function()
{
  $(this).css(
  {
    "background-color":"#FF1919"
  })
}).on("mouseleave", "#resetGame, #hard, #gameYes, #levelYes", function()
{
  $(this).css(
  {
    "background-color":"#FF3232"
  })
}).on("mouseenter", "#resetLevel, #medium", function()
{
  $(this).css(
  {
    "background-color":"#91782c"
  })
}).on("mouseleave", "#resetLevel, #medium", function()
{
  $(this).css(
  {
    "background-color":"#9C8C42"
  })
});

// end of mouseover events -----------------------------------------------------
