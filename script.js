//GENERAL CONSTANTS TO MANIPULATE WOTD
const NUMBER_OF_GUESSES = 6;
let wordOfTheDay = '';
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;


//Set a timer so that the Actor of the day is updated every day at midnight

const now = new Date();
const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    0, 0, 0 // ...at 00:00:00 hours
);
const msTillMidnight = night.getTime() - now.getTime();

function resetActor() {
    wordOfTheDay = ''
    currentGuess = [];
    nextLetter = 0;
    guessesRemaining = NUMBER_OF_GUESSES;
    document.querySelector('#game-board').innerHTML = ''
}

//setTimeout("resetActor()', 3000")

// Get the Word of the day from the backend route

function getActor() {
    fetch('http://localhost:3000/person/popular')
        .then(response => response.json())
        .then(data => {
            wordOfTheDay = data.actor.toUpperCase();
            return wordOfTheDay;
        })
}

setInterval(getActor(), 3000);

    

//create the board when the New Game button is clicked

document.querySelector('#newGame').addEventListener('click', function(e) {
    //resetting the parameters
        currentGuess = [];
        nextLetter = 0;
        guessesRemaining = NUMBER_OF_GUESSES;
        document.querySelector('#game-board').innerHTML = ''
    
        //console.logging the word of the day for debugging purposes
        console.log(wordOfTheDay)
        const wordLetters = wordOfTheDay.split('');

        //creating the board itself
        let letterBoxs  =[]; 
        wordLetters.map((letter, i) => {
            if (letter.trim().length === 0 ) {
                letterBoxs += 
                `<div class = "empty-box"> </div>`
                
            }
            else if(wordLetters[0] === letter[i] || wordLetters[i-1].trim().length === 0) {
                letterBoxs +=
                `<div class = "filled-box letter-box first-letter">${wordLetters[i]}</div>`
            }

            else {
                letterBoxs += '<div class = "letter-box"> </div>'
            }
        })


        for (let i = 0 ; i < 6 ; i ++) {
            
            document.querySelector('#game-board').innerHTML += `
            <div class = 'letter-row'>
            ${letterBoxs}
            </div>
            `

        }        

        e.target.blur()
    }
        
    )

    userInput()
// General function to handle the keys pressed by user, from the first letter to the final entry

    function userInput() {

    document.addEventListener('keyup', (e) => {

        if (guessesRemaining === 0) {
            return
        }

        let pressedKey = String(e.key)
        if (pressedKey === 'Backspace' && nextLetter !== 0) {
            deleteLetter()
            return
        }

        if (pressedKey === "Enter") {
            checkGuess()
            return
        }

        let found = pressedKey.match(/[a-z]/gi)
        if (!found || found.length > 1) {
            return;
        }
        else {
            insertLetter(pressedKey)
        }

        }
    )}
    
        //Insert letter function to make sure each letter goes in the right box
        
        function insertLetter (pressedKey) {
            let length = wordOfTheDay.trim().length;
            //if the user has already enter enough letters, do not accept any more guess
            if (nextLetter === length +1) {
                return
            }

            pressedKey = pressedKey.toUpperCase()

            let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
            let box = row.children[nextLetter];

            if (box.className == "empty-box" || box.className == "filled-box letter-box first-letter" ) {

                if (box.className == "empty-box") {
                    row.children[nextLetter+2].textContent = pressedKey
                    row.children[nextLetter+2].classList.add('filled-box');
                    currentGuess.push(' ');
                    currentGuess.push(row.children[nextLetter+1].textContent, pressedKey);
                    nextLetter+=3;
                }
                
                else {  
                console.log(nextLetter);
                currentGuess.push(row.children[nextLetter].textContent);
                row.children[nextLetter+1].textContent = pressedKey;
                row.children[nextLetter+1].classList.add('filled-box');
                currentGuess.push(pressedKey);
                nextLetter+=2;
                return
                }
            }

            else {
            box.textContent = pressedKey
            box.classList.add('filled-box')
            currentGuess.push(pressedKey)
            nextLetter ++
            }
            
        }
    
        // In case the user press the delete key, this function deletes the last guess

        function deleteLetter() {

            let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
            let box = row.children[nextLetter - 1]
            let previousBox = row.children[nextLetter - 2];
            console.log(nextLetter);
            console.log(currentGuess.length);

            if (currentGuess.length === 2) {
                nextLetter --;
                console.log("d??but du mot");
                row.children[1].textContent = ''
                currentGuess.pop()
                return
            }
            
            
            else if (previousBox.className == "filled-box letter-box first-letter") {
                box.textContent = ''
                box.classList.remove('filled-box')
                currentGuess.pop()
                currentGuess.pop()
                currentGuess.pop()
                nextLetter = nextLetter -3;
                
            }
            
            else {
                box.textContent = ''
                box.classList.remove('filled-box')
                currentGuess.pop()
                nextLetter --
            }
        }

        //Finally, when the user has enter enough letters and press the enter key, this function check if each letter matches the corresponding letter of the WordofTheDay, and changes the color of the box.

        function checkGuess() {

            let row = document.querySelectorAll(".letter-row")[6 - guessesRemaining]
            let guessString = '';
            let rightGuess = wordOfTheDay;

            //join the guessed letters into the guess Word
            for (const letter of currentGuess) {
                guessString += letter
            }
            console.log(guessString)

            //if the player presses enter without having guessed enough letters, display an alert

            if (guessString.length != rightGuess.length) {
                

                document.querySelector('#result').textContent = 'Not enough letters !'
                return
            }

            //loop through the array of guessed letters, and assign each one the corresponding color
            for (let i = 0 ; i < wordOfTheDay.length ; i++) {
                let letterColor = ''
                let box = row.children[i]
                let letter = currentGuess[i]
                let letterPosition = rightGuess.indexOf(currentGuess[i])
                
                if (box.className === 'empty-box') {
                    continue;
                }

                //if the letter is not part of the correct word
                else if (letterPosition === -1 ) {
                    letterColor = 'grey'
                    
                }

                //if the letter is part of the word:
                else  {
                //if the letter is in the right position
                    if (currentGuess[i] === rightGuess[i]) {
                        letterColor = 'green'

                    }
                //otherwise, the letter is in the word but not at the right position
                    else {
                        letterColor = 'yellow'
                    }

                    rightGuess[letterPosition] = '#'
                }
                
                //apply the colors we've just determined, with a slight delay
                let delay = 250 * i
                setTimeout(() => {
                    box.style.background = letterColor
                }, delay)
            }

            //check if it's the same as the wordOfTheDay. If it's not, deprecate the guessesRemaining and empty the currentGuess array.

            if (guessString === wordOfTheDay) {
                document.querySelector('#result').textContent = 'YOU WON!'
                guessesRemaining = 0;
                return
            }

            else {
                guessesRemaining--;
                currentGuess = [];
                nextLetter = 0;
            }

            //if there is no guessesRemaining, it means the player has run out of guess and it's Game Over.

            if (guessesRemaining===0) {
                document.querySelector('#result').textContent = 'GAME OVER'
            }
        }

