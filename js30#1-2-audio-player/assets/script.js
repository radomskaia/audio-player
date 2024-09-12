const SONG_DIRECTION = {
    NEXT: 'next',
    PREVIOUS: 'prev',
}
const SECONDS_IN_MINUTES = 60;
const MILLISECONDS_IN_SECOND = 1000;
const HALF_OF_SECOND = 500;
const REWIND_SPEED = 30;
const TO_PERCENT = 100;
const VOLUME = {
    MUTE: 0,
    LOW: 0.25,
    MEDIUM: 0.5,
    HIGH: 0.75,
    MAX: 1,
};
const REPEAT = {
    ALL: 0,
    ONE: 1,
    SHUFFLE: 2,
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
    {
        artist: 'Oomph',
        songName: 'Augen auf',
        audioSrc: 'assets/audio/03 Oomph Augen auf.mp3',
        coverSrc: 'assets/image/covers/03 Oomph Augen auf.jpeg',
    },

]


let isPlay, currentSongIndex = 0, audio = new Audio(), coverImg, artistName, songName, playBtn, rewindBtn, forwardBtn,
    progressCurrentTime,
    songDuration, progressBar, progressPopOver, textPopOver, rewindTime, isMouseMove, pressedTime, isPressed, nextSong,
    prevSong, isUp, arrowPressed, repeatBtn, volumeBtn, volumeValue = 0.5, repeatValue = 0, isShuffle,
    shuffleSet = new Set, bodyEl;

function createDOMElement(tagName, parentElement, ...classList) {
    const newEl = document.createElement(tagName);
    parentElement.appendChild(newEl);
    for (let i of classList) {
        newEl.classList.add(i);
    }
    return newEl
}

function init() {
    // build HTML Structure
    bodyEl = document.body;
    const container = createDOMElement('main', bodyEl, 'container');
    const footer = createDOMElement('footer', bodyEl, 'footer');
    const currYear = createDOMElement('p', footer, 'currYear');
    currYear.textContent = `${new Date().getFullYear()}`;
    const link1 = createDOMElement('a', footer, 'link');
    link1.href = 'https://github.com/radomskaia';
    link1.target = '_blank';
    const github = createDOMElement('img', link1, 'icon');
    github.alt = 'icon';
    github.src = 'assets/image/icons/icons8-github-50.png';
    const link2 = createDOMElement('a', footer, 'link');
    link2.href = 'https://rs.school/courses/javascript-ru';
    link2.target = '_blank';
    const rsSchool = createDOMElement('img', link2, 'icon');
    rsSchool.alt = 'icon';
    rsSchool.src = 'assets/image/icons/logo-rsschool3.png';
    const playerBox = createDOMElement('div', container, 'playerBox');
    const coverBox = createDOMElement('div', playerBox, 'coverBox');
    coverBox.style.height = `${coverBox.clientWidth}px`
    coverImg = createDOMElement('img', coverBox, 'coverImg');
    coverImg.alt = 'cover';
    const songBox = createDOMElement('div', playerBox, 'songBox');
    const nameBox = createDOMElement('div', songBox, 'nameBox');
    artistName = createDOMElement('h1', nameBox, 'artistName');
    songName = createDOMElement('h2', nameBox, 'songName');
    const progressBox = createDOMElement('div', songBox, 'progressBox');
    const progressBarClickZone = createDOMElement('div', progressBox, 'progressBarClickZone');
    progressPopOver = createDOMElement('div', progressBarClickZone, 'progressPopOver');
    textPopOver = createDOMElement('p', progressPopOver, 'popOver');
    progressBar = createDOMElement('div', progressBarClickZone, 'progressBar');
    const timeBox = createDOMElement('div', progressBox, 'timeBox');
    progressCurrentTime = createDOMElement('p', timeBox, 'currentTime');
    songDuration = createDOMElement('p', timeBox, 'songDuration');
    const buttonBox = createDOMElement('div', songBox, 'buttonBox');
    repeatBtn = createDOMElement('img', buttonBox, 'optionsBtn');
    rewindBtn = createDOMElement('img', buttonBox, 'rewindBtn', 'btn');
    playBtn = createDOMElement('img', buttonBox, 'playBtn', 'btn');
    forwardBtn = createDOMElement('img', buttonBox, 'rewindBtn', 'btn');
    volumeBtn = createDOMElement('img', buttonBox, 'optionsBtn');

    repeatBtn.alt = 'repeat selection button';
    rewindBtn.alt = 'play/rewind button';
    rewindBtn.src = 'assets/image/icons/icons8-rewind-64.png';
    playBtn.alt = 'play/pause button';
    playBtn.src = 'assets/image/icons/icons8-play-64.png'
    forwardBtn.alt = 'play/rewind button';
    forwardBtn.src = 'assets/image/icons/icons8-fast-forward-64.png';
    volumeBtn.alt = 'volume selection button';

    nextSong = switchSong.bind('next');
    prevSong = switchSong.bind('prev');


    renderSongData()
    showTime(true)
    changeRepeat()
    changeVolume()

    // Event Listeners
    repeatBtn.addEventListener('click', () => {
        repeatValue = repeatValue >= REPEAT.SHUFFLE ? REPEAT.ALL : repeatValue + 1;
        changeRepeat();
    });
    volumeBtn.addEventListener('click', () => {
        volumeValue = volumeValue >= VOLUME.MAX ? VOLUME.MUTE : volumeValue + 0.25;
        changeVolume();
    });
    playBtn.addEventListener('click', playPauseMusic)
    forwardBtn.addEventListener('click', nextSong);
    rewindBtn.addEventListener('click', prevSong);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    audio.addEventListener('timeupdate', showTime);
    audio.addEventListener('canplay', () => showTime(false))
    audio.addEventListener('progress', bufferedTime);
    progressBarClickZone.addEventListener('mousedown', () => isMouseMove = true);

    progressBarClickZone.addEventListener('mouseup', (e) => {
        rewindSong(e);
        stopRewind()
    });

    progressBarClickZone.addEventListener('mouseleave', () => {
        if (!isMouseMove) return;
        stopRewind()
    })

    progressBarClickZone.addEventListener('mousemove', (e) => {
        if (!isMouseMove) return;
        rewindSong(e)
    })
}

