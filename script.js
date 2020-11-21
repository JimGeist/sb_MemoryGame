// Memory Game
// X  1. clicking a card changes the background color to the color of its class
// X  2. users can only change (see) two cards at a time
// X  3. cards with matching classes are a match and remain face up (probably no
//       longer clickable / remove the event from the div)
// ?  4. the 2 non-matching cards remain visible for at least 1 second before the
//       color is removed (use a setTimeout so code executes after one second)
// X  5. Clicking the same card should not count as a match
//    6. Make sure quick clicking of cards will not show more than 2 cards at a
//       time
//    7. Add a button that when clicked will start the game
//    8. Add a button that when clicked will restart the game once it has ended
// X  9. For every guess made, increment a score variable that is displayed while
//       the game is in play.
// X 10. Store the lowest number game in localStorage
//   11. Allow for any number of cards to appear.
//   12. Instead of hard-coding colors, try something different like random colors
//       or images.

const gameContainer = document.getElementById("game");
const gameScore = document.getElementById("score-yours");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// hold the score and first selections
let gameCards = '';
//let gameScore = '';
let divSelectedFirst = '';
let nbrOfMatches = 0;
let nbrScoreYours = 0;
let nbrScoreLow;
let gameUnlocked = true;

function gameReset() {

  // reset fields to prepare for a new game.
  gameCards = document.querySelectorAll("div");
  divSelectedFirst = '';
  nbrScoreYours = 0;
  //gameScore = document.getElementById("score-yours");
  gameScore.innerText = nbrScoreYours;
  gameUnlocked = true;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function clearCardColor(inCard1, inCard2) {

  // function removed the color from selected cards passed 
  //  in via parameters inCard1, inCard2
  inCard1.style.backgroundColor = "";
  inCard2.style.backgroundColor = "";

  inCard1 = '';
  inCard2 = '';

  gameUnlocked = true;

}


// TODO: Implement this function!
function handleCardClick(inEvt) {
  // you can use event.target to see which element was clicked
  console.log("you just clicked", inEvt.target);
  //console.log(inEvt);

  // 1. clicking a card changes the background color to the color of its class
  // 2. users can only change (see) to cards at a time
  // 3. cards with matching classes are a match and remain face up (probably no
  //  longer clickable / remove the event from the div)
  // 4. the 2 non-matching cards remain visible for at least 1`second before the
  //  color is removed (use a setTimeout so code executes after one second)

  if (gameUnlocked) {
    // user can pick at most 2
    if (divSelectedFirst) {
      // truthy true
      // make sure card is not already selected by checking backGround color

      if (inEvt.target.style.backgroundColor.length == 0) {
        // background color is not set -- this card has not been selected
        //  for the current turn.

        // we have 2 selections (one saved in divSelectedFirst) and the current
        //  one in inEvt

        nbrScoreYours += 1;
        gameScore.innerText = nbrScoreYours;

        // Show the color of the second selection
        inEvt.target.style.backgroundColor = inEvt.target.classList[0];

        // tried to check for match via divsSelected[0].classList === inEvt.target.classList 
        //  AND no and divsSelected[0].classList[0] === inEvt.target.classList[0] looked ugly
        //  The array approach was dropped because the overhead of an arry when only one element
        //  is stored is not needed. 

        // The assumption is that class will ONLY contain a color. 
        if (divSelectedFirst.classList[0] === inEvt.target.classList[0]) {
          // they match
          console.log("match");

          // remove the click event from both divs to prevent them from
          //  use in the game.
          divSelectedFirst.removeEventListener("click", handleCardClick);
          inEvt.target.removeEventListener("click", handleCardClick);

          nbrOfMatches += 1;

          // Is the game over?
          if (!((nbrOfMatches * 2) < COLORS.length)) {
            // the game is over because the number of matches * 2 is equal to the 
            // number of colors.
            console.log("game over");
            if (nbrScoreLow) {
              if (nbrScoreYours < nbrScoreLow) {
                nbrScoreLow = nbrScoreYours
              }

            } else {
              // falsey because nbrScoreLow is undefined.
              // set it to the current score.
              nbrScoreLow = nbrScoreYours;
            }

            localStorage.setItem("scoreLow", `${nbrScoreLow}`);

            document.getElementById("score-low").innerText = nbrScoreLow;

          }

        } else {
          // for now, no match, flip them back. We'll deal with delay later
          console.log("no match");

          // lock the board so a new selection cannot happen until the two 
          //  cards just selected are cleared.
          gameUnlocked = false;

          // remove the color and reset gameUnlocked
          setTimeout(clearCardColor, 1000, divSelectedFirst, inEvt.target);

        }

        // clear the first selected div
        divSelectedFirst = '';

      }

    } else {
      // This is the first selection
      divSelectedFirst = inEvt.target;
      // set the background color
      inEvt.target.style.backgroundColor = inEvt.target.classList[0];
    }
  }
}

// when the DOM loads
document.addEventListener("DOMContentLoaded", function (inEvt) {
  createDivsForColors(shuffledColors);
  gameReset();

  let scoreLow = localStorage.getItem("scoreLow");
  if (parseInt(scoreLow, 10)) {
    // localStorage had scoreLow, and it is a number.
    nbrScoreLow = parseInt(scoreLow, 10);

    document.getElementById("score-low").innerText = nbrScoreLow;
  }

});



