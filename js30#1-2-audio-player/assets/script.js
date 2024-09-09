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
    progressCurrentTime, songDuration, progressBar, progressPopOver, textPopOver, rewindedTime, progressBarClickZone;

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
    progressBarClickZone = createDOMElement('div', progressBox, 'progressBarClickZone');
    progressPopOver = createDOMElement('div', progressBarClickZone, 'progressPopOver');
    textPopOver = createDOMElement('p', progressPopOver, 'popOver');
    progressBar = createDOMElement('div', progressBarClickZone, 'progressBar');
    const timeBox = createDOMElement('div', progressBox, 'timeBox');
    progressCurrentTime = createDOMElement('p', timeBox, 'currentTime');
    songDuration = createDOMElement('p', timeBox, 'songDuration');
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

function getTimeString(time) {
    const timeMin = Math.floor(time / SECONDS_IN_MINUTES);
    const timeSec = Math.floor(time % SECONDS_IN_MINUTES);
    return `${timeMin > 0 ? timeMin : 0}:${timeSec > '0' ? timeSec.toString().padStart(2, '0') : '00'}`
}

function showTime(isCurrent) {
    const time = isCurrent ? audio.currentTime : audio.duration;
    if (isCurrent) progressCurrentTime.textContent = getTimeString(time);
    else songDuration.textContent = getTimeString(time);
    const passedTime = audio.currentTime / audio.duration * 100;
    if (!isMouseMove) progressBar.style.setProperty('--progress-width', `${passedTime}%`);
    if (progressBar.style.getPropertyValue('--buffered-width') !== '100%') bufferedTime()
}

function bufferedTime() {
    // console.log(progressBar.style.getPropertyValue('--buffered-width'));
    let bufferedTime = audio.buffered.length > 0 ? audio.buffered.end(0) / audio.duration * 100 : 0;
    progressBar.style.setProperty('--buffered-width', `${bufferedTime}%`);
}

function rewindSong(e) {
    const offsetX = e.clientX - progressBar.getBoundingClientRect().left;
    // console.log(offsetX, 'offsetX')
    // console.log(e.offsetX, 'EL')
    const timeProc = progressBar.clientWidth / offsetX;
    rewindedTime = audio.duration / timeProc;
    progressPopOver.classList.add('progressPopOver_active');
    textPopOver.textContent = getTimeString(rewindedTime);
    progressBar.style.setProperty('--progress-width', `${rewindedTime / audio.duration * 100}%`)

    progressPopOver.style.left = `${offsetX}px`
}

let isMouseMove
init()

playBtn.addEventListener('click', playPauseMusic)
forwardBtn.addEventListener('click', nextSong);
rewindBtn.addEventListener('click', prevSong);
document.addEventListener('keydown', keyRewind);
audio.addEventListener('ended', nextSong)
audio.addEventListener('timeupdate', showTime);
audio.addEventListener('canplay', () => showTime(false))
audio.addEventListener('progress', bufferedTime);
progressBarClickZone.addEventListener('mousedown', () => isMouseMove = true);

progressBarClickZone.addEventListener('mouseup', (e) => {
    isMouseMove = false;
    rewindSong(e);
    progressPopOver.classList.remove('progressPopOver_active');
    audio.currentTime = rewindedTime;
    // console.log('mouseup');
});

progressBarClickZone.addEventListener('mouseleave', (e) => {
    // console.log(isMouseMove)
    if (!isMouseMove) return;

    audio.currentTime = rewindedTime;
    progressPopOver.classList.remove('progressPopOver_active');
     // console.log('mouseout');
     isMouseMove = false
     // console.log(e.target);
})

progressBarClickZone.addEventListener('mousemove', (e) => {
    if (!isMouseMove) return;
    // console.log('mousemove', e);
    rewindSong(e)
})
