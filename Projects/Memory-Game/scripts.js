document.addEventListener('DOMContentLoaded', () => {
    const cardImages = [
        '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍓', '🍓',
        '🍉', '🍉', '🍒', '🍒', '🍑', '🍑', '🍍', '🍍'
    ];

    let firstCard = null;
    let secondCard = null;
    let hasFlippedCard = false;
    let lockBoard = false;
    let moveCount = 0;
    const numberOfPairs = cardImages.length / 2;

    let lastGames = JSON.parse(localStorage.getItem('last-games')) || [];

    let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : Infinity; 

    // Function to display game stats (last 4 games and best score)
    function displayGameStats() {
        if (lastGames.length > 0) {
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

    // Function to store the result of the current game
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

    // Function to check if the game is over
    function checkGameEnd() {
        const allCardsMatched = document.querySelectorAll('.card.matched').length === numberOfPairs * 2;
        if (allCardsMatched) {
            setTimeout(() => {
                alert(`Congratulations! You completed the game in ${moveCount} moves!`);
                endGame(); // Call the end game function after the delay
            }, 400); // Adjust the delay as needed based on your flip animation duration

        }
    }

    const gameBoard = document.getElementById('game-board');

    // Function to shuffle and display cards
    function shuffleCards() {
        const shuffledImages = cardImages.sort(() => 0.5 - Math.random());
        gameBoard.innerHTML = '';

        shuffledImages.forEach((image) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;

            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face');
            frontFace.innerText = image;

            const backFace = document.createElement('div');
            backFace.classList.add('back-face');

            card.appendChild(frontFace);
            card.appendChild(backFace);

            gameBoard.appendChild(card);

            card.addEventListener('click', flipCard);

            moveCount = 0;
            document.getElementById('move-counter').innerText = `Moves: ${moveCount}`;
        });
    }

    // Function to handle card flipping
    function flipCard() {
        if (lockBoard || this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
        } else {
            hasFlippedCard = false;
            secondCard = this;
            incrementMoveCount();
            checkForMatch();
        }
    }

    // Check if the two flipped cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            disableCards();
            checkGameEnd();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    document.getElementById('restart').addEventListener('click', shuffleCards);

    shuffleCards();
    displayGameStats();  // Show stats when the game is first loaded
});
