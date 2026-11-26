namespace Harmonics {
    function addStars(): void {
        for (let i = 0; i < 26; i++) {
            let x = (i * 37 + 11) % SCREEN_W
            let y = (i * 19 + 7) % 70
            backgroundImage.setPixel(x, y, i % 4 == 0 ? 9 : 1)
        }
    }

    function drawMenu(): void {
        backgroundImage.fill(12)
        addStars()
        backgroundImage.fillRect(14, 17, 132, 2, 8)
        backgroundImage.fillRect(22, 44, 116, 1, 9)
        backgroundImage.print("HARMONICS", 40, 24, 1)
        backgroundImage.print("TWO LIGHTS, ONE QUIET WORLD", 13, 34, 9)
        backgroundImage.print("MODE: " + (selectedMode == 1 ? "SOLO" : "TWO PLAYERS"), 39, 54, 5)
        backgroundImage.print("LEFT / RIGHT: MODE", 31, 66, 1)
        backgroundImage.print("MOOD: " + moodName(moodIndex), 35, 78, 9)
        backgroundImage.print("UP / DOWN: MOOD", 36, 89, 1)
        backgroundImage.print("A: START   B: SOUND", 29, 104, 5)
        backgroundImage.print(soundEnabled ? "SOUND ON" : "SOUND OFF", 62, 113, 1)
    }

    function drawPlatform(r: Rect, color: number, thickFloor: boolean): void {
        let height = Math.max(2, Math.round(r.h))
        if (thickFloor) height = Math.max(height, SCREEN_H - Math.round(r.y))
        backgroundImage.fillRect(
            Math.round(r.x), Math.round(r.y),
            Math.max(1, Math.round(r.w)), height, color
        )
        backgroundImage.fillRect(
            Math.round(r.x), Math.round(r.y),
            Math.max(1, Math.round(r.w)), 1, 9
        )
    }

    function drawPortal(): void {
        let x = Math.round(exitRect.x)
        let y = Math.round(exitRect.y)
        backgroundImage.drawRect(x, y, Math.round(exitRect.w), Math.round(exitRect.h), 5)
        backgroundImage.drawRect(x + 2, y + 2, Math.round(exitRect.w) - 4, Math.round(exitRect.h) - 4, 9)
        backgroundImage.fillRect(x + 4, y + 6, 2, Math.round(exitRect.h) - 12, 12)
    }

    function drawPlateAndGate(): void {
        if (plateRect.w > 0) {
            let plateColor = corePlaced ? 5 : 9
            backgroundImage.fillRect(
                Math.round(plateRect.x), Math.round(plateRect.y) - 1,
                Math.round(plateRect.w), 2, plateColor
            )
            backgroundImage.drawRect(
                Math.round(plateRect.x + plateRect.w / 2 - 3),
                Math.round(plateRect.y - 9), 6, 7, 5
            )
        }

        if (gateStyle == "door") {
            let color = corePlaced ? 9 : 5
            backgroundImage.fillRect(
                Math.round(gateRect.x), Math.round(gateRect.y),
                Math.max(2, Math.round(gateRect.w)), Math.round(gateRect.h),
                corePlaced ? 12 : color
            )
            if (corePlaced) {
                backgroundImage.drawRect(
                    Math.round(gateRect.x), Math.round(gateRect.y),
                    Math.max(2, Math.round(gateRect.w)), Math.round(gateRect.h), 5
                )
            }
        } else if (gateStyle == "bridge") {
            if (corePlaced) {
                drawPlatform(gateRect, 5, false)
            } else {
                backgroundImage.drawRect(
                    Math.round(gateRect.x), Math.round(gateRect.y),
                    Math.round(gateRect.w), 3, 9
                )
            }
        }
    }

    function drawBreathingGuide(): void {
        let phase = breathClock % 9
        let inhale = phase < 4
        let radius = inhale ? 5 + phase * 1.5 : 11 - (phase - 4) * 1.2
        let cx = 80
        let cy = 53
        let size = Math.round(radius * 2)

        backgroundImage.drawRect(
            Math.round(cx - radius), Math.round(cy - radius), size, size, 1
        )
        backgroundImage.fillRect(cx - 2, cy - 2, 5, 5, breathingHeld() ? 5 : 9)
        backgroundImage.print(inhale ? "BREATHE IN" : "BREATHE OUT", 52, 72, 1)
        backgroundImage.drawRect(48, 87, 64, 4, 1)
        backgroundImage.fillRect(49, 88, Math.round(62 * fogProgress), 2, 5)
    }

    function drawGame(): void {
        backgroundImage.fill(12)
        backgroundImage.fillRect(0, 78, SCREEN_W, 42, 8)
        backgroundImage.fillRect(0, 94, SCREEN_W, 26, 12)
        addStars()

        for (let i = 0; i < basePlatforms.length; i++) {
            drawPlatform(basePlatforms[i], 8, basePlatforms[i].h > 8)
        }

        if (roomIndex == 0 && fogProgress >= 1) {
            for (let i = 0; i < floatingPlatforms.length; i++) {
                drawPlatform(floatingPlatforms[i], 9, false)
            }
        }

        drawPlateAndGate()
        drawPortal()

        // The fog is a solid-color veil in Arcade. The original soft gradient
        // and animated particles are replaced with a lighter pixel overlay.
        if (roomIndex == 0 && fogProgress < 1) {
            backgroundImage.fillRect(50, 0, 60, 120, 9)
            for (let i = 0; i < 8; i++) {
                let x = 53 + ((i * 17 + Math.round(breathClock * 8)) % 54)
                let y = 23 + ((i * 13) % 74)
                backgroundImage.setPixel(x, y, 1)
            }
            drawBreathingGuide()
        }

        // Draw the HUD after the fog veil so its text stays readable.
        backgroundImage.print(
            (roomIndex + 1) + "/3 " + roomName(roomIndex), 2, 2, 1
        )
        backgroundImage.print(roomHintOne(roomIndex), 2, 10, 9)
        backgroundImage.print(roomHintTwo(roomIndex), 2, 18, 1)

        if (mode == 1) {
            backgroundImage.print("ACTIVE: " + (activePlayer == 0 ? "LUMI" : "NOX"), 2, 28, 5)
            backgroundImage.print("MENU: SWITCH", 106, 2, 1)
        } else {
            backgroundImage.print("P1: LUMI  P2: NOX", 2, 28, 5)
            backgroundImage.print("MENU: RESET", 105, 2, 1)
        }

        if (exitTimer > 0) {
            backgroundImage.fillRect(72, 116, Math.round(16 * Math.min(1, exitTimer / 0.9)), 2, 5)
        }
    }

    function drawEnd(): void {
        backgroundImage.fill(12)
        addStars()
        backgroundImage.print("YOU MADE IT THROUGH", 17, 25, 1)
        backgroundImage.print("EVERY ROOM IS EASIER", 25, 43, 9)
        backgroundImage.print("WHEN IT IS SHARED.", 32, 53, 9)
        backgroundImage.print("HOW DO YOU FEEL NOW?", 23, 72, 1)
        backgroundImage.print("MOOD: " + moodName(moodIndex), 42, 85, 5)
        backgroundImage.print("LEFT / RIGHT: CHOOSE", 25, 97, 1)
        backgroundImage.print("A: CONFIRM  B: MENU", 24, 108, 9)
    }

    function drawThanks(): void {
        backgroundImage.fill(12)
        addStars()
        backgroundImage.print("THANKS FOR CHECKING IN", 14, 32, 1)
        if (preMood < 0) {
            backgroundImage.print("TAKE THINGS AT YOUR PACE.", 12, 56, 9)
        } else if (endMoodIndex == 0) {
            backgroundImage.print("GLAD THINGS FEEL LIGHTER.", 12, 56, 9)
        } else if (endMoodIndex == 1) {
            backgroundImage.print("THE SAME IS OKAY, TOO.", 15, 56, 9)
        } else {
            backgroundImage.print("THANKS FOR BEING HONEST.", 10, 56, 9)
        }
        backgroundImage.print("A: BACK TO MENU", 39, 91, 5)
    }

    export function render(): void {
        if (!backgroundImage) return

        if (gameState == "menu") {
            drawMenu()
        } else if (gameState == "play") {
            drawGame()
        } else if (gameState == "end") {
            drawEnd()
        } else {
            drawThanks()
        }
    }
}
