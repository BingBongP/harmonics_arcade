namespace Harmonics {
    export const SCREEN_W = 160
    export const SCREEN_H = 120

    // The original prototype used a 960 x 540 canvas. These scale factors
    // translate its room layout into MakeCode Arcade's 160 x 120 screen.
    export const SCALE_X = 1 / 6
    export const SCALE_Y = 1 / 4.5

    export interface Rect {
        x: number
        y: number
        w: number
        h: number
    }

    export let gameState = "menu"
    export let selectedMode = 1
    export let mode = 1
    export let activePlayer = 0
    export let roomIndex = 0

    export let moodIndex = -1
    export let preMood = -1
    export let endMoodIndex = 0
    export let soundEnabled = true

    export let fogProgress = 0
    export let breathClock = 0
    export let lastBreathTime = -9
    export let exitTimer = 0

    export let backgroundImage: Image = null

    export let playerSprites: Sprite[] = []
    export let playerX: number[] = []
    export let playerY: number[] = []
    export let playerVY: number[] = []
    export let playerOnGround: boolean[] = []
    export let playerHolding: boolean[] = []
    export let playerFacing: number[] = []

    export const PLAYER_W = 5
    export const PLAYER_H = 9
    export const PLAYER_GRAVITY = 333

    export let coreSprite: Sprite = null
    export let coreType = ""
    export let coreX = 0
    export let coreY = 0
    export let coreVY = 0
    export let coreHeldBy = -1
    export let corePlaced = false

    export let basePlatforms: Rect[] = []
    export let floatingPlatforms: Rect[] = []
    export let gateRect: Rect = { x: 0, y: 0, w: 0, h: 0 }
    export let gateStyle = ""
    export let plateRect: Rect = { x: 0, y: 0, w: 0, h: 0 }
    export let exitRect: Rect = { x: 0, y: 0, w: 0, h: 0 }

    export let lastTick = 0

    export function clamp(value: number, low: number, high: number): number {
        return Math.max(low, Math.min(high, value))
    }

    export function roomName(index: number): string {
        if (index == 0) return "BREATHE"
        if (index == 1) return "WEIGHT"
        return "SPARK"
    }

    export function roomHintOne(index: number): string {
        if (index == 0) return "HOLD B IN / RELEASE B OUT"
        if (index == 1) return "HEAVY CORE SLOWS ITS CARRIER"
        return "SPARK CORE MAKES YOU FASTER"
    }

    export function roomHintTwo(index: number): string {
        if (index == 0) return "CLEAR FOG TO REVEAL THE PATH"
        if (index == 1) return "PASS THE CORE TO THE PLATE"
        return "PLACE THE CORE TO GROW A BRIDGE"
    }

    export function moodName(index: number): string {
        if (index < 0) return "SKIP"
        if (index == 0) return "SETTLED"
        if (index == 1) return "TENSE"
        return "OVERWHELMED"
    }
}