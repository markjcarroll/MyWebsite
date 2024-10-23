document.addEventListener('DOMContentLoaded', () => {
    const cardImages = [
        '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍓', '🍓',
        '🍉', '🍉', '🍒', '🍒', '🍑', '🍑', '🍍', '🍍'
    ];

    let firstCard = null;
    let secondCard = null;
    let hasFlippedCard = false;
    let lockBoard = false;

    const gameBoard = document.getElementById('game-board');

    function shuffleCards() {
        const shuffledImages = cardImages.sort(() => 0.5 - Math.random());
        gameBoard.innerHTML = '';  // Clear the game board before adding new cards

        shuffledImages.forEach((image) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;

            // Create front and back faces for the card
            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face');
            frontFace.innerText = image;  // Set the emoji or content here

            const backFace = document.createElement('div');
            backFace.classList.add('back-face');

            card.appendChild(frontFace);  // Add front face to card
            card.appendChild(backFace);   // Add back face to card

            gameBoard.appendChild(card);  // Add card to the game board

            // Add click event to handle flipping of the cards
            card.addEventListener('click', flipCard);
        });
    }

    function flipCard() {
        if (lockBoard || this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
        } else {
            hasFlippedCard = false;
            secondCard = this;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
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
});
