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
var bounds = false;
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
function moveRover(moveOption, rover) {
  preCoordY = rover.position[0];
  preCoordX = rover.position[1];

  switch (moveOption) {
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

  if (moveOption==="F" || moveOption==="B") {
    checkWarpBounds(rover);
    if (!validMovement(rover)) {
      rover.position[1] = preCoordX;
      rover.position[0] = preCoordY;
      if (rover.name === "R") {
        document.getElementById("msg").innerHTML= "Illegal Movement!!!";
        console.log("Illegal Movement!!!");
      }
    } else {
      myMap[preCoordY][preCoordX] = "*";
      if (rover.name === "R") {
        myMap[rover.position[0]][rover.position[1]] = rover.direction;
        console.log("New Rover Position: [" + rover.position[0] + ", " + rover.position[1] + "] faced to " + rover.direction);
        document.getElementById("msg").innerHTML = "New Rover Position: [" + rover.position[0] + ", " + rover.position[1] + "] faced to " + rover.direction;
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
  var i = 0;
  var id = setInterval(move, 250);
  function move() {
    if (i < commands.length) {
      moveRover(commands[i], myRover);
      i++;
    } else {
      clearInterval(id);
    }
  }
}

// Push a rover at ramdom position and direction
function landing(rover) {
  initMap (myMap);
  while (!placed) {
    rover.position[0] = Math.floor(Math.random() * 10);
    rover.position[1] = Math.floor(Math.random() * 10);
    if (myMap[rover.position[0]][rover.position[1]] === "*") {
      placed = true;
    }
  }
  rover.direction = "NSEW"[Math.floor(Math.random() * 4)];
  myMap[rover.position[0]][rover.position[1]] = rover.direction;
  printMap(myMap);
}

//Move the Rover with cursors
function getKeyChar (event){
  var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
  var userMove;
  //alert ("keyCode: " + event.keyCode + " Unicode charcode: " + chCode + " StringFrom charcode: "+ String.fromCharCode(chCode));
  switch (event.keyCode) {
    case 38: //up     keycode(70)=F
      userMove="F";
      break;
    case 40: //down   keycode(66)=B
      userMove="B";
      break;
    case 39: //right  keycode(82)=R
      userMove="R";
      break;
    case 37: //left   keycode(77)=L
      userMove="L";
      break;
    default:
      userMove = String.fromCharCode(chCode).toUpperCase();
      break;
  }
  moveRover(userMove, myRover);
}

//Warp movement at bounds
function checkWarpBounds(rover) {
  x = rover.position[1];
  y = rover.position[0];
  if (!bounds) {
    if (x<0) {
      rover.position[1] = 9;
    } else if (x>9) {
      rover.position[1] = 0;
    } else if (y<0) {
      rover.position[0] = 9;
    } else if (y>9) {
      rover.position[0] = 0;
    }
  }
}

/* Validate a movement */
function validMovement (rover) {
  x = rover.position[1];
  y = rover.position[0];
  return ( (((x>=0) && (x<10)) && ((y>=0) && (y<10))) && (myMap[y][x] === "*") ) ? true : false;
}

/* On-Off a random movement rover */
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
}

/* Init a empty map and place some obstacles */
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
      if (myMap[y][x] === "*") {
        myMap[y][x] = "X";
        console.log("obstacles"+i+": " + x + ","+ y);
        placed = true;
      }
    }
  }
}

//Draw map at console and browser
function printMap(map) {
  var consoleMap="";
  document.getElementById('surface').innerHTML = "";
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 10; j++) {
      if (myRover.position[0] === i && myRover.position[1] === j) {
        map[i][j] = myRover.direction;
        document.getElementById('surface').innerHTML += "<img id='"+myRover.name+"' src='images/" + myRover.name + myRover.direction + ".png' style='top: "+ (myRover.position[0] * 50) + "px ;left: "+(myRover.position[1] * 50)+ "px;'/>";
      } else if ((autoRover.position[0] === i && autoRover.position[1] === j) && autoRoverOn) {
        map[i][j] = autoRover.direction.toLowerCase();
        document.getElementById('surface').innerHTML += "<img id='"+autoRover.name+"' src='images/" + autoRover.name + autoRover.direction + ".png' style='top: "+ (autoRover.position[0] * 50) + "px ;left: "+(autoRover.position[1] * 50)+ "px;'/>";
      } else if (map[i][j] === "X") {
        document.getElementById('surface').innerHTML += "<img class='obstacle' style='top: "+ (i*50) +"px; left: "+ (j*50) +"px;' src='images/stone.png' alt=''/>";
      }
      consoleMap += map[i][j];
    }
    consoleMap += "\n";
  }
  console.log(consoleMap);
  document.getElementById('surface').innerHTML += '<div id="map"><pre>'+consoleMap+'</pre></div>';
}

/*Switch On-Off Bounds on Click*/
function switchBounds() {
  if (bounds) {
    bounds = false;
    document.getElementById('switchBounds').style.backgroundColor = "red";
  } else {
    bounds = true;
    document.getElementById('switchBounds').style.backgroundColor = "green";
  }
}
