var myRover = {
  name: 'R',
  position: [0,0],
  direction: 'N',
};

var autoRover = {
  name: "AI",
  position: [0,0],
  direction: 'N',
};

var autoRoverOn = false;

var myMap = [];

function goForward(rover) {
  switch(rover.direction) {
    case 'N':
      rover.position[0]--;
      break;
    case 'E':
      rover.position[1]++;
      break;
    case 'S':
      rover.position[0]++;
      break;
    case 'W':
      rover.position[1]--;
      break;
  }
}

function goBackward(rover) {
  switch(rover.direction) {
    case 'N':
      rover.position[0]++;
      break;
    case 'E':
      rover.position[1]--;
      break;
    case 'S':
      rover.position[0]--;
      break;
    case 'W':
      rover.position[1]++;
      break;
  }
}

function turnLeft(rover){
  switch(rover.direction) {
    case 'N':
      rover.direction = "W";
      break;
    case 'E':
      rover.direction = "N";
      break;
    case 'S':
      rover.direction = "E";
      break;
    case 'W':
      rover.direction = "S";
      break;
  }
}

function turnRight(rover){
  switch(rover.direction) {
    case 'N':
      rover.direction = "E";
      break;
    case 'E':
      rover.direction = "S";
      break;
    case 'S':
      rover.direction = "W";
      break;
    case 'W':
      rover.direction = "N";
      break;
  }
}

//Move a rover with options
function moveRover(moveOP, rover) {
  preY = rover.position[0];
  preX = rover.position[1];
  console.log("moveRover "+ moveOP);
  switch (moveOP) {
    case "F":
      goForward(rover);
      break;
    case "B":
      goBackward(rover);
      break;
    case "R":
      turnRight(rover);
      break;
    case "L":
      turnLeft(rover);
      break;
    default:
  }

  if (moveOP=="F" || moveOP=="B") {
    if (!validMovement(rover)) {
      rover.position[1] = preX;
      rover.position[0] = preY;
      console.log("Illegal Movement!!!");
    } else {
      myMap[preY][preX] = "*";
      if (rover.name == "R") {
        myMap[rover.position[0]][rover.position[1]] = rover.direction;
        console.log("New Rover Position: [" + rover.position[0] + ", " + rover.position[1] + "] faced to " + rover.direction);
      } else {
        myMap[rover.position[0]][rover.position[1]] = rover.direction.toLowerCase();
      }
      printMap(myMap);
    }
  } else {
    myMap[rover.position[0]][rover.position[1]] = rover.direction;
    printMap(myMap);
  }
}

//Run commands wrote at text field
function runCommands() {
  var commands = document.getElementById('commands').value.toUpperCase();
  console.log(commands);

  var i = 0;
  var id = setInterval(move, 250);
  function move() {
    if (i < commands.length) {
      console.log(commands[i]);
      moveRover(commands[i], myRover);
      i++;
    } else {
      clearInterval(id);
    }
  }
  console.log("fin");
}

// Push a rover at ramdom position and direction
function landing(rover) {
  initMap (myMap);
  while (!placed) {
    rover.position[0] = Math.floor(Math.random() * 10);
    rover.position[1] = Math.floor(Math.random() * 10);
    if (myMap[rover.position[0]][rover.position[1]] == "*") {
      placed = true;
    }
  }
  rover.direction = "NSEW"[Math.floor(Math.random() * 4)];
  myMap[rover.position[0]][rover.position[1]] = rover.direction;
  printMap(myMap);
}

//Move the Rover with cursors
function GetChar (event){
  var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
  var moveOp;
  //alert ("The Unicode character code is: " + chCode);
  //alert ("Opcion: " + event.keyCode + " " + String.fromCharCode(chCode));
  //moveOp = String.fromCharCode(chCode);
  switch (event.keyCode) {
    case 38: //up
      moveOp="F";
      break;
    case 40: //down
      moveOp="B";
      break;
    case 39: //right
      moveOp="R";
      break;
    case 37: //left
      moveOp="L";
      break;
    default:
      moveOp = String.fromCharCode(chCode).toUpperCase();
      break;
  }
  //console.log("charcode: " + String.fromCharCode(chCode) + "keycode" + event.keyCode)
  moveRover(moveOp, myRover);
}

