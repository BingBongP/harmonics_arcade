namespace Harmonics {
    export function loadRoom(index: number): void {
        roomIndex = clamp(index, 0, 2)
        activePlayer = 0
        fogProgress = roomIndex == 0 ? 0 : 1
        breathClock = 0
        lastBreathTime = -9
        exitTimer = 0
        corePlaced = false
        coreHeldBy = -1
        coreVY = 0

        // Every room starts with the same two characters.
        playerX = [50 * SCALE_X, 100 * SCALE_X]
        playerY = [480 * SCALE_Y - PLAYER_H, 480 * SCALE_Y - PLAYER_H]
        playerVY = [0, 0]
        playerOnGround = [false, false]
        playerHolding = [false, false]
        playerFacing = [1, 1]

        floatingPlatforms = []
        gateRect = { x: 0, y: 0, w: 0, h: 0 }
        plateRect = { x: 0, y: 0, w: 0, h: 0 }
        gateStyle = ""

        if (roomIndex == 0) {
            basePlatforms = [
                { x: 0, y: 480 * SCALE_Y, w: 300 * SCALE_X, h: 60 * SCALE_Y },
                { x: 660 * SCALE_X, y: 480 * SCALE_Y, w: 300 * SCALE_X, h: 60 * SCALE_Y }
            ]
            floatingPlatforms = [
                { x: 330 * SCALE_X, y: 430 * SCALE_Y, w: 90 * SCALE_X, h: 14 * SCALE_Y },
                { x: 450 * SCALE_X, y: 385 * SCALE_Y, w: 90 * SCALE_X, h: 14 * SCALE_Y },
                { x: 570 * SCALE_X, y: 430 * SCALE_Y, w: 90 * SCALE_X, h: 14 * SCALE_Y }
            ]
            coreType = ""
        } else if (roomIndex == 1) {
            basePlatforms = [
                { x: 0, y: 480 * SCALE_Y, w: 960 * SCALE_X, h: 60 * SCALE_Y },
                { x: 380 * SCALE_X, y: 400 * SCALE_Y, w: 130 * SCALE_X, h: 14 * SCALE_Y }
            ]
            coreType = "heavy"
            coreX = 170 * SCALE_X
            coreY = 440 * SCALE_Y
            plateRect = {
                x: 410 * SCALE_X,
                y: 400 * SCALE_Y,
                w: 70 * SCALE_X,
                h: 2
            }
            gateRect = {
                x: 650 * SCALE_X,
                y: 300 * SCALE_Y,
                w: 24 * SCALE_X,
                h: 180 * SCALE_Y
            }
            gateStyle = "door"
        } else {
            basePlatforms = [
                { x: 0, y: 480 * SCALE_Y, w: 300 * SCALE_X, h: 60 * SCALE_Y },
                { x: 640 * SCALE_X, y: 480 * SCALE_Y, w: 320 * SCALE_X, h: 60 * SCALE_Y }
            ]
            coreType = "spark"
            coreX = 180 * SCALE_X
            coreY = 440 * SCALE_Y
            plateRect = {
                x: 680 * SCALE_X,
                y: 480 * SCALE_Y,
                w: 70 * SCALE_X,
                h: 2
            }
            gateRect = {
                x: 300 * SCALE_X,
                y: 480 * SCALE_Y,
                w: 340 * SCALE_X,
                h: 14 * SCALE_Y
            }
            gateStyle = "bridge"
        }

        exitRect = {
            x: 850 * SCALE_X,
            y: 400 * SCALE_Y,
            w: 60 * SCALE_X,
            h: 92 * SCALE_Y
        }

        createActors()
        createCoreActor()
        syncActors()
    }

    export function getSolidRects(): Rect[] {
        let result: Rect[] = []

        for (let i = 0; i < basePlatforms.length; i++) {
            result.push(basePlatforms[i])
        }

        if (roomIndex == 0 && fogProgress >= 1) {
            for (let i = 0; i < floatingPlatforms.length; i++) {
                result.push(floatingPlatforms[i])
            }
        }

        if (gateStyle == "door" && !corePlaced) {
            result.push(gateRect)
        }

        if (gateStyle == "bridge" && corePlaced) {
            result.push(gateRect)
        }

        return result
    }

    export function nextRoom(): void {
        if (roomIndex < 2) {
            loadRoom(roomIndex + 1)
            playChime(660, 180)
        } else {
            finishGame()
        }
    }

    export function restartRoom(): void {
        loadRoom(roomIndex)
    }
}