function playPauseMusic() {
    if (isPlay) audio.pause();
    else audio.play();
    isPlay = !isPlay;
    playBtn.src = isPlay ? 'assets/image/icons/icons8-pause-64.png' : 'assets/image/icons/icons8-play-64.png';
}

function randomSong() {
    if (!isShuffle) return false
    if (shuffleSet.size === album.length) shuffleSet.clear()
    shuffleSet.add(currentSongIndex);
    let setSize = shuffleSet.size;
    do {
        currentSongIndex = Math.floor(Math.random() * album.length);
        shuffleSet.add(currentSongIndex)
    } while (setSize === shuffleSet.size);
    return true
}


function switchSong() {
    if (!randomSong()) {
        if (this === SONG_DIRECTION.NEXT) currentSongIndex++;
        else if (this === SONG_DIRECTION.PREVIOUS) currentSongIndex--;

        if (currentSongIndex + 1 > album.length) currentSongIndex = 0;
        else if (currentSongIndex < 0) currentSongIndex = album.length - 1;
    }
    renderSongData()
    playPauseMusic()
}

function renderSongData() {
    bodyEl.style.backgroundImage = `linear-gradient(to bottom right, rgba(22, 66, 60, 0.8), rgba(22, 66, 60, 0.8)), url('${album[currentSongIndex].coverSrc}')`;
    audio.src = album[currentSongIndex].audioSrc;
    coverImg.src = album[currentSongIndex].coverSrc;
    artistName.textContent = album[currentSongIndex].artist;
    songName.textContent = album[currentSongIndex].songName;
    isPlay = false;
}

