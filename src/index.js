
/*Getting different elements for easy access later*/
var body = document.getElementById("body");
var contentArea = document.getElementById("content-area");
var buttonRow = document.getElementById("button-row");
var startButton = document.getElementById("start-button");
var howToButton = document.getElementById("how-to-button");
var howToCard = document.getElementById("how-to-card");
var endModal = document.getElementById("endGameModal");
var winModal = document.getElementById("winGameModal");
var newGameModalButtons = document.getElementsByClassName("newGameModalButton");
var closeModals = document.getElementsByClassName("close");
var gameInfo = document.getElementById("gameInfo");
var time = document.getElementById("time");
var flagSpan = document.getElementById("flags");
var levelSpan = document.getElementById("current-level");
var levelSelect = document.getElementById("level");


/*Initializing some variables*/
var gameTime = 0;         //Keeps track of how many seconds the game has been played
var flags;                //Keeps track of how many flags are left
var timerVar;             //Holds the timer variable, allows the timer to be started and stopped
var minesweeper;          //holds the minesweeper element, which is a table
var minesList;            //holds the list containing the ids of all the mines
var minesweeperBoard = [];//holds a 2D array containing the board. Used for holding the elements of each box and removing the event listeners
var boxes = [];           //keeps track of the boxes that are uncovered. Used to determine when one has won the game
var level;                //keeps track of game level selected
//holds the colors of the numbers depending on how many neighbors are mines
const COLORS = ["blue", "green", "darkred", "orangered", "purple", "teal", "magenta"]

const LEVEL_DICT = {"Easy": {"size": 10, "mines": 12, "pixels": "50px"}, "Medium": {"size": 16, "mines": 40, "pixels": "40px"},"Hard": {"size": 22, "mines": 100, "pixels": "30px"}}

/*Triggered after a new game is started following a previous game.*/
function newGame(){
  contentArea.removeChild(minesweeper); //removes the minesweeper board
  endModal.style.display = "none";      //closes the lose modal
  winModal.style.display = "none";      //closes the win modal
  clearInterval(timerVar);              //stops the timer
  setUpGame();
}


/*---------EVENT LISTENERS---------*/

for(i = 0; i < 2; i++){
  closeModals[i].addEventListener("click", function(){
    endModal.style.display = "none";    //closes the lose modal
    winModal.style.display = "none";    //closes the win modal
  })
  newGameModalButtons[i].addEventListener("click", newGame);
}

window.addEventListener("click", function(event){
  /*Closes the modal when you click anywhere outside of the modal on the web page*/
  if (event.target == endModal) {
    endModal.style.display = "none";
  }
  if (event.target == winModal) {
    winModal.style.display = "none";
  }
})

howToButton.addEventListener("click", function(){
  if(howToCard.style.display == "block"){
    howToCard.style.display = "none"
    howToButton.innerHTML = "How to Play"
  }else{
    howToCard.style.display = "block"
    howToButton.innerHTML = "Hide Instructions"
  }
})

startButton.addEventListener("click", function(){
  //Starts the game
  setUpGame();

  //Changes "Start" button to "New Game" button
  buttonRow.removeChild(startButton)
  newGameButton = document.createElement("button");
  newGameButton.innerHTML = "New Game"
  newGameButton.addEventListener("click", newGame);
  buttonRow.insertBefore(newGameButton, howToButton)
}) ;


function setUpGame(){
  /*Sets up the new minesweeper game*/

  //Creates the table. Intializes the boxes and minesweeperBoard arrays.
  minesweeper = document.createElement("table");
  minesweeper.classList.add("table");
  boxes=[]
  minesweeperBoard = [];
  level = levelSelect.value
  //adding elements to the board
  for(i = 0; i < LEVEL_DICT[level].size; i++){
    row = document.createElement("tr");
    minesweeperBoard.push([]);
    for(j = 0; j < LEVEL_DICT[level].size; j++){
      col = document.createElement("td")
      minesweeperBoard[i].push(col);
      coordinate = "" + i + "," + j             //creating the coordinate/id format
      col.setAttribute("id", coordinate)        //sets the id as the coordinate
      col.style.backgroundColor="gray";         //default background color is gray
      col.style.textAlign="center";
      col.style.height=LEVEL_DICT[level].pixels;
      col.style.width=LEVEL_DICT[level].pixels;
      col.addEventListener("click", onClick);   //adds board behavior for click event
      col.addEventListener("contextmenu",onContextMenu); //adds board behavior for contextmenu (right-click) event
      row.appendChild(col);                     //adds the child to the element
      boxes.push(coordinate);                   //adds coordinate to boxes
    }


    minesweeper.style.textAlign="center"
    minesweeper.style.margin="auto"
    minesweeper.style.padding="50px"
    minesweeper.appendChild(row);
  }
  minesList = addMines();                       //randomly determines which boxes will contain mines
  contentArea.append(minesweeper)               //adds board to web page

  gameTime = 0;                                 //initializes game time
  flags = LEVEL_DICT[level].mines;              //initializes flags
  timer();                                      //starts timer
  timerVar = setInterval(timer, 1000)           //sets timer interval
  flagSpan.innerHTML = "Flags Left: " +flags    //starts keeping track of flags
  levelSpan.innerHTML = "Current Level: "+level
}





