const btn = document.getElementById('btnMash');
const infoBtn = document.querySelector('#infoBtn');
const inputBtn = document.querySelector('#inputBtn')

btn.addEventListener('click', ()=>{
    if (infoBtn.classList.contains('hidden')){
        infoBtn.classList.remove('hidden');
        inputBtn.classList.add('hidden')
    } else {
        infoBtn.classList.add('hidden');
        inputBtn.classList.remove('hidden');
    }
});