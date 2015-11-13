
<!--
bolt:
http://www.freesfx.co.uk/rx2/mp3s/1/941_1245800589.mp3

music
https://machinimasound.com/music/mood/epic/
-->

<html>

<head>
<title>Scroll Quest</title>

  <style>
    body {
      margin: 0px;
      background-color: black;
      height: 0px;
      color: white;
    }
    #scroll_objects > div{
      position: absolute;
      font-size: 50;
      font-family: Arial;
    }
    #box1{
      background-color: red;
      width: 100px;
      height: 100px;
    }
    #box2{
      background-color: green;
      width: 50px;
      height: 200px;
    }
    .text1, .text2, .text3, .text5 {
      color: white;
    }
    .text4{
      color: red;
    }
    #navbar {
      width: 100%;
      position: fixed;
      margin: 10px;
      height: 200px;
      background-color: yellow;
      z-index: -2;
    }
    .text {
    }
  </style>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script>
  var scroll_objects = [];
  var scroll_moves = [];
  var sounds = [];
  var global_speed = 1;
  $( document ).ready(function() {
    reset();
  });
  $(window).scroll(function (event) {
    //This function controls the position of each character based on their moves.
    //It adds up all previous moves, as well as applies the current move to get the final position.
      var scroll = $(window).scrollTop();
      var i = 0;
      for(j = 0; j < scroll_objects.length; j++){
        scroll_objects[j].left = 0;
        scroll_objects[j].top = 0;
      }
      for(i = 0; i < scroll_moves.length; i++){
        var current_move = scroll_moves[i];
        var scroll_ammount = 0;
        var start_y = global_speed *  current_move.startY;
        var end_y = global_speed *  current_move.endY;
        if(i == scroll_moves.length - 1 && end_y <= scroll) {
          end_of_page();
        }
        if (scroll > start_y){
            scroll_ammount = scroll - start_y;
        }
        if(scroll > end_y) {
            scroll_ammount = end_y - start_y;
        }
        var j = 0;
        for(j = 0; j < scroll_objects.length; j++){
          if(scroll_objects[j].scroll_name == current_move.elementID) {
            scroll_objects[j].left += current_move.scrollX * scroll_ammount;
            scroll_objects[j].top += current_move.scrollY * scroll_ammount;
          }
        }
      }

      update();
  });
  function update() {
    var scroll = $(window).scrollTop();
    var j = 0;
    for(j = 0; j < scroll_objects.length; j++){
      document.getElementById(scroll_objects[j].scroll_name).style.top = scroll_objects[j].startY + scroll_objects[j].top + scroll;
      document.getElementById(scroll_objects[j].scroll_name).style.left = scroll_objects[j].startX + scroll_objects[j].left;
    }
    for(var i = 0; i < sounds.length; i++)
    {
      if(sounds[i].ready == true && sounds[i].play_y <= scroll)
      {
        var audio = new Audio(sounds[i].file_name);
        audio.play();
        sounds[i].ready = false;
      }
      else if(sounds[i].play_y > scroll)
      {
        sounds[i].ready = true;
      }
    }
  }
  function reset() {
    var y = 300;
    var windowHeight = window.innerHeight;
    document.body.style.height = 0 + "px";
    scroll_objects = [];
    scroll_moves = [];
    load_moves();
    var max = scroll_moves[0].endY;
    for(var i = 1; i < scroll_moves.length; i++) {
      if(scroll_moves[i].maxY > max) {
        max = scroll_moves[i].maxY;
      }
    }
    document.body.style.height = windowHeight + max + 10000 + "px";
    update();
  }
  function load_moves() {
    var windowHeight = window.innerHeight;
    /*
    new_scroll_object("box1", "box", "hi", 200, 200);
    new_scroll_object("box2", "box", "yo", 100, 100);
    //  function new_text_object(scroll_object_name, text, start_x_pos, start_y_pos, x_dist) {
    */
    new_text_object("text1", "One man . . .", -600, 100, 40);
    add_text_move("text1", "One man . . .", 0, 200, 4, 2, 10);
    add_text_move("text1", "One man . . .", 350, 550, 0, -10, 0);
    new_text_object("text2", "One planet . . .", -600, 100, 40);
    add_text_move("text2", "One planet . . .", 450, 650, 4, 2, 10);
    add_text_move("text2", "One planet . . .", 900, 1000, 0, -10, 0);
    new_text_object("text3", "One", -600, 100, 40);
    add_text_move("text3", "One", 900, 1100, 4, 2, 10);
    add_text_move("text3", "One", 1250, 1450, 0, -10, 0);
    //add_sound("roar.mp3", 1500);
    new_text_object("text4", "Trillion Dinosaurs", -800, 100, 40);
    add_text_move("text4", "Trillion Dinosaurs", 1350, 1550, 4, 2, 10);
    add_text_move("text4", "Trillion Dinosaurs", 1800, 2000, 0, -10, 0);
    new_text_object("text5", "Justin vs. Dinosaurs", -1000, 100, 50);
    add_text_move("text5", "Justin vs. Dinosaurs", 2000, 2100, 10, 0, 20);
    add_text_move("text5", "Justin vs. Dinosaurs", 3000, 3200, -10, 0, 15);
    add_sound("bolt.mp3", 2000);
  //  add_text_move(scroll_object_name, text, startY, endY, scrollX, scrollY, wait)
    add_move("box1", 0, 100, 5, 0);
    add_move("box1", 0, 100, 5, 0);
  }
  function add_sound(file_name_, play_y_)
  {
    sounds.push(
      {
          file_name: file_name_,
          play_y: play_y_,
          ready: false
      }
    );
  }
  function new_scroll_object(scroll_object_name, scroll_object_class, inner_html_, start_x_pos, start_y_pos){
    scroll_objects.push( {
      scroll_name: scroll_object_name,
      scroll_class: scroll_object_class,
      inner_html: inner_html_,
      startX: start_x_pos,
      startY: start_y_pos,
      top: 0,
      left: 0
    });
    document.getElementById("scroll_objects").innerHTML += "<div id='"
                                                        + scroll_object_name
                                                        + "' class='" + scroll_object_class + "'>" + inner_html_
                                                        + "</div>";
  }
  function add_move(elementID_, startY_, endY_, scrollX_, scrollY_){
    add_move(elementID_, "newObj", startY_, endY_, scrollX_, scrollY_);
  }
  function add_move(elementID_, startY_, endY_, scrollX_, scrollY_){
    scroll_moves.push({
      elementID: elementID_,
      startY: startY_,
      endY: endY_,
      scrollX: scrollX_,
      scrollY: scrollY_
    });
  }
  function new_text_object(scroll_object_name, text, start_x_pos, start_y_pos, x_dist) {
    for(var i = 0; i < text.length; i++){
      new_scroll_object(scroll_object_name + i.toString(), scroll_object_name, text.charAt(i), start_x_pos + i * x_dist, start_y_pos);
    }
  }
  function add_text_move(scroll_object_name, text, startY, endY, scrollX, scrollY, wait) {
    for(var i = 0; i < text.length; i++){
      add_move(scroll_object_name + i.toString(), startY + i * wait, endY + i * wait, scrollX, scrollY)
    }
  }
  function end_of_page() {
  }
  </script>

</style>

</head>


<body>

  <audio controls autoplay style="display:none">

   <source src="epic_music.mp3" type="audio/mpeg">
 Your browser does not support the audio element.
 </audio>

  <div id="scroll_objects">


  </div>


</body>

</html>
