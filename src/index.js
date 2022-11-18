// not using semicolon, never, unless it's required

let root = document.documentElement;
root.style.setProperty('--screen-y', `${window.screen.height}px`)

// debug
// setTimeout(function(){
//   window.location = window.location
// }, 5000);

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
})

addEventListener("beforeunload", (e)=>{
  localStorage.setItem("savedText", textEditor.innerHTML)
})


// BuTTOnS!
let hideButton = document.getElementById("hide")
hideButton.addEventListener("click", (e)=>{
  textEditor
})
//(.*?)[\u3000-\u3019]|