//Illegal movement
function validMovement (rover) {
  x= rover.position[1];
  y= rover.position[0];

  if ( ((x>=0) && (x<10)) && ((y>=0) && (y < 10))) {
    if (myMap[y][x] == "*") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// On-Off a random movement rover
function switchAutoRover() {
  if (autoRoverOn) {
    myMap[autoRover.position[0]][autoRover.position[1]] = "*";
    autoRoverOn = false;
  } else {
    landing(autoRover);
    autoRoverOn = true;
    var id = setInterval(move, 250);
  }
  function move () {
    if (autoRoverOn) {
      moveRover("FBRL"[Math.floor(Math.random() * 4)], autoRover);
    } else {
      clearInterval(id);
    }
  }
  //var id = setInterval(move, 100);
  /*function move() {
    if (i < commands.length) {
      console.log(commands[i]);
      moveRover(commands[i], myRover);
      i++;
    } else {
      clearInterval(id);
    }
  }*/
}

//Init a empty map and place some obstacles
function initMap (myMap){
  for (i=0; i<10; i++) {
    myMap[i] = [];
    for (j=0; j<10; j++) {
      myMap[i][j] ="*";
    }
  }

  obstacles = 2;
  document.getElementById("surface").innerHTML= "";
  for (i=0; i<obstacles;i++) {
    placed = false;
    while (!placed) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      if (myMap[y][x] == "*") {
        myMap[y][x] = "X";
        console.log("obstacles"+i+": " + x + ","+ y);
        placed = true;
      }
    }
  }
}

//Draw map at console and browser
function printMap(map) {
  var sMap="";
  //CONSOLE
  /*
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 10; j++) {
      sMap += map[i][j];
    }
    sMap += "\n";
  }
  console.log(sMap);
  */
  //BROWSER
  document.getElementById('surface').innerHTML = "";
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 10; j++) {
      if (myRover.position[0] == i && myRover.position[1] == j) {
        map[i][j] = myRover.direction;
        sMap += myRover.direction;
        document.getElementById('surface').style.display = 'none';
        document.getElementById('surface').innerHTML += '<img id="R" src="" alt=""/>';
        document.getElementById("R").src = "images/R" + myRover.direction + ".png";
        document.getElementById("R").style.top = "" + (myRover.position[0] * 50) + "px";
        document.getElementById("R").style.left = "" + (myRover.position[1] * 50) + "px";
        document.getElementById('surface').style.display = 'block';
        console.log (myRover.position[0]+", "+myRover.position[1]);
      } else if ((autoRover.position[0] == i && autoRover.position[1] == j) && autoRoverOn) {
        map[i][j] = autoRover.direction.toLowerCase();
        sMap += autoRover.direction.toLowerCase();
        document.getElementById('surface').style.display = 'none';
        document.getElementById('surface').innerHTML += '<img id="AI" src="" alt=""/>';
        document.getElementById("AI").src = "images/AI" + autoRover.direction + ".png";
        document.getElementById("AI").style.top = "" + (autoRover.position[0] * 50) + "px";
        document.getElementById("AI").style.left = "" + (autoRover.position[1] * 50) + "px";
        document.getElementById('surface').style.display = 'block';
      } else if (map[i][j]=="X") {
        document.getElementById('surface').innerHTML += "<img class='obstacle' style='top: "+ (i*50) +"px; left: "+ (j*50) +"px;' src='images/stone.png' alt=''/>";
        sMap += map[i][j];
      } else {
        sMap += map[i][j];
      }
      //console.log(i,j, map[i,j]);
    }
    sMap += "\n";
  }
  console.log(sMap);
  //document.getElementById('map').innerHTML = '<pre>'+sMap+'</pre>';
  document.getElementById('surface').innerHTML += '<div id="map"><pre>'+sMap+'</pre></div>';
}
