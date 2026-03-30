const h = 6.626e-34
const e = 1.602e-19
const c = 3e8

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
borderWidth:2,
fill:false
}]
},
options:{
responsive:true,
scales:{
x:{title:{display:true,text:"Frekuensi Cahaya (Hz)"}},
y:{title:{display:true,text:"Energi Kinetik (J)"}}
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

function freqToRGB(freq){

let wavelength = (c / freq) * 1e9

let R=0, G=0, B=0

if(wavelength >= 380 && wavelength < 440){
R = -(wavelength - 440) / (440 - 380)
B = 1
}
else if(wavelength >= 440 && wavelength < 490){
G = (wavelength - 440) / (490 - 440)
B = 1
}
else if(wavelength >= 490 && wavelength < 510){
G = 1
B = -(wavelength - 510) / (510 - 490)
}
else if(wavelength >= 510 && wavelength < 580){
R = (wavelength - 510) / (580 - 510)
G = 1
}
else if(wavelength >= 580 && wavelength < 645){
R = 1
G = -(wavelength - 645) / (645 - 580)
}
else if(wavelength >= 645 && wavelength <= 750){
R = 1
}

let factor = 1
if(wavelength < 420){
factor = 0.3 + 0.7*(wavelength-380)/(420-380)
}
else if(wavelength > 645){
factor = 0.3 + 0.7*(750-wavelength)/(750-645)
}

let r = Math.round(255 * R * factor)
let g = Math.round(255 * G * factor)
let b = Math.round(255 * B * factor)

return `rgb(${r},${g},${b})`
}

function updateColor(freq){

let color = freqToRGB(freq)

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

},16)

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

let electronCount = Math.floor(intensity / 15)

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
"Frekuensi lebih kecil dari frekuensi ambang"

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
updateColor(parseFloat(freqSlider.value))

})

intensitySlider.addEventListener("input",updateDisplay)
metalSelect.addEventListener("change",updateDisplay)

updateDisplay()
updateColor(parseFloat(freqSlider.value))
