// spaghetti code incoming
// not using semicolon, never, unless it's required

// setting up
const root = document.documentElement
root.style.setProperty('--screen-x', `${window.screen.width}px`)
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
let gen        = document.getElementById("gen")
// buTtoNS!
let config     = document.getElementById("config")
let mode       = false
let lang       = 'zh-HK'


readmode.disabled   = true
showButton.disabled = true
read.disabled       = true

let synth = speechSynthesis
let voice, voices
// https://raw.githubusercontent.com/mdn/dom-examples/main/web-speech-api/speak-easy-synthesis/script.js
function speak(text) {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking")
    return
  }

  if (text !== "") {
    const utterThis = new SpeechSynthesisUtterance(text)
    utterThis.lang   = lang
    utterThis.voice  = voice
    utterThis.rate   = 1
    utterThis.pitch  = 1
    utterThis.volume = 1
    console.log(utterThis)
    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend")
      console.log(event)
    }

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror")
      console.log(event)
    }  
    synth.speak(utterThis)
    return utterThis.onend
  }
}
// end of copy

synth.onvoiceschanged = ()=>{
  console.log("hi")
  console.log(synth.getVoices())
  voice = synth.getVoices().find(voice => voice.lang.toLowerCase().includes("zh-hk"))
  if (voice){
    document.getElementById("speechless").innerHTML = "" // 遲啲會自己整 TTS
    // 好啦只能夠話見到一兩年前嘅自己寫comment有啲高興
    // 不過自己整tts呢啲嘢就未必會搞
    // 我呢啲小programmer用部 0 computing power嘅小laptop 唔足以train一個自然嘅tts
    read.disabled = false
  }
}

// copied code from https://stackoverflow.com/a/57672147
setInterval(() => {
    console.log(synth.speaking);
    if (!synth.speaking) {
      clearInterval(r);
    } else {
        synth.resume();
    }
}, 14000);

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
  if (read.disabled === false){
    synth.cancel()
    speak(str)
  }
}

read.addEventListener("click", ()=>{
  synth.cancel()
  const match = textEditor.textContent.match(/\b(\w+)\b/g)
  if (match){
    match.forEach(
      sentence => {
        speak(sentence)
        waitUntilFinished = ()=>{
          synth.speaking ? setTimeout(waitUntilFinished, 100): console.log(synth.speaking)
        }
        setTimeout(waitUntilFinished, 100)
      }
    )
  } else{
    speak(textEditor.textContent)
  }
})

gen.addEventListener("click", async ()=>{
  const suggestmain = document.getElementById("suggestmain")
  const lihkgdata = await fetch("lihkgdata.csv", {mode: 'cors'})
                          .then(data => data.text())
  const kTotalStrokes = await fetch("kTotalStrokes.txt", {mode: 'cors'})
                          .then(data => data.text())
  suggestmain.innerHTML = ''
  let matches = [...new Set(textEditor.textContent.match(/\p{Script=Han}/gum))]
  if (typeof matches !== "undefined"){
    matches.forEach(match=>{
      regex = RegExp(`${match}.+?(\\d+)`, 'gm')
      let wordFreq = regex.exec(lihkgdata)[1] || -1
      let wordStrk = regex.exec(kTotalStrokes)[1] || 14
      console.log(wordFreq)
      console.log(wordStrk)
      if (wordFreq <= 250){
        suggestmain.textContent += match
      } else{
        if (wordStrk >= 14 && wordFreq <= 12000){
          suggestmain.textContent += match + '\t'
        }
      }
    })
  } 
  if (suggestmain.innerHTML === ''){
    suggestmain.textContent = "沒有建議書寫字"
  }
})