function onClick(event){
  element = event["srcElement"]
  id = element["id"]
  console.log(id)

  if(element.style.backgroundColor != "yellow"){
    //checks if the box clicked is a mine, ends the game if so
    if (minesList.includes(id)){
      element.style.backgroundColor="red";
      endGame();
    }
    neighbors = findNeighbors(id);
    console.log(neighbors)
    if(element.style.backgroundColor == "lightgray") {
      if(numMines(neighbors) == numFlags(neighbors)) {
        console.log("CLICKED");
        // for(i = 0; i < neighbors.length; i++) {
        //   r = neighbors[i][0];
        //   c = neighbors[i][2];
        //   checkNeighbors(findNeighbors(neighbors[i]), minesweeperBoard[r][c], neighbors[i]);
        // }
        checkNeighbors(neighbors, element, id);
      }
    }
    //checks the neighbors if not a mine. checks if there are boxes left. if not, you win.
    else{
      checkNeighbors(neighbors,element, id)
      if (boxes.length ==0) {
        winGame();

      }
    }
  }
}

function onContextMenu(event){
  //removes flag if already flagged, adds flag if not flagged. changes number of flags left accordingingly
  element = event["srcElement"]
  if(element.style.backgroundColor=="gray"){
    flags-=1
    element.style.backgroundColor="yellow";
  }else if(element.style.backgroundColor=="yellow"){
    flags+=1
    element.style.backgroundColor="gray";
  }
  flagSpan.innerHTML = "Flags Left: " +flags
  event.preventDefault();           //prevents the context menu from appearing
}

function timer(){
  //Increments the time every time called. Changes the timer on the web page
  gameInfoString = "Time Past: "+ gameTime +" s";
  time.innerHTML= gameInfoString
  gameTime +=1;
}


function clearEventListeners(){
  //removes the event listeners from the board to prevent further game play following the end of the game
  for(i = 0; i < LEVEL_DICT[level].size; i++){
    for(j = 0; j < LEVEL_DICT[level].size; j++){
      element =minesweeperBoard[i][j];
      element.removeEventListener("click", onClick);
      element.removeEventListener("context-menu", onContextMenu);
      //Makes board "deactivated"
      element.style.opacity="0.5"
    }
  }
}

function addMines(){
  //Randomly determines which boxes are mines.
  mines = []
  while(mines.length <LEVEL_DICT[level].mines){
    i = Math.floor(Math.random() * LEVEL_DICT[level].size);
    j = Math.floor(Math.random() * LEVEL_DICT[level].size);
    coord = "" + i + "," + j
    if (!mines.includes(coord)){
      mines.push(coord);
      boxes.splice(boxes.indexOf(coord), 1);
    }
  }
  return mines;
}

function endGame(){
  //ends the game following a loss
  clearEventListeners();
  minesList.forEach(function(id){
    element = document.getElementById(id);
    element.style.backgroundColor = "red"
  })
  endModal.style.display = "block";
  clearInterval(timerVar)
}

function winGame(){
  //ends the game following a win
  clearEventListeners()
  winModal.style.display = "block";
  clearInterval(timerVar)
}

function numMines(neighbors){
  //counts the number of mines in a list of neighboring boxes
  numNeighbors = 0
  for(i = 0; i < neighbors.length; i++){
    neighbor = neighbors[i]
    if (minesList.includes(neighbor)){
      numNeighbors+=1;
    }
  }
  return numNeighbors;
}

