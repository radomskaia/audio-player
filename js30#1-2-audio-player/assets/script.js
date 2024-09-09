const SONG_DIRECTION = {
    NEXT: 'next',
    PREVIOUS: 'prev',
}

const SECONDS_IN_MINUTES = 60;

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

let playerStatus, songNumber, audio, rewindBtn, playBtn, forwardBtn, coverImg, artistName, songName, nextSong, prevSong,
    progressCurrentTime, songDuration, progressBar;

function createDOMElement(tagName, parentElement, ...classList) {
    const newEl = document.createElement(tagName);
    parentElement.appendChild(newEl);
    for (let i of classList) {
        newEl.classList.add(i);
    }
    return newEl
}


function init() {
    const body = document.body;
    const container = createDOMElement('div', body, 'container');
    const playerBox = createDOMElement('div', container, 'playerBox');
    const coverBox = createDOMElement('div', playerBox, 'coverBox');
    coverImg = createDOMElement('img', coverBox, 'coverImg');
    coverImg.alt = 'cover';
    const songBox = createDOMElement('div', playerBox, 'songBox');
    // const songBar = createDOMElement('div', playerBox, 'songBar');
    const nameBox = createDOMElement('div', songBox, 'nameBox');
    artistName = createDOMElement('h1', nameBox, 'artistName');
    songName = createDOMElement('h2', nameBox, 'songName');
    const progressBox = createDOMElement('div', songBox, 'progressBox');
    songDuration = createDOMElement('p', progressBox, 'songDuration');
    progressBar = createDOMElement('div', progressBox, 'progressBar');
    progressCurrentTime = createDOMElement('p', progressBox, 'currentTime');
    const buttonBox = createDOMElement('div', songBox, 'buttonBox');
    rewindBtn = createDOMElement('img', buttonBox, 'rewindBtn', 'btn');
    playBtn = createDOMElement('img', buttonBox, 'playBtn', 'btn');
    forwardBtn = createDOMElement('img', buttonBox, 'rewindBtn', 'btn');

    audio = new Audio();
    console.log(audio)
    playerStatus = false;
    songNumber = 0
    audio.src = album[songNumber].audioSrc;
    coverImg.src = album[songNumber].coverSrc;
    artistName.textContent = album[songNumber].artist;
    songName.textContent = album[songNumber].songName;

    showTime(true)
    rewindBtn.alt = 'play/rewind button';
    rewindBtn.src = 'assets/image/icons/icons8-rewind-64.png';
    playBtn.alt = 'play/pause button';
    playBtn.src = 'assets/image/icons/icons8-play-64.png'
    forwardBtn.alt = 'play/rewind button';
    forwardBtn.src = 'assets/image/icons/icons8-fast-forward-64.png';

    nextSong = changeSongNumber.bind('next');
    prevSong = changeSongNumber.bind('prev');
}

function playPauseMusic() {
    if (playerStatus) audio.pause();
    else audio.play();
    playerStatus = !playerStatus;
    playBtn.src = playerStatus ? 'assets/image/icons/icons8-pause-64.png' : 'assets/image/icons/icons8-play-64.png';
}

function changeSongNumber() {
    if (this === SONG_DIRECTION.NEXT) songNumber++;
    else if (this === SONG_DIRECTION.PREVIOUS) songNumber--;

    if (songNumber + 1 > album.length) songNumber = 0;
    if (songNumber < 0) songNumber = album.length - 1;

    audio.src = album[songNumber].audioSrc;
    coverImg.src = album[songNumber].coverSrc;
    artistName.textContent = album[songNumber].artist;
    songName.textContent = album[songNumber].songName;
    playerStatus = false;
    playPauseMusic()
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

function showTime(isCurrent) {
    const time = isCurrent ? audio.currentTime : audio.duration;
    const timeMin = Math.floor(time / SECONDS_IN_MINUTES);
    const timeSec = Math.floor(time % SECONDS_IN_MINUTES);
    const timeString = `${timeMin.toString().padStart(2, '0')}:${timeSec.toString().padStart(2, '0')}`
    if (isCurrent) progressCurrentTime.textContent = timeString;
    else songDuration.textContent = timeString;
    const passedTime = audio.currentTime / audio.duration * 100;
    progressBar.style.setProperty('--progress-width', `${passedTime}%`);
    // console.log(progressBar.style.getPropertyValue('--buffered-width'));
    if (progressBar.style.getPropertyValue('--buffered-width') !== '100%') bufferedTime()
}

function bufferedTime() {
      // console.log(progressBar.style.getPropertyValue('--buffered-width'));
    let bufferedTime = audio.buffered.length > 0 ? audio.buffered.end(0) / audio.duration * 100 : 0;
    progressBar.style.setProperty('--buffered-width', `${bufferedTime}%`);
}

init()

playBtn.addEventListener('click', playPauseMusic)
forwardBtn.addEventListener('click', nextSong);
rewindBtn.addEventListener('click', prevSong);
document.addEventListener('keydown', keyRewind);
audio.addEventListener('ended', nextSong)
audio.addEventListener('timeupdate', showTime);
audio.addEventListener('canplay', () => showTime(false))
audio.addEventListener('progress', bufferedTime);
progressBar.addEventListener('click', (e) => {
    const timeProc = progressBar.clientWidth / e.offsetX;
    audio.currentTime = audio.duration / timeProc;
});

