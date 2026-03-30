const h = 6.626e-34
const e = 1.602e-19

const freqSlider = document.getElementById("frequency")
const intensitySlider = document.getElementById("intensity")
const metalSelect = document.getElementById("metalSelect")

const freqValue = document.getElementById("freqValue")
const intensityValue = document.getElementById("intensityValue")

const lamp = document.getElementById("lamp")
const beam = document.getElementById("beam")
const electronsContainer = document.getElementById("electrons")

const startBtn = document.getElementById("startBtn")
const resetBtn = document.getElementById("resetBtn")

const graphList = document.getElementById("graphData")

const ctx = document.getElementById("energyChart")

let chart = new Chart(ctx,{
type:"line",
data:{
labels:[],
datasets:[{
label:"Energi Kinetik",
data:[],
borderWidth:2
}]
}
})

function updateDisplay(){

let f = parseFloat(freqSlider.value)
let intensity = parseInt(intensitySlider.value)

freqValue.innerText = "Frekuensi: " + f.toExponential(2)
intensityValue.innerText = "Intensitas: " + intensity + "%"

}

// 🔥 mapping warna diperbaiki (sesuai spektrum)
function getColor(freq){

let min = 4e14
let max = 7.5e14

let ratio = (freq - min) / (max - min)

if(ratio < 0) ratio = 0
if(ratio > 1) ratio = 1

if(ratio < 0.17) return "#ff0000"   // merah
if(ratio < 0.33) return "#ff7f00"   // orange
if(ratio < 0.50) return "#ffff00"   // kuning
if(ratio < 0.67) return "#00ff00"   // hijau
if(ratio < 0.83) return "#0000ff"   // biru
return "#8b00ff"                    // ungu

}

function updateColor(freq){

let color = getColor(freq)

lamp.style.background = color
beam.style.background = color
lamp.style.boxShadow = "0 0 40px " + color

}

function createElectron(){

let eParticle = document.createElement("div")
eParticle.className = "electron"
eParticle.innerText = "e⁻"

let top = 80 + Math.random()*80
eParticle.style.top = top + "px"

electronsContainer.appendChild(eParticle)

let pos = 200

let move = setInterval(()=>{
pos += 5
eParticle.style.left = pos + "px"

if(pos > 800){
clearInterval(move)
eParticle.remove()
}
},16)

}

function runSimulation(){

let f = parseFloat(freqSlider.value)
let intensity = parseInt(intensitySlider.value)
let phi = parseFloat(metalSelect.value)

let Ek = (h * f) - (phi * e)

updateColor(f)

if(Ek > 0){

let jumlah = Math.floor(intensity / 20)

for(let i=0;i<jumlah;i++){
createElectron()
}

chart.data.labels.push(f.toExponential(1))
chart.data.datasets[0].data.push(Ek)
chart.update()

}

}

startBtn.addEventListener("click",runSimulation)

resetBtn.addEventListener("click",()=>{

electronsContainer.innerHTML = ""

chart.data.labels = []
chart.data.datasets[0].data = []

chart.update()

graphList.innerHTML = ""

})

freqSlider.addEventListener("input",()=>{

updateDisplay()
updateColor(parseFloat(freqSlider.value))

})

intensitySlider.addEventListener("input",updateDisplay)

updateDisplay()
updateColor(parseFloat(freqSlider.value))
