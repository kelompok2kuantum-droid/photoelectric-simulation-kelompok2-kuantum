const h = 4.136e-15

let freqSlider = document.getElementById("freq")
let freqText = document.getElementById("freqValue")
let light = document.getElementById("light")

freqSlider.oninput=function(){

freqText.innerHTML=this.value+" ×10¹⁴ Hz"

updateLight()

}

function updateLight(){

let f = freqSlider.value

if(f < 4) light.style.background="red"

else if(f < 5) light.style.background="orange"

else if(f < 6) light.style.background="yellow"

else if(f < 7) light.style.background="green"

else if(f < 8) light.style.background="blue"

else light.style.background="violet"

}

let chart = new Chart(document.getElementById("graph"),{

type:"line",

data:{

labels:[],

datasets:[{

label:"Energi Elektron (eV)",

data:[],

borderColor:"blue",

borderWidth:3

}]

}

})

function runSimulation(){

let f = freqSlider.value * 1e14

let phi = document.getElementById("metal").value

let Ek = (h*f) - phi

let electrons = document.getElementById("electrons")

electrons.innerHTML=""

if(Ek <= 0){

document.getElementById("energy").innerHTML="0 eV"

document.getElementById("status").innerHTML="Frekuensi terlalu kecil. Elektron tidak keluar."

}else{

document.getElementById("energy").innerHTML=Ek.toFixed(2)+" eV"

document.getElementById("status").innerHTML="Elektron keluar dari permukaan logam!"

for(let i=0;i<8;i++){

let e=document.createElement("div")

e.className="electron"

e.innerHTML="e⁻"

e.style.left=Math.random()*480+"px"

e.style.bottom="80px"

electrons.appendChild(e)

let x=Math.random()*480

let y=120+Math.random()*120

setTimeout(()=>{

e.style.transition="1s"

e.style.left=x+"px"

e.style.bottom=y+"px"

},100)

}

}

chart.data.labels.push(freqSlider.value)

chart.data.datasets[0].data.push(Ek>0?Ek:0)

chart.update()

}

updateLight()
