namespace Harmonics {
    export function playChime(frequency: number, duration: number): void {
        if (soundEnabled) music.playTone(frequency, duration)
    }

    export function boot(): void {
        backgroundImage = image.create(SCREEN_W, SCREEN_H)
        scene.setBackgroundImage(backgroundImage)
        registerControls()

        lastTick = control.millis()
        game.onUpdate(function () {
            let now = control.millis()
            let dt = (now - lastTick) / 1000
            lastTick = now
            dt = clamp(dt, 0, 0.05)

            if (gameState == "play") updateGame(dt)
            render()
        })

        render()
    }
}

// Defer boot until the first update so every Explorer file has finished loading.
let harmonicsBooted = false
game.onUpdate(function () {
    if (!harmonicsBooted) {
        harmonicsBooted = true
        Harmonics.boot()
    }
})