namespace Harmonics {
    function cycleMood(direction: number): void {
        moodIndex += direction
        if (moodIndex < -1) moodIndex = 2
        if (moodIndex > 2) moodIndex = -1
    }

    export function registerControls(): void {
        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            if (gameState == "menu") {
                selectedMode = 1
            } else if (gameState == "end") {
                cycleMood(-1)
            }
        })

        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            if (gameState == "menu") {
                selectedMode = 2
            } else if (gameState == "end") {
                cycleMood(1)
            }
        })

        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            if (gameState == "menu") cycleMood(-1)
            else if (gameState == "end") cycleMood(-1)
        })

        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            if (gameState == "menu") cycleMood(1)
            else if (gameState == "end") cycleMood(1)
        })

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            if (gameState == "menu") {
                startGame()
            } else if (gameState == "play") {
                shareCore(mode == 1 ? activePlayer : 0)
            } else if (gameState == "end") {
                if (preMood < 0) {
                    gameState = "thanks"
                } else if (moodIndex < preMood) {
                    endMoodIndex = 0
                    gameState = "thanks"
                } else if (moodIndex == preMood) {
                    endMoodIndex = 1
                    gameState = "thanks"
                } else {
                    endMoodIndex = 2
                    gameState = "thanks"
                }
            } else if (gameState == "thanks") {
                showMenu()
            }
        })

        controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
            if (gameState == "menu") {
                soundEnabled = !soundEnabled
            } else if (gameState == "end") {
                showMenu()
            }
        })

        controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
            if (gameState == "play") {
                if (mode == 1 && !controller.B.isPressed()) {
                    activePlayer = 1 - activePlayer
                } else {
                    restartRoom()
                }
            } else if (gameState == "end" || gameState == "thanks") {
                showMenu()
            }
        })

        controller.player2.A.onEvent(ControllerButtonEvent.Pressed, function () {
            if (gameState == "play" && mode == 2) shareCore(1)
        })
    }

    export function startGame(): void {
        mode = selectedMode
        preMood = moodIndex
        gameState = "play"
        createActors()
        loadRoom(0)
        playChime(440, 180)
    }

    export function finishGame(): void {
        gameState = "end"
        moodIndex = 0
        endMoodIndex = moodIndex
        destroyActors()
        playChime(784, 400)
    }

    export function showMenu(): void {
        destroyActors()
        gameState = "menu"
        selectedMode = 1
        moodIndex = -1
        preMood = -1
        playChime(330, 150)
    }
}
