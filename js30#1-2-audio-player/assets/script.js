let album = [
const SONG_DIRECTION = {
    NEXT: 'next',
    PREVIOUS: 'prev',
}


const album = [
    {
        artist: 'Linkin Park',
        songName: 'The Emptiness Machine',
        audioSrc: 'assets/audio/01 The Emptiness Machine.mp3',
        coverSrc: 'assets/image/covers/01 The Emptiness Machine.jpeg',
    },
    {
        artist: 'Nuki',
        songName: 'Sabotage',
        audioSrc: 'assets/audio/02 Nuki Sabotage.mp3',
        coverSrc: 'assets/image/covers/02 Nuki Sabotage.jpeg',
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

    nextSong = changeSongNumber.bind('next');
    prevSong = changeSongNumber.bind('prev');
}

function playPauseMusic() {
    playerStatus = !playerStatus;
    playBtn.src = playerStatus ? 'assets/image/icons/icons8-pause-64.png' : 'assets/image/icons/icons8-play-64.png';
}

function changeSongNumber() {
    if (this === SONG_DIRECTION.NEXT) songNumber++;
    else if (this === SONG_DIRECTION.PREVIOUS) songNumber--;

    if (songNumber + 1 > album.length) songNumber = 0;
    if (songNumber < 0) songNumber = album.length - 1;

    coverImg.src = album[songNumber].coverSrc;
    artistName.textContent = album[songNumber].artist;
    songName.textContent = album[songNumber].songName;
}

function keyRewind(e) {
    if (e.key === 'ArrowLeft') {
        prevSong()
    } else if (e.key === 'ArrowRight') {
        nextSong()
    } else if (e.key === 'Enter') {
        playPauseMusic()
    }
}




playBtn.addEventListener('click', playPauseMusic)
forwardBtn.addEventListener('click', nextSong);
rewindBtn.addEventListener('click', prevSong);
document.addEventListener('keydown', keyRewind);
