// game.js

/*
COPYRIGHT SYMON HAMBREY 2017
ALL RIGHTS RESERVED
*/

// put global variables used here **********************************************

var win_w,
    win_h,
    game_h,
    diff_lev,
    paused=false,
    player={},
    cv1,
    game_canvas,
    speed=5,
    movingFlag=false,
    levelNum=1,
    levelImg=0,
    direction;

// load sprites and levels
var spriteUp=new Image(); // creates an  placeholder
var spriteDown=new Image();
var spriteLeft=new Image();
var spriteRight=new Image();
var easyGfx=new Image();
var mediGfx=new Image();
var hardGfx=new Image();
var level_1=new Image();
spriteUp.src="files/graphics/ratUp.png"; // gives the placeholder a source
spriteDown.src="files/graphics/ratDown.png";
spriteLeft.src="files/graphics/ratLeft.png";
spriteRight.src="files/graphics/ratRight.png";
var playerSprite=spriteRight;
easyGfx.src="files/graphics/Easy.png";
mediGfx.src="files/graphics/Medium.png";
hardGfx.src="files/graphics/Hard.png";
level_1.src="files/graphics/level_1.png";

// level array
var level=[];
level[0]=new Image();
level[0].src="files/graphics/level_1.png";
level[1]=new Image();
level[1].src="files/graphics/level_2.png";

// load sound effects in
var beep=new Audio("files/sounds/beep.mp3"); // puts the sound file at the given file address into the named variable
var beep_end=new Audio("files/sounds/beep_end.mp3");
var scratch=new Audio("files/sounds/scratch.mp3");
var knock=new Audio("files/sounds/knock.mp3");
var lev_com=new Audio("files/sounds/level_complete.mp3");
var win_sound=new Audio("files/sounds/win.mp3");
var powerup=new Audio("files/sounds/powerup.mp3");
var game_over=new Audio("files/sounds/gameOver.mp3")

// -----------------------------------------------------------------------------

// var full_time=[3600,2400,1200], lev_num=0, time=full_time[0], number_levels;
// var flag=0, which=0, sprite=spriteUp, lives=3, sound=true, beep_end_flag=false, text_left, text_right, text_left_extra, text_right_extra;
// var player={x:290,y:260,w:20,h:20}; // the player object
// var score=0, seconds, levelScore=0, highscore, levelGfx;

//$(document).on("pagecreate","#titleScreen",function(){ // only runs this once the html page has loaded
$(document).on("pagecreate","#titleScreen",function(){ // only runs this once the html page has loaded


// onload variables ************************************************************

  game_canvas=document.getElementById("gameArea"); // puts the canvas into a variable
  cv1=game_canvas.getContext("2d"); // sets the context to 2d

  screen_size(); // set the screen dimensions so the game works on different sized screens (up to a point..)
  splash_screen();  // run the splash/title screen
  //computeAndRender(); // remove this for titles
}); // end of onload function --------------------------------------------------

// resize the canvases based on the size of the screen *************************

function screen_size()
{
  win_w=$(window).width(); // get the width of the page (body)
  win_h=$(window).height(); // get the height of the page (document)
  game_canvas.width=win_w; // set the size of the canvas width
  g_h=$("#header").height(); // get the height of the header
  game_h=win_h-g_h; // set the game height as the height of the page minus the height of the header
  game_canvas.height=game_h; // set the size of the canvas height
  $("#pauseButton").css({"width":"g_h", "height":"g_h"}) // change the size of the pause botton to match the header height
  initialPlayerPos(); // find the middle of the game screen
}

function initialPlayerPos(){
  player={x:0,y:10,w:20,h:20}
};

// end of screen size function -------------------------------------------------

// get input (for testing) Delete When movement implemented ********************

$(document).on("tap", "#timeDisplay", function(){
  if(!movingFlag){
    direction="left";
    movingFlag=true;
  }
});
$(document).on("tap", "#fakeTime", function(){
  if(!movingFlag){
    direction="right";
    movingFlag=true;
  }
});
$(document).on("tap", "#lifeDisplay", function(){
  if(!movingFlag){
    direction="up";
    movingFlag=true;
  }
});
$(document).on("tap", "#fakeLife", function(){
  if(!movingFlag){
    direction="down";
    movingFlag=true;
  }
});
$(document).on("tap", "#pauseButton", function(){
  paused=true;
});
$(document).on("collapse", "#pausePanel", function(){
  paused=false;
});

// end of input ----------------------------------------------------------------

// compute and render function *************************************************

  function computeAndRender()
  {
    if(!paused) // run this if the game is not paused
    {
      compute(); // run the compute function
      render(); // run the render function
    }
    requestAnimationFrame(computeAndRender); // continuously run the compute and render cycle, using requestAnimationFrame
  }

// end of compute and render function ------------------------------------------

// compute function ************************************************************

  function compute(){

    // using switch here because it's easier than an if....else statement
    switch(direction){
      case "left": // if keyvalue is left...
        if(movingFlag)
          player.x-=speed; // ...remove (speed) from player.x
        var checked=check();
        if(checked){
          player.x+=speed;
        };
        //if(sound) // if sound is on...
        //  scratch.play(); // ...play the movement sound effect
        break;

      case "right":
        if(movingFlag)
          player.x+=speed;
        var checked=check();
        if(checked){
          player.x-=speed;
        };
      //  if(sound)
    //      scratch.play();
        break;

      case "up":
        if(movingFlag)
          player.y-=speed;
        var checked=check();
        if(checked){
          player.y+=speed;
        };
      //  if(sound)
        //  scratch.play();
        break;

      case "down":
        if(movingFlag)
          player.y+=speed;
        var checked=check();
        if(checked){
          player.y-=speed;
        };
      //  if(sound)
    //      scratch.play();
        break;
    };
//    direction="null", moveFlag=false, movingFlag=false;//use this for debugging
  };

