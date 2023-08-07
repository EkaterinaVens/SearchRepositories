const replys = document.querySelector('.replys');
const info = document.querySelector('.info')
const search = document.querySelector('.search')

async function getRepositories(value) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${value}`)
    const repositories = await response.json();
    if (!repositories.items) {
        return
    }

    createSearchElements(repositories.items)
}

const debouncedGetRepositories = debounce(getRepositories, 800)

function createSearchElements(arr) {
    replys.replaceChildren()

    for (let el in arr.slice(0, 5)) {
        const reply = document.createElement('li');
        reply.classList.add('reply');
        reply.textContent = arr[el].name;
        replys.appendChild(reply)
        reply.dataset.nameRep = arr[el].name;
        reply.dataset.ownerRep = arr[el].owner.login;
        reply.dataset.starsRep = arr[el].stargazers_count;
        reply.addEventListener('click', (e) => {
            if (info.childElementCount >= 3) {
                info.firstElementChild.remove()
            }
        })
    }
}


search.addEventListener('keyup', (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!e.target.value) {
        replys.replaceChildren()
    }
    console.log('e.target.value', e.target.value)
    debouncedGetRepositories(e.target.value)
})

replys.addEventListener('click', (e) => {
    search.value = '';
    replys.replaceChildren()

    if (info.childElementCount >= 3) {
        info.firstElementChild.remove()
    }
    const { nameRep, ownerRep, starsRep } = e.target.dataset;
    createCard(nameRep, ownerRep, starsRep)
})

function createCard(nameRep, ownerRep, starsRep) {
    let li = document.createElement('li');
    li.classList.add('git-status');
    let name = document.createElement('p');
    name.classList.add('name')
    name.textContent = `Name: ${nameRep}`;
    li.appendChild(name)
    let owner = document.createElement('p');
    owner.classList.add('owner')
    owner.textContent = `Owner: ${ownerRep}`
    li.appendChild(owner)
    let stars = document.createElement('p');
    stars.classList.add('stars')
    stars.textContent = `Stars: ${starsRep}`
    li.appendChild(stars)
    let close = document.createElement('button')
    close.classList.add('close')
    li.appendChild(close)
    info.appendChild(li)
}

info.addEventListener('click', e => {
    if (e.target.className === 'close') {
        e.target.parentElement.remove();
    }
})

function debounce(fn, debounceTime) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, debounceTime)
    }
};

// 