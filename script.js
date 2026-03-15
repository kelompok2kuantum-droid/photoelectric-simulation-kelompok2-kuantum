const h = 6.626e-34
const e = 1.602e-19

const freqSlider = document.getElementById("frequency")
const intensitySlider = document.getElementById("intensity")
const metalSelect = document.getElementById("metalSelect")

const freqValue = document.getElementById("freqValue")
const photonEVText = document.getElementById("photonEV")
const intensityValue = document.getElementById("intensityValue")
const phiValue = document.getElementById("phiValue")

const photonText = document.getElementById("photonEnergy")
const kineticText = document.getElementById("kineticEnergy")
const thresholdText = document.getElementById("thresholdFreq")
const statusText = document.getElementById("status")

const lamp = document.getElementById("lamp")
const beam = document.getElementById("beam")
const electronsContainer = document.getElementById("electrons")

const startBtn = document.getElementById("startBtn")
const resetBtn = document.getElementById("resetBtn")

const graphList = document.getElementById("graphData")

let chart

const ctx = document.getElementById("energyChart")

chart = new Chart(ctx,{
type:"line",
data:{
labels:[],
datasets:[{
label:"Energi Kinetik Elektron",
data:[],
borderColor:"cyan",
borderWidth:2,
fill:false
}]
},
options:{
responsive:true,
scales:{
x:{
title:{display:true,text:"Frekuensi Cahaya (Hz)"}
},
y:{
title:{display:true,text:"Energi Kinetik (J)"}
}
}
}
})

function updateDisplay(){

let f = parseFloat(freqSlider.value)
let intensity = parseInt(intensitySlider.value)
let phi = parseFloat(metalSelect.value)

let photonEnergy = h * f
let photonEV = photonEnergy / e

freqValue.innerText = "Frekuensi: " + f.toExponential(2) + " Hz"
photonEVText.innerText = "Energi Foton: " + photonEV.toFixed(2) + " eV"

intensityValue.innerText = "Intensitas: " + intensity + " %"
phiValue.innerText = "Fungsi Kerja Logam: " + phi + " eV"

}

function updateColor(freq){

let ratio = (freq - 4e14) / (2e15 - 4e14)

if(ratio < 0) ratio = 0
if(ratio > 1) ratio = 1

let hue = 240 - ratio * 240

let color = "hsl(" + hue + ",100%,50%)"

lamp.style.background = color
beam.style.background = color
lamp.style.boxShadow = "0 0 40px " + color

}

function createElectron(speed){

let eParticle = document.createElement("div")

eParticle.className = "electron"

eParticle.innerText = "e⁻"

let top = 80 + Math.random()*80

eParticle.style.top = top + "px"

electronsContainer.appendChild(eParticle)

let pos = 200

let move = setInterval(function(){

pos += speed

eParticle.style.left = pos + "px"

if(pos > 800){

clearInterval(move)

eParticle.remove()

}

},20)

}

function runSimulation(){

let f = parseFloat(freqSlider.value)
let intensity = parseInt(intensitySlider.value)
let phi = parseFloat(metalSelect.value)

let photonEnergy = h * f
let photonEV = photonEnergy / e

let phiJoule = phi * e

let kinetic = photonEnergy - phiJoule
let kineticEV = kinetic / e

let thresholdFreq = phiJoule / h

photonText.innerText =
photonEV.toFixed(2) + " eV  (" + photonEnergy.toExponential(3) + " J)"

thresholdText.innerText =
thresholdFreq.toExponential(3) + " Hz"

updateColor(f)

if(kinetic > 0){

kineticText.innerText =
kineticEV.toFixed(2) + " eV  (" + kinetic.toExponential(3) + " J)"

statusText.innerText = "Elektron keluar dari logam"

let speed = kineticEV

if(speed < 1) speed = 1
if(speed > 12) speed = 12

let electronCount = Math.floor(intensity / 20)

for(let i=0;i<electronCount;i++){
createElectron(speed)
}

chart.data.labels.push(f.toExponential(1))
chart.data.datasets[0].data.push(kinetic)

chart.update()

let li = document.createElement("li")

li.innerText =
"f = " + f.toExponential(2) +
" , Ek = " + kineticEV.toFixed(2) + " eV"

graphList.appendChild(li)

}else{

kineticText.innerText = "0 eV"

statusText.innerText =
"Frekuensi lebih kecil dari frekuensi ambang sehingga elektron tidak keluar"

}

}

startBtn.addEventListener("click",runSimulation)

resetBtn.addEventListener("click",function(){

electronsContainer.innerHTML = ""

chart.data.labels = []
chart.data.datasets[0].data = []

chart.update()

graphList.innerHTML = ""

photonText.innerText = ""
kineticText.innerText = ""
thresholdText.innerText = ""
statusText.innerText = ""

})

freqSlider.addEventListener("input",function(){

updateDisplay()

let f = parseFloat(freqSlider.value)

updateColor(f)

})

intensitySlider.addEventListener("input",updateDisplay)

metalSelect.addEventListener("change",updateDisplay)

updateDisplay()

updateColor(parseFloat(freqSlider.value))