/*
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
/*
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
*/
//    }

// end of obstacle function ----------------------------------------------------

// render function *************************************************************

function render(){
  cv1.clearRect(0,0,game_canvas.width,game_canvas.height); // clear the game canvas
  cv1.drawImage(level[levelImg],0,0,win_w,game_h); // set the level image
  cv1.fill(); // draw the level image
  cv1.drawImage(playerSprite,player.x,player.y,player.w,player.h); // set the player image
  cv1.fill(); // draw the player image
    // iterate through the level object to draw the walls
/*    var lev_len=level[lev_num].bl_x.length; // put the current levels object length into a variable 9doing it this way, outside of the loop, is apparently a bettter way of doing this)
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
*/
/*
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
    */
}

// end of render function ------------------------------------------------------
/*
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
          time=full_time[diff_lev], player.x=290, player.y=260, paused=0, lev_num=0, lives=3, score=0;
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
            time=full_time[diff_lev], player.x=290, player.y=260, paused=0, lives--;
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
          time=full_time[diff_lev], player.x=290, player.y=260, paused=0, beep_end_flag=false;
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
          time=full_time[diff_lev], player.x=290, player.y=260,paused=0, flag=0;
          $("#whole_page").slideUp("slow");
        })
        break;

      case "intro": // this shows the difficulty select screen
        $("#confirmButtons").show();
        $("#difficulty").show();
        $(document).on("click", "#easy", function()
        {
          knock.play();
          time=full_time[0], player.x=290, player.y=260,
           paused=0, flag=0, diff_lev=0, levelGfx=easyGfx;
          highscore=savescore("load"); // put the previous highscores into the variable highscore
          $("#whole_page").slideUp("slow");
        }).on("click","#medium",function()
        {
          knock.play();
          time=full_time[1], player.x=290, player.y=260,paused=0, flag=0, diff_lev=1, levelGfx=mediGfx;
          highscore=savescore("load"); // put the previous highscores into the variable highscore
          $("#whole_page").slideUp("slow");
        }).on("click","#hard",function()
        {
          knock.play();
          time=full_time[2], player.x=290, player.y=260,  paused=0, flag=0, diff_lev=2, levelGfx=hardGfx;
          highscore=savescore("load"); // put the previous highscores into the variable highscore
          $("#whole_page").slideUp("slow");
        });
        break;
    }
  }

// end of screen overlay function ----------------------------------------------

// extra life function *********************************************************
/*
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
/*
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
/*
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
*/
// end of high score save function ---------------------------------------------

function check(){
  var addXW=player.x+player.w, addYH=player.y+player.h;
  var topLeft=cv1.getImageData(player.x,player.y,1,1).data,
      topRight=cv1.getImageData(addXW,player.y,1,1).data,
      botLeft=cv1.getImageData(player.x,addYH,1,1).data,
      botRight=cv1.getImageData(addXW,addYH,1,1).data;

  if(topLeft[1]==255||topRight[1]==255||botRight[1]==255||botLeft[1]==255){
    nextLevel();
    return;
  };

  if(topLeft[0]==255&&topRight[0]==255||topRight[0]==255&&botRight[0]==255||botLeft[0]==255&&botRight[0]==255||botLeft[0]==255&&topLeft[0]==255||
      topLeft[0]==255||topRight[0]==255||botRight[0]==255||botLeft[0]==255){
    movingFlag=false;
    return true;
  }
  if(player.x<0||player.x>win_w-player.w||player.y<0||player.y>game_h-player.h){
    movingFlag=false;
    return true;
  }
  else{
    return false;
  }
};

function nextLevel(){
  if(levelNum<2){
    levelImg++,levelNum++;
    initialPlayerPos();
  };
  return;
};


// sound on / off toggle *******************************************************
/*
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
/*
  $("#pauseGame").click(function()
  {
    if(sound)
      knock.play();
    blank_screen("pause","Game Paused","Click 'Ok' to resume");
  });

// end of pause game function --------------------------------------------------

// reset game function *********************************************************
/*
  $("#resetGame").click(function()
  {
    if(sound)
      knock.play();
    blank_screen("game_reset","Reset this game","Are you sure?<br>You will lose all progress...");
  })

// reset level function ********************************************************
/*
  $("#resetLevel").click(function()
  {
    if(sound)
      knock.play();
    blank_screen("level_reset","Reset this level","Are you sure?<br>This will incur a 1 life penalty...");
  })

// game ended functions *********************************************************
/*
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
*/
// end of game ended functions --------------------------------------------------

// });//); // end of onload function ----------------------------------------------------

// change buttons based on mouseover event *************************************
///*
/*$(document).on("tap", "#pause_game", function(){
  knock.play();
}).on("tap", "#reset_game", function()
{
  knock.play();
}).on("tap", "#reset_level", function()
{
  knock.play();
});
$(document).on("tap", "#pauseButton", function(){
});
*/
// end of mouseover events -----------------------------------------------------
