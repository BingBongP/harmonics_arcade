namespace Harmonics {
    export function createActors(): void {
        if (playerSprites.length == 0) {
            playerSprites.push(sprites.create(img`
                . 3 3 3 .
                3 3 3 3 3
                3 1 3 1 3
                3 3 3 3 3
                . 3 3 3 .
                . 3 3 3 .
                3 . 3 . 3
                3 . . . 3
                3 . . . 3
            `, SpriteKind.Player))
            playerSprites.push(sprites.create(img`
                . 9 9 9 .
                9 9 9 9 9
                9 1 9 1 9
                9 9 9 9 9
                . 9 9 9 .
                . 9 9 9 .
                9 . 9 . 9
                9 . . . 9
                9 . . . 9
            `, SpriteKind.Player))
        }
    }

    export function createCoreActor(): void {
        if (coreSprite) {
            coreSprite.destroy()
            coreSprite = null
        }

        if (coreType == "heavy") {
            coreSprite = sprites.create(img`
                . 8 8 8 8 . .
                8 8 8 8 8 8 .
                8 8 8 8 8 8 8
                8 8 1 1 8 8 8
                8 8 8 8 8 8 8
                . 8 8 8 8 8 .
                . . 8 8 8 . .
            `, SpriteKind.Food)
        } else if (coreType == "spark") {
            coreSprite = sprites.create(img`
                . . . c . . .
                . . c 3 c . .
                . c 3 c 3 c .
                c 3 c 3 c 3 3
                . c 3 c 3 c .
                . . c 3 c . .
                . . . c . . .
            `, SpriteKind.Food)
        }
    }

    export function destroyActors(): void {
        for (let i = 0; i < playerSprites.length; i++) {
            playerSprites[i].destroy()
        }
        playerSprites = []

        if (coreSprite) {
            coreSprite.destroy()
            coreSprite = null
        }
    }

    export function syncActors(): void {
        for (let i = 0; i < playerSprites.length; i++) {
            playerSprites[i].setPosition(
                Math.round(playerX[i] + PLAYER_W / 2),
                Math.round(playerY[i] + PLAYER_H / 2)
            )
        }

        if (coreSprite) {
            coreSprite.setPosition(Math.round(coreX), Math.round(coreY))
        }
    }
}