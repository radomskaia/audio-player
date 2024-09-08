let album = [
    {
        artist: 'Linkin Park',
        songName: 'The Emptiness Machine',
        audioSrc: 'audio/01 The Emptiness Machine.mp3',
        coverSrc: 'image/covers/01 The Emptiness Machine.mp3',
    },
    {
        artist: 'Nuki',
        songName: 'Sabotage',
        audioSrc: 'audio/02 Nuki Sabotage.mp3',
        coverSrc: 'image/covers/02 Nuki Sabotage.mp3',
    },
]

function createDOMElement(tagName, parentElement, ...classList) {
    const newEl = document.createElement(tagName);
    parentElement.appendChild(newEl);
    for (let i of classList) {
        newEl.classList.add(i);
    }


    return newEl
}

const body = document.body;
const container = createDOMElement('div', body, 'container');
const playerBox = createDOMElement('div', container, 'playerBox');
const coverBox = createDOMElement('div', playerBox, 'coverBox');
const coverImg = createDOMElement('img', coverBox, 'coverImg');
coverImg.src = 'assets/image/covers/01 The Emptiness Machine.jpeg';
coverImg.alt = 'cover';
const songBox = createDOMElement('div', playerBox, 'songBox');
const songBar = createDOMElement('div', songBox, 'songBar');
const nameBox = createDOMElement('div', songBar, 'nameBox');
const artistName = createDOMElement('h1', nameBox, 'artistName');
artistName.textContent = 'Linkin Park';
const songName = createDOMElement('h2', nameBox, 'songName');
songName.textContent = 'The Emptiness Machine';
const buttonBox = createDOMElement('div', songBar, 'buttonBox');
const rewindBtn = createDOMElement('img', buttonBox, 'rewindBtn');
rewindBtn.alt = 'play/rewind button';
rewindBtn.src = 'assets/image/icons/icons8-rewind-64.png';
const playBtn = createDOMElement('img', buttonBox, 'playBtn');
playBtn.alt = 'play/pause button';
playBtn.src = 'assets/image/icons/icons8-play-64.png';
const forwardBtn = createDOMElement('img', buttonBox, 'rewindBtn');
forwardBtn.alt = 'play/rewind button';
forwardBtn.src = 'assets/image/icons/icons8-fast-forward-64.png';
