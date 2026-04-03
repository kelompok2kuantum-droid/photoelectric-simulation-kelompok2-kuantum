const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = 800
canvas.height = 400

const electrons = []

// Slider
const freqSlider = document.getElementById("frequency")
const intensitySlider = document.getElementById("intensity")

// Konstanta
const h = 6.626e-34
const e = 1.602e-19

// Fungsi kerja (contoh logam)
let workFunction = 2.3 * e

function createElectron() {
    let energy = (h * freqSlider.value) - workFunction

    if (energy <= 0) return

    let speed = energy * 1e34

    // Sudut kecil → dominan ke kanan
    let angle = (Math.random() - 0.5) * Math.PI / 4

    electrons.push({
        x: 200,
        y: 200 + (Math.random() * 80 - 40),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 2,
        life: 100
    })
}

function updateElectrons() {
    for (let i = electrons.length - 1; i >= 0; i--) {
        let el = electrons[i]

        el.x += el.vx
        el.y += el.vy

        el.life--

        if (el.x > canvas.width || el.life <= 0) {
            electrons.splice(i, 1)
        }
    }
}

function drawElectrons() {
    electrons.forEach(el => {
        ctx.beginPath()
        ctx.arc(el.x, el.y, el.size, 0, Math.PI * 2)

        ctx.fillStyle = "cyan"
        ctx.shadowColor = "cyan"
        ctx.shadowBlur = 10

        ctx.fill()

        ctx.shadowBlur = 0
    })
}

function drawMetal() {
    ctx.fillStyle = "#888"
    ctx.fillRect(180, 150, 20, 100)
}

function drawLight() {
    ctx.strokeStyle = "yellow"
    ctx.lineWidth = 3

    for (let i = 0; i < intensitySlider.value; i++) {
        ctx.beginPath()
        ctx.moveTo(0, 180 + i * 5)
        ctx.lineTo(180, 180 + i * 5)
        ctx.stroke()
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawLight()
    drawMetal()

    // Spawn elektron sesuai intensitas
    if (Math.random() < intensitySlider.value / 50) {
        createElectron()
    }

    updateElectrons()
    drawElectrons()

    requestAnimationFrame(animate)
}

animate()