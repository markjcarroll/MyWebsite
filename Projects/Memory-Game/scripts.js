document.addEventListener('DOMContentLoaded', () => {
    // Array of card images, with each pair represented twice
    const cardImages = [
        '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍓', '🍓',
        '🍉', '🍉', '🍒', '🍒', '🍑', '🍑', '🍍', '🍍'
    ];

    // Variables for tracking the first and second flipped cards
    let firstCard = null;
    let secondCard = null;
    let hasFlippedCard = false;
    let lockBoard = false; // Prevents further clicks when cards are flipped
    let moveCount = 0;
    const numberOfPairs = cardImages.length / 2;

    // Retrieve and parse stats from localStorage
    let lastGames = JSON.parse(localStorage.getItem('last-games')) || [];
    let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : Infinity; 

    // Function to display game stats (last 4 games and best score)
    function displayGameStats() {
        if (lastGames.length > 0) {
             // Update best score if a new lowest score is achieved
            if(Math.min(...lastGames)<bestScore) {
            bestScore = Math.min(...lastGames);
            localStorage.setItem('bestScore', bestScore); // Save best score to localStorage
            }
            document.getElementById('best-score').innerText = `Best Score: ${bestScore} moves`;
        } else {
            document.getElementById('best-score').innerText = `Best Score: N/A`;
        }

        // Display the moves from the last 4 games
        const lastGamesText = lastGames.map((moves) => ` ${moves} moves`).join(" \n ");
        document.getElementById('last-games').innerText = 'Last 4 Games:\n' + lastGamesText|| 'Last 4 games: N/A';
    }

    // Function to update and display move count
    function incrementMoveCount() {
        moveCount++;
        document.getElementById('move-counter').innerText = `Moves: ${moveCount}`;
    }

    // Function to store and display the result of the current game
    function endGame() {
        lastGames.push(moveCount);

        // Keep only the last 4 games
        if (lastGames.length > 4) {
            lastGames.shift();
        }

        localStorage.setItem('last-games', JSON.stringify(lastGames));

        // Display the updated stats
        displayGameStats();

        // Reset move count for the next game
        moveCount = 0;
        document.getElementById('move-counter').innerText = `Moves: ${moveCount}`;
    }

    // Function to check if all cards have been matched (game end)
    function checkGameEnd() {
        const allCardsMatched = document.querySelectorAll('.card.matched').length === numberOfPairs * 2;
        if (allCardsMatched) {
            setTimeout(() => {
                alert(`Congratulations! You completed the game in ${moveCount} moves!`);
                endGame(); // Save game data after completion
            }, 400); // Delay to allow flip animation to complete

        }
    }

    const gameBoard = document.getElementById('game-board');

    // Function to shuffle and display cards
    function shuffleCards() {
        const shuffledImages = cardImages.sort(() => 0.5 - Math.random());
        gameBoard.innerHTML = ''; // Clear existing cards

        shuffledImages.forEach((image) => {
            // Create card element with front and back faces
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;

            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face');
            frontFace.innerText = image;

            const backFace = document.createElement('div');
            backFace.classList.add('back-face');

            // Add front and back faces to the card
            card.appendChild(frontFace);
            card.appendChild(backFace);
            gameBoard.appendChild(card);

            // Add click event listener for flipping the card
            card.addEventListener('click', flipCard);

            // Reset move count on new shuffle
            moveCount = 0;
            document.getElementById('move-counter').innerText = `Moves: ${moveCount}`;
        });
    }

    // Function to handle card flipping
    function flipCard() {
        if (lockBoard || this === firstCard) return; // Prevent flipping the same card twice

        this.classList.add('flipped');

        // Check if it's the first card flipped
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
        } else {
            hasFlippedCard = false;
            secondCard = this;
            // When second card is flipped, increment moveCount and check for a match
            incrementMoveCount();
            checkForMatch();
        }
    }

    // Check if the two flipped cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            disableCards(); // Lock matched cards
            checkGameEnd(); // Check if game is over
        } else {
            unflipCards(); // Flip cards back if not a match
        }
    }

    // Function to disable matched cards
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    // Function to unflip cards if they don't match
    function unflipCards() {
        lockBoard = true; // Lock board to prevent additional clicks
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard(); // Reset board state for the next turn
        }, 1000); // Flip back after delay
    }

    // Reset board state for the next turn
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Restart button event listener to shuffle cards and reset stats
    document.getElementById('restart').addEventListener('click', shuffleCards);

    // Initial game setup
    shuffleCards();
    displayGameStats();  // Show stats when the game is first loaded
});
