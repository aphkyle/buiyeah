// spaghetti code incoming
// not using semicolon, never, unless it's required

// setting up
let lihkgData, parsedData
fetch("https://raw.githubusercontent.com/aphkyle/buiyeah/main/src/lihkgdata.csv")
  .then((resp) => 
    {resp.text()
  .then((data) =>
    {lihkgData = data})})

window.addEventListener('load', () => {
  console.log("hi work please")
  parsedData = Papa.parse(
    lihkgData, 
    {
      header: true,
      dynamicTyping: true,
  })
})
const root = document.documentElement
root.style.setProperty('--screen-y', `${window.screen.height}px`)

// events
const textEditor = document.getElementById("textEditor")

let localStorage = window.localStorage
if (localStorage.length === 0){
  localStorage.setItem("savedText", '')
} else{
  textEditor.innerHTML = localStorage.getItem("savedText")
}

document.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    document.execCommand('insertLineBreak')
    event.preventDefault()
  }
  if (event.key === " ") {
    document.execCommand("insert")
  }
  console.log(event.key)
})

addEventListener("beforeunload", (e)=>{
  localStorage.setItem("savedText", textEditor.textContent)
})

// BuTTOnS!
let hideButton = document.getElementById("hide")
let showButton = document.getElementById("show")
let readmode   = document.getElementById("readmode")
let read       = document.getElementById("read")
// buTtoNS!
let config     = document.getElementById("config")
let mode       = false

readmode.disabled   = true
showButton.disabled = true

let synth = speechSynthesis
const speakable = synth.getVoices().some(voice => voice.lang === "zh-HK")
if (!speakable){
  document.getElementById("speechless").innerHTML = "瀏覽器未有支援粵語TTS" // 遲啲會自己整
  read.disabled = true
}

hideButton.addEventListener("click", (e)=>{
  textEditor.removeAttribute("contenteditable")
  hideButton.disabled =  true
  showButton.disabled = false
  readmode  .disabled = false
  let text = textEditor.innerHTML.replace("<br>", "\n").replace(/\<.*?\>/g, "")
  let re = /([\p{Script=Han}\w]+)/gum
  textEditor.innerHTML = text.replace(re, "<span class=\"redacted\" onclick=\"readthatout(this, \'$1\')\">$1</span>")
  config.textContent   = "現為閲讀模式（可按隱藏區域亮出/讀出句子，或拖動字符逐字亮出）"
})

showButton.addEventListener("click", (e)=>{
  textEditor.setAttribute("contenteditable", '')
  hideButton.disabled  = false
  showButton.disabled  =  true
  readmode  .disabled  =  true
  textEditor.innerHTML = textEditor.innerHTML.replace("<br>", "\n").replace(/\<.*?\>/g, "")
  config.textContent   = ""
})

readmode  .addEventListener("click", (e)=>{
  if (mode){
    textEditor.removeAttribute("class")
    config.textContent   = "現為閲讀模式（可按隱藏區域亮出句子，或拖動字符逐字亮出）"
    mode = false
  } else {
    textEditor.setAttribute("class", "noselect")
    config.textContent   = "現為隱藏模式（文字區域內無法進行任何行動）"
    mode = true

  }
})

function readthatout(element, str){
  if (!mode){
    element.removeAttribute("class")
  }
  if (speakable){
    const utterThis = new SpeechSynthesisUtterance(str);
    utterThis.lang = "zh-HK"
    synth.speak(utterThis)
  }
}

read.addEventListener("click", (e)=>{
  const utterThis = new SpeechSynthesisUtterance(textEditor.textContent);
  utterThis.lang = "zh-HK"
  synth.speak(utterThis)
})

textEditor.addEventListener("change", (e)=>{

})