function keyDown(e) {
    if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')
        || (e.key !== arrowPressed && arrowPressed !== undefined)) {
        if (isPressed) {
            stopRewind(true, 'key')
            document.removeEventListener('keydown', keyDown);
        }
        return
    }
    if (!pressedTime) pressedTime = e.timeStamp;
    isPressed = e.timeStamp - pressedTime > HALF_OF_SECOND;
    arrowPressed = e.key;
    if (isPressed) {
        if (e.key === 'ArrowLeft') {
            rewindSong(e, SONG_DIRECTION.PREVIOUS);
        } else if (e.key === 'ArrowRight') {
            rewindSong(e, SONG_DIRECTION.NEXT)
        }
    }
}

function keyUp(e) {
    pressedTime = undefined;

    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.code !== 'Space') return;
    if (isUp) {
        if (e.key === arrowPressed) {
            isUp = false;
            document.addEventListener('keydown', keyDown);
            arrowPressed = undefined;
        }
        return;
    }

    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && isPressed) {
        stopRewind(false, 'key')
    } else if (e.key === 'ArrowLeft') {
        prevSong()
    } else if (e.key === 'ArrowRight') {
        nextSong()
    } else if (e.code === 'Space') {
        playPauseMusic()
    }

    arrowPressed = undefined;
}

function rewindSong(e, direction) {
    let offsetX;
    if (!direction) {
        const offsetX = e.clientX - progressBar.getBoundingClientRect().left;
        const timePercent = progressBar.clientWidth / offsetX;
        rewindTime = audio.duration / timePercent;
    } else {
        rewindTime = (e.timeStamp - pressedTime - HALF_OF_SECOND) / MILLISECONDS_IN_SECOND * REWIND_SPEED;
        rewindTime = direction === 'next' ? rewindTime : -rewindTime;
        rewindTime = audio.currentTime + rewindTime;
        if (rewindTime < 0) rewindTime = 0;
        if (rewindTime > audio.duration) rewindTime = audio.duration;
    }

    progressPopOver.classList.add('progressPopOver_active');
    const offsetPercent = rewindTime / audio.duration * TO_PERCENT;
    textPopOver.textContent = getTimeString(rewindTime);
    progressPopOver.style.left = offsetX ? `${offsetX}px` : `${offsetPercent}%`;
    progressBar.style.setProperty('--progress-width', `${offsetPercent}%`)
}

function stopRewind(bool, type) {
    if (type === 'key') {
        isPressed = false;
        isUp = bool;
    } else {
        isMouseMove = false
    }

    progressPopOver.classList.remove('progressPopOver_active');
    audio.currentTime = rewindTime;
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
    if (!isMouseMove && !isPressed) progressBar.style.setProperty('--progress-width', `${passedTime}%`);
    if (progressBar.style.getPropertyValue('--buffered-width') !== '100%') bufferedTime()
}

function bufferedTime() {
    let bufferedTime = audio.buffered.length > 0 ? audio.buffered.end(0) / audio.duration * TO_PERCENT : 0;
    progressBar.style.setProperty('--buffered-width', `${bufferedTime}%`);
}

function changeRepeat() {
    switch (repeatValue) {
        case REPEAT.ALL:
            isShuffle = false;
            shuffleSet.clear()
            audio.onended = nextSong;
            break;
        case REPEAT.ONE:
            audio.onended = switchSong;
            break;
        case REPEAT.SHUFFLE:
            isShuffle = true;
            audio.onended = nextSong;
            break;
    }
    repeatBtn.src = `assets/image/icons/icons8-repeat-${repeatValue}-64.png`;

}

function changeVolume() {
    switch (volumeValue) {
        case VOLUME.MUTE:
            audio.volume = VOLUME.MUTE;
            break;
        case VOLUME.LOW:
            audio.volume = VOLUME.LOW;
            break;
        case VOLUME.MEDIUM:
            audio.volume = VOLUME.MEDIUM;
            break;
        case VOLUME.HIGH:
            audio.volume = VOLUME.HIGH;
            break;
        case VOLUME.MAX:
            audio.volume = VOLUME.MAX;
            break;
    }
    volumeBtn.src = `assets/image/icons/icons8-volume-${volumeValue}-64.png`;
}

init()