function numFlags(neighbors) {
  numNeighborFlags = 0;
  for(i = 0; i < neighbors.length; i++) {
    r = neighbors[i][0];
    c = neighbors[i][2];
    // console.log(minesweeperBoard[r][c])
    // console.log(minesweeperBoard[r][c].style.backgroundColor)
    if (minesweeperBoard[r][c].style.backgroundColor == "yellow") {
      // console.log("flag")
      numNeighborFlags+=1;
    }
  }
  return numNeighborFlags;
}

class MySet{
  /*Set object created for convenience*/
  values;
  size;

  constructor(){
    this.values = new Array();
    this.size = 0;
  }
  add(value){
    if(this.values.indexOf(value) == -1){
      this.values.push(value);
    }
    this.size = this.values.length
  }
  remove(value){
    values.splice(values.indexOf(value), 1);
    size = values.length
  }
  pop(){
    let val = this.values.shift(0);
    this.size = this.values.length
    return val;
  }
  forEach(func){
    for(i = 0; i < size; i++){
      func(values(i));
    }
  }
  has(val){
    return this.values.indexOf(val)!= -1
  }
}



function changeBox(element, num, id){
  //Changes the box according to the number of mines next to it
  if(element.style.backgroundColor != "yellow") {
    element.style.backgroundColor = "lightgray"
    if(num != 0){
      element.style.color = COLORS[num]
    }
    element.innerHTML = num == 0 ? "" : num;
    element.style.height = LEVEL_DICT[level].pixels;
    element.style.width = LEVEL_DICT[level].pixels;
    //Removes the ID from the list of covered boxes
    let index = boxes.indexOf(id)
    if (index != -1){
      boxes.splice(index, 1)
    }
  }
  
}

function checkNeighbors(neighbors, element, id){
  console.log(id);
  let numNeighbors = numMines(neighbors);
  changeBox(element, numNeighbors,id);
  //reveals all surrounding boxes if a box has no mines surrounding it
  if(numNeighbors == 0){
    surrounding = new MySet();      //keeps track of neighboring boxes
    neighbors.forEach(function(n){
      surrounding.add(n);
    })
    checked = new MySet()           //keeps track of boxes that have already been checked
    //Until no neighbors have been checked, loops through all the neighboring boxes
    while(surrounding.size > 0){
      let nextId = surrounding.pop();
      let myNeighbors = findNeighbors(nextId);
      let numNextMines = numMines(myNeighbors);
      changeBox(document.getElementById(nextId), numNextMines, nextId);
      if (numNextMines == 0){
        //adds neighboring boxes to surrounding if they haven't already been checked
        myNeighbors.forEach(function(val){
          if(!checked.has(val)){
            surrounding.add(val)
          }
        })
        checked.add(nextId);
      }
    }
  }
  else if(numNeighbors == numFlags(neighbors)) {
    surrounding = new MySet();      //keeps track of neighboring boxes
    neighbors.forEach(function(n){
      surrounding.add(n);
    })
    checked = new MySet()           //keeps track of boxes that have already been checked
    //Until no neighbors have been checked, loops through all the neighboring boxes
    while(surrounding.size > 0){
      let nextId = surrounding.pop();
      let myNeighbors = findNeighbors(nextId);
      let numNextMines = numMines(myNeighbors);
      changeBox(document.getElementById(nextId), numNextMines, nextId);
      if (numNextMines == 0){
        //adds neighboring boxes to surrounding if they haven't already been checked
        myNeighbors.forEach(function(val){
          if(!checked.has(val)){
            surrounding.add(val)
          }
        })
        checked.add(nextId);
      }
    }
  }
}



function findNeighbors(id){
  /*Finds the neighboring boxes given a box*/
  let id_vals = id.split(",")
  r = parseInt(id_vals[0])
  c = parseInt(id_vals[1])
  neighbors = []
  for(i = -1; i < 2; i++){
    for (j = -1; j < 2; j++){
      rn = r + i;
      cn = c + j;
      neighbor = ""+rn+","+cn
      if (neighbor!= id && rn >= 0 && rn <LEVEL_DICT[level].size && cn >= 0 && cn<LEVEL_DICT[level].size){
        neighbors.push(neighbor)
      }
    }
  }
  return neighbors
}
