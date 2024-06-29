document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("gameContainer");
    const startButton = document.getElementById("startButton");
    const welcomeModal = document.getElementById("welcomeModal");
    const gameOverModal = document.getElementById("gameOverModal");
    const nicknameInput = document.getElementById("nicknameInput");
    const circleColorInput = document.getElementById("circleColorInput");
    const restartButton = document.getElementById("restartButton");
    const clickSound = document.getElementById("clickSound");
    const missSound = document.getElementById("missSound");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const finalScore = document.getElementById("finalScore");
    const livesContainer = document.getElementById("livesContainer");
    const volumeControl = document.getElementById("volumeControl");
    const pauseButton = document.getElementById("pauseButton");
    let playerName = "";
    let score = 0;
    let misses = 0;
    const maxMisses = 5;
    let lastCircle = null;
    let isPaused = false;

    startButton.addEventListener("click", function () {
        playerName = nicknameInput.value.trim();
        if (playerName !== "" && circleColorInput.value !== "") {
            welcomeModal.style.display = "none";
            startGame();
        } else {
            alert("Пожалуйста, введите ваш никнейм и выберите цвет круга.");
        }
    });

    restartButton.addEventListener("click", function () {
        gameOverModal.style.display = "none";
        startGame();
    });

    volumeControl.addEventListener("input", function () {
        const volume = volumeControl.value;
        clickSound.volume = volume;
        missSound.volume = volume;
    });

    pauseButton.addEventListener("click", function () {
        isPaused = !isPaused;
        if (isPaused) {
            pauseButton.textContent = "Продолжить";
            pauseButton.classList.add("paused");
        } else {
            pauseButton.textContent = "Пауза";
            pauseButton.classList.remove("paused");
            createCircle();
        }
    });

    function startGame() {
        gameContainer.innerHTML = "";
        score = 0;
        misses = 0;
        lastCircle = null;
        isPaused = false;
        pauseButton.textContent = "Пауза";
        pauseButton.classList.remove("paused");
        updateScoreDisplay();
        resetLives();
        createCircle();
    }

    function resetLives() {
        const lifeImages = livesContainer.getElementsByClassName("life");
        for (let i = 0; i < lifeImages.length; i++) {
            lifeImages[i].src = "css/images/full-heart.png";
        }
    }

    function updateLives() {
        const lifeImages = livesContainer.getElementsByClassName("life");
        if (misses < maxMisses) {
            lifeImages[misses].src = "css/images/broken-heart.png";
        }
    }

    function createArrow(x1, y1, x2, y2, color) {
        const arrow = document.createElement("div");
        arrow.classList.add("arrow");
        arrow.style.borderBottomColor = color;

        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        arrow.style.transform = `rotate(${angle}deg)`;

        const size = 25;
        const centerX = (x1 + x2) / 2 - size / 2;
        const centerY = (y1 + y2) / 2 - size / 2;

        arrow.style.left = `${centerX}px`;
        arrow.style.top = `${centerY}px`;

        gameContainer.appendChild(arrow);

        setTimeout(() => {
            if (gameContainer.contains(arrow)) {
                gameContainer.removeChild(arrow);
            }
        }, 1000);
    }

    function createCircle() {
        if (isPaused) return;

        const circle = document.createElement("div");
        circle.classList.add("circle");
        circle.style.backgroundColor = circleColorInput.value;

        const size = 50;
        const x = Math.random() * (gameContainer.clientWidth - size);
        const y = Math.random() * (gameContainer.clientHeight - size);

        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;

        if (lastCircle) {
            const lastX = parseFloat(lastCircle.style.left) + size / 2;
            const lastY = parseFloat(lastCircle.style.top) + size / 2;
            const newX = x + size / 2;
            const newY = y + size / 2;
            createArrow(lastX, lastY, newX, newY, circleColorInput.value);
        }

        lastCircle = circle;

        circle.addEventListener("click", function () {
            if (isPaused) return;

            clickSound.play();
            circle.classList.add("growing");
            setTimeout(() => {
                circle.classList.remove("growing");
                score++;
                misses = 0; // Обновляем попытки при попадании
                updateScoreDisplay();
                gameContainer.removeChild(circle);
                resetLives(); // Сбрасываем сердечки при попадании
                createCircle();
            }, 200);
        });

        gameContainer.appendChild(circle);

        setTimeout(function () {
            if (gameContainer.contains(circle) && !isPaused) {
                gameContainer.removeChild(circle);
                misses++;
                missSound.play();
                updateLives();
                if (misses >= maxMisses) {
                    endGame();
                } else {
                    createCircle();
                }
            }
        }, 1000);
    }

    function endGame() {
        finalScore.textContent = score;
        gameOverModal.style.display = "flex";
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }
});
