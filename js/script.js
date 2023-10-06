//unordered list where player guesses appear
const guessList = document.querySelector(".guessed-letters");
//Guess button
const button = document.querySelector(".guess");
//player text input
const playInput = document.querySelector(".letter");
//empty paragraph where the word will appear
const mysteryWord = document.querySelector(".word-in-progress");
//paragraph where remaining guesses will display
const guessesRemaining  = document.querySelector(".remaining");
//span inside the paragraph where remaining guesses will display
const remainingGuessesSpan = document.querySelector(".remaining span");
//where messages will appear when the player guesses a letter
const message = document.querySelector(".message");
//hidden button that will prompt the player to play again
const hiddenButton = document.querySelector(".play-again");

let word = "magnolia";
const guessedLetters = [];
let remainingGuesses = 8;

const getWord = async function () {
    const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    wordPlaceholders(word);
  };

getWord();


const wordPlaceholders = function(word){
   const wordLetters = [];
   for (const letter of word){
       console.log(letter);
       wordLetters.push("●")
   }
    mysteryWord.innerText = wordLetters.join("");
};


button.addEventListener("click", function(e){
    e.preventDefault();
    message.innerText = "";
    const guess = playInput.value;
    const goodGuess = checkPlayerInput(guess);
    console.log(guess);

    if (goodGuess){
        makeGuess(guess)
    };
    playInput.value = ""; 
});

const checkPlayerInput = function(input){
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0){
        message.innerText = "Please enter a letter.";
    } else if (input.length > 1){
        message.innerText = "You can only guess one letter at a time. Please enter only one letter.";
    } else if (!input.match(acceptedLetter)){
        message.innerText = "Only letters are accepted. Please enter one letter.";
    } else {
        return input
    };
};

const makeGuess = function(guess){
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)){
        message.innerText = "You already guessed that letter. Please guess a different letter.";

    } else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        countRemainingGuesses(guess);
        showGuess();
        updateWordInProgress(guessedLetters);
    }
    
}

const showGuess = function(guess){
    guessList.innerHTML = "";
    for(const letter of guessedLetters){
        const li = document.createElement("li");
        li.innerText = letter;
        guessList.append(li);
    }
}

const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealWord = [];
    for (const letter of wordArray) {
      if (guessedLetters.includes(letter)) {
        revealWord.push(letter.toUpperCase());
      } else {
        revealWord.push("●");
      }
    }
    // console.log(revealWord);
    mysteryWord.innerText = revealWord.join("");
    checkWin();
  };

  const countRemainingGuesses = function(guess){
    const upperWord = word.toUpperCase();
    if (!upperWord.includes(guess)){
        message.innerText = `Sorry. The word has no ${guess}. Guess again.`;
        remainingGuesses -= 1;
    } else {
        message.innerText = `You guessed correctly! The word has the letter ${guess}.`

    };

    if (remainingGuesses === 0){
        message.innerHTML = `Sorry. You lose. The word was <span class = "highlight">${word}</span>.`;
        startOver();
        remainingGuessesSpan.innerText = "0 guesses";
    } else if (remainingGuesses === 1){
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`
    }
};


  const checkWin = function(guessedLetters){
      if (word.toUpperCase() === mysteryWord.innerText ){
          message.classList.add("win");
          message.innerHTML = `<p class = "highlight">You guessed the correct word! Congrats!</p>`;
          startOver();
      }
  };

  const startOver = function (){
        button.classList.add("hide");
        guessesRemaining.classList.add("hide");
        guessList.classList.add("hide");
        hiddenButton.classList.remove("hide");     
  };

  hiddenButton.addEventListener("click", function(){
      message.classList.remove("win");
      guessedLetters = [];
      remainingGuesses = 8;
      remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
      message.innerText = "";
      guessList.innerText = "";
    
      button.classList.remove("hide");
      guessesRemaining.classList.remove("hide");
      guessList.classList.remove("hide");
      hiddenButton.classList.add("hide");  
      getWord();
  })
