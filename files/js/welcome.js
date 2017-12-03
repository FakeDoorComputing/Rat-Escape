// the splash/title screen function ********************************************

function splash_screen()
{
  var splash=new Audio("files/sounds/intro.mp3"); // set the intro music
  splash.play(); // play the intro music
  $("#pic").animate({top: "100px"},3000); // animate in the rat picture
  $("#left").animate({top: "-400px"},4500); // animate in the left part of the text
  $("#right").animate({top: "-200px"},4500); // animate in the right part of the text
  $("#pic").on("tap", function(){
    welcome_screen();
  })
}; // end of splash screen function --------------------------------------------

// the welcome screen function *************************************************

function welcome_screen()
{
  $(document).on("pagecreate","#welcomeScreen",function(){
    $("#welcomeText").fadeIn(2000,function(){
      $("#easy").fadeIn(1000,function(){
        $("#medium").fadeIn(1000,function(){
          $("#hard").fadeIn(1000);
        });
      });
    });
    $("#logo").fadeIn();
    $("#easy").on("tap",function(){
      diff_lev=1;
      knock.play();
      computeAndRender();
    });
    $("#medium").on("tap",function(){
      diff_lev=2;
      knock.play();
      computeAndRender();
    });
    $("#hard").on("tap",function(){
      diff_lev=3;
      knock.play();
      computeAndRender();
    });
  });
}; // end of welcome screen function -------------------------------------------
