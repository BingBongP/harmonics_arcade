namespace Harmonics {
    function rectanglesOverlap(
        x: number, y: number, w: number, h: number, r: Rect
    ): boolean {
        return x < r.x + r.w && x + w > r.x && y < r.y + r.h && y + h > r.y
    }

    function inputLeft(index: number): boolean {
        if (mode == 1 && index != activePlayer) return false
        if (mode == 2 && index == 1) return controller.player2.left.isPressed()
        return controller.left.isPressed()
    }

    function inputRight(index: number): boolean {
        if (mode == 1 && index != activePlayer) return false
        if (mode == 2 && index == 1) return controller.player2.right.isPressed()
        return controller.right.isPressed()
    }

    function inputJump(index: number): boolean {
        if (mode == 1 && index != activePlayer) return false
        if (mode == 2 && index == 1) return controller.player2.up.isPressed()
        return controller.up.isPressed()
    }

    export function breathingHeld(): boolean {
        if (mode == 1) return controller.B.isPressed()
        return controller.B.isPressed() || controller.player2.B.isPressed()
    }

    export function updatePlayers(dt: number): void {
        let solids = getSolidRects()

        for (let i = 0; i < 2; i++) {
            let speed = 35
            let jumpSpeed = 124

            if (playerHolding[i] && coreType == "heavy") {
                speed = 15
                jumpSpeed = 84
            } else if (playerHolding[i] && coreType == "spark") {
                speed = 77
                jumpSpeed = 142
            }

            let direction = 0
            if (inputLeft(i)) direction -= 1
            if (inputRight(i)) direction += 1

            let vx = direction * speed
            if (vx != 0) playerFacing[i] = vx > 0 ? 1 : -1

            // Horizontal movement and solid-platform collision.
            playerX[i] += vx * dt
            for (let j = 0; j < solids.length; j++) {
                let r = solids[j]
                if (rectanglesOverlap(playerX[i], playerY[i], PLAYER_W, PLAYER_H, r)) {
                    if (vx > 0) playerX[i] = r.x - PLAYER_W
                    else if (vx < 0) playerX[i] = r.x + r.w
                }
            }
            playerX[i] = clamp(playerX[i], 0, SCREEN_W - PLAYER_W)

            // Vertical movement, including jumping and gravity.
            playerVY[i] += PLAYER_GRAVITY * dt
            if (inputJump(i) && playerOnGround[i]) {
                playerVY[i] = -jumpSpeed
                playerOnGround[i] = false
            }

            playerY[i] += playerVY[i] * dt
            playerOnGround[i] = false
            for (let j = 0; j < solids.length; j++) {
                let r = solids[j]
                if (rectanglesOverlap(playerX[i], playerY[i], PLAYER_W, PLAYER_H, r)) {
                    if (playerVY[i] > 0) {
                        playerY[i] = r.y - PLAYER_H
                        playerOnGround[i] = true
                    } else if (playerVY[i] < 0) {
                        playerY[i] = r.y + r.h
                    }
                    playerVY[i] = 0
                }
            }

            // Falling never costs a life; the character simply returns to start.
            if (playerY[i] > SCREEN_H + 13) {
                playerX[i] = i == 0 ? 50 * SCALE_X : 100 * SCALE_X
                playerY[i] = 480 * SCALE_Y - PLAYER_H
                playerVY[i] = 0
                playerOnGround[i] = false
            }
        }

        syncActors()
    }

    export function updateCore(dt: number): void {
        if (!coreSprite) return

        if (coreHeldBy >= 0) {
            coreX = playerX[coreHeldBy] + PLAYER_W / 2
            coreY = playerY[coreHeldBy] - 4
        } else if (!corePlaced) {
            coreVY += PLAYER_GRAVITY * dt
            coreY += coreVY * dt

            let solids = getSolidRects()
            for (let i = 0; i < solids.length; i++) {
                let r = solids[i]
                if (coreX >= r.x && coreX <= r.x + r.w &&
                    coreY + 2.5 >= r.y && coreY + 2.5 <= r.y + r.h + 10 &&
                    coreVY >= 0) {
                    coreY = r.y - 2.5
                    coreVY = 0
                }
            }

            if (coreY > SCREEN_H + 13) {
                coreY = 300 * SCALE_Y
                coreVY = 0
            }
        }

        syncActors()
    }

    function playerDistanceToCore(index: number): number {
        let dx = playerX[index] + PLAYER_W / 2 - coreX
        let dy = playerY[index] + PLAYER_H / 2 - coreY
        return dx * dx + dy * dy
    }

    function playersClose(first: number, second: number): boolean {
        let dx = playerX[first] + PLAYER_W / 2 - playerX[second] - PLAYER_W / 2
        let dy = playerY[first] + PLAYER_H / 2 - playerY[second] - PLAYER_H / 2
        return dx * dx + dy * dy < 22 * 22
    }

    export function shareCore(index: number): void {
        if (!coreSprite || corePlaced) return

        let other = 1 - index

        if (playerHolding[index]) {
            let onPlate = plateRect.w > 0 &&
                playerX[index] + PLAYER_W > plateRect.x &&
                playerX[index] < plateRect.x + plateRect.w &&
                Math.abs(playerY[index] + PLAYER_H - plateRect.y) < 5.5

            if (onPlate) {
                playerHolding[index] = false
                coreHeldBy = -1
                corePlaced = true
                coreX = plateRect.x + plateRect.w / 2
                coreY = plateRect.y - 2.5
                coreVY = 0
                playChime(520, 220)
            } else if (!playerHolding[other] && playersClose(index, other)) {
                playerHolding[index] = false
                playerHolding[other] = true
                coreHeldBy = other
                playChime(392, 180)
            } else {
                // A press away from the partner or plate drops the core.
                playerHolding[index] = false
                coreHeldBy = -1
                coreVY = 0
            }
        } else if (coreHeldBy < 0 && playerDistanceToCore(index) < 13.5 * 13.5) {
            playerHolding[index] = true
            coreHeldBy = index
            playChime(330, 180)
        }

        syncActors()
    }

    export function updateGame(dt: number): void {
        breathClock += dt
        let held = breathingHeld()
        if (held) lastBreathTime = breathClock

        let inhalePhase = breathClock % 9 < 4
        if (roomIndex == 0 && fogProgress < 1 &&
            breathClock - lastBreathTime < 2.5 && held == inhalePhase) {
            let before = fogProgress
            fogProgress = Math.min(1, fogProgress + dt / 14)
            if (before < 1 && fogProgress >= 1) {
                playChime(660, 350)
            }
        }

        updatePlayers(dt)
        updateCore(dt)

        let atExit = true
        for (let i = 0; i < 2; i++) {
            let overlapsExit = playerX[i] + PLAYER_W > exitRect.x &&
                playerX[i] < exitRect.x + exitRect.w &&
                playerY[i] + PLAYER_H > exitRect.y &&
                playerY[i] < exitRect.y + exitRect.h
            if (!overlapsExit) atExit = false
        }

        if (atExit) {
            exitTimer += dt
            if (exitTimer > 0.9) nextRoom()
        } else {
            exitTimer = 0
        }
    }
}