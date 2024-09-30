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
        artist: 'Suno',
        songName: 'Front-end course',
        audioSrc: 'assets/audio/01 Front-end course.mp3',
        coverSrc: 'assets/image/covers/01-Front-end-course.webp',
    },
    {
        artist: 'SUNOback',
        songName: 'Expulsion',
        audioSrc: 'assets/audio/02 Expulsion.mp3',
        coverSrc: 'assets/image/covers/02-Expulsion.webp',
    },
    {
        artist: 'Three Suno Grace',
        songName: 'Gratitude',
        audioSrc: 'assets/audio/03 Gratitude.mp3',
        coverSrc: 'assets/image/covers/03-Gratitude.webp',
    },
    {
        artist: 'Suno Park',
        songName: 'Сode of conduct',
        audioSrc: 'assets/audio/04 Сode of conduct.mp3',
        coverSrc: 'assets/image/covers/04-Сode-of-conduct.webp',
    },
    {
        artist: 'SUNOstein',
        songName: 'Cross-check',
        audioSrc: 'assets/audio/05 Cross-check.mp3',
        coverSrc: 'assets/image/covers/05-Cross-check.webp',
    },
    {
        artist: 'SU/NO',
        songName: 'Mentor',
        audioSrc: 'assets/audio/06 Mentor.mp3',
        coverSrc: 'assets/image/covers/06-Mentor.webp',
    },
    {
        artist: 'SUNOllica',
        songName: 'RS Activist',
        audioSrc: 'assets/audio/07 RS Activist.mp3',
        coverSrc: 'assets/image/covers/07-RS-Activist.webp',
    },
]


let isPlay, currentSongIndex = 0, audio = new Audio(), coverImg, artistName, songName, playBtn, rewindBtn, forwardBtn,
    progressCurrentTime,
    songDuration, progressBar, progressPopOver, textPopOver, rewindTime, isMouseMove, pressedTime, isPressed, nextSong,
    prevSong, isUp, arrowPressed, repeatBtn, volumeBtn, repeatValue = 0, isShuffle,
    shuffleSet = new Set, bodyEl, isMobile;

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
    const link1 = createDOMElement('a', footer, 'link');
    link1.href = 'https://github.com/radomskaia';
    link1.target = '_blank';
    const github = createDOMElement('img', link1, 'icon');
    github.alt = 'icon';
    github.src = 'assets/image/icons/icons8-github-50.png';
    const currYear = createDOMElement('p', footer, 'currYear');
    currYear.textContent = `${new Date().getFullYear()}`;
    const link2 = createDOMElement('a', footer, 'link');
    link2.href = 'https://rs.school/courses/javascript-ru';
    link2.target = '_blank';
    const rsSchool = createDOMElement('img', link2, 'icon');
    rsSchool.alt = 'icon';
    rsSchool.src = 'assets/image/icons/rss-logo.png';
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

    isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/.test(navigator.userAgent);

    renderSongData()
    audio.load()
    progressCurrentTime.textContent = getTimeString(audio.currentTime);
    changeRepeat()
    volumeBtn.src = `assets/image/icons/icons8-volume-${VOLUME.MAX}-64.png`;

    // Event Listeners

    repeatBtn.addEventListener('click', () => {
        repeatValue = repeatValue >= REPEAT.SHUFFLE ? REPEAT.ALL : repeatValue + 1;
        changeRepeat();
    });
    volumeBtn.addEventListener('click', () => {
        const volumeValue = audio.volume <= VOLUME.MUTE ? VOLUME.MAX : audio.volume - 0.25;
        changeVolume(volumeValue);
    });
    playBtn.addEventListener('click', playPauseMusic)
    forwardBtn.addEventListener('click', nextSong);
    rewindBtn.addEventListener('click', prevSong);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    audio.addEventListener('timeupdate', showProgress);
    audio.addEventListener('canplay', () => songDuration.textContent = getTimeString(audio.duration))
    audio.addEventListener('progress', bufferedTime);
    if (isMobile) {
        progressBarClickZone.addEventListener('touchstart', () => isMouseMove = true)
        progressBarClickZone.addEventListener('touchend', (e) => {
            rewindSong(e);
            stopRewind();
        })
        progressBarClickZone.addEventListener('touchmove', (e) => {
            e.preventDefault()
            rewindSong(e)
        }, {passive: false});
    } else {
        progressBarClickZone.addEventListener('mousedown', () => isMouseMove = true);

        progressBarClickZone.addEventListener('mouseup', (e) => {
            rewindSong(e);
            stopRewind();
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
}

function playPauseMusic() {
    if (isPlay) audio.pause();
    else audio.play();
    coverImg.classList.toggle('coverImg_played');
    isPlay = !isPlay;
    playBtn.src = isPlay ? 'assets/image/icons/icons8-pause-64.png' : 'assets/image/icons/icons8-play-64.png';
}

function randomSong() {
    if (shuffleSet.size === album.length) shuffleSet.clear()
    shuffleSet.add(currentSongIndex);
    let setSize = shuffleSet.size;
    do {
        currentSongIndex = Math.floor(Math.random() * album.length);
        shuffleSet.add(currentSongIndex)
    } while (setSize === shuffleSet.size);
}


function switchSong() {
    if (typeof this !== 'object') {
        if (isShuffle) randomSong();
        else {
            this === SONG_DIRECTION.NEXT ? currentSongIndex++ : currentSongIndex--;

            if (currentSongIndex + 1 > album.length) currentSongIndex = 0;
            else if (currentSongIndex < 0) currentSongIndex = album.length - 1;
        }
        renderSongData()
    }
    if (isPlay) playPauseMusic();
    playPauseMusic()
}

function renderSongData() {
    audio.src = album[currentSongIndex].audioSrc;
    coverImg.src = album[currentSongIndex].coverSrc;
    bodyEl.style.backgroundImage = `linear-gradient(to bottom right, rgba(196, 218, 210, 0.8), rgba(196, 218, 210, 0.8)), url('${album[currentSongIndex].coverSrc}')`;
    artistName.textContent = album[currentSongIndex].artist;
    songName.textContent = album[currentSongIndex].songName;
}

function keyDown(e) {
    if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')
        || (arrowPressed !== undefined) && e.key !== arrowPressed) {
        if (isPressed) {
            stopRewind(true, 'key')
            document.removeEventListener('keydown', keyDown);
        }
        return
    }
    if (!pressedTime) pressedTime = e.timeStamp;
    isPressed = e.timeStamp - pressedTime > HALF_OF_SECOND;
    arrowPressed = e.key;
    if (isPressed) rewindSong(e, e.key === 'ArrowLeft' ? SONG_DIRECTION.PREVIOUS : SONG_DIRECTION.NEXT);
}

function keyUp(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.code !== 'Space') return;

    pressedTime = undefined;
    if (isUp) {
        if (e.key === arrowPressed) {
            isUp = false;
            document.addEventListener('keydown', keyDown);
            arrowPressed = undefined;
        }
        return;
    }

    if (e.code === 'Space') {
        playPauseMusic()
    } else if (isPressed) {
        stopRewind(false, 'key')
    } else if (e.key === 'ArrowLeft') {
        prevSong()
    } else if (e.key === 'ArrowRight') {
        nextSong()
    }

    arrowPressed = undefined;
}

function rewindSong(e, direction) {
    let offsetX;
    if (!direction) {
        const progressBarLeftOffset = progressBar.getBoundingClientRect().left;
        if (isMobile) {
            const touch = e.touches[0] || e.changedTouches[0];
            offsetX = touch.clientX - progressBarLeftOffset;
        } else {
            offsetX = e.clientX - progressBarLeftOffset;
        }

        let timePercent = progressBar.clientWidth / offsetX;
        rewindTime = audio.duration / timePercent;
    } else {
        rewindTime = (e.timeStamp - pressedTime - HALF_OF_SECOND) / MILLISECONDS_IN_SECOND * REWIND_SPEED;
        rewindTime = direction === 'next' ? rewindTime : -rewindTime;
        rewindTime = audio.currentTime + rewindTime;
    }

    if (rewindTime < 0) rewindTime = 0;
    else if (rewindTime > audio.duration) rewindTime = audio.duration;
    progressPopOver.classList.add('progressPopOver_active');
    let offsetPercent = rewindTime / audio.duration * TO_PERCENT;
    if (offsetPercent > 100) offsetPercent = 100;
    else if (offsetPercent < 0) offsetPercent = 0;
    textPopOver.textContent = getTimeString(rewindTime);
    progressPopOver.style.left = `${offsetPercent}%`;
    progressBar.style.setProperty('--progress-width', `${offsetPercent}%`)
}

function stopRewind(bool = false, type = 'mouse') {
    if (type === 'key') {
        isPressed = false;
        isUp = bool;
    } else {
        isMouseMove = false
    }
    progressPopOver.classList.remove('progressPopOver_active');
    // console.log(audio.currentTime)
    audio.currentTime = rewindTime;
}

function getTimeString(time) {
    const timeMin = Math.floor(time / SECONDS_IN_MINUTES);
    const timeSec = Math.floor(time % SECONDS_IN_MINUTES);
    return `${timeMin}:${timeSec.toString().padStart(2, '0')}`
}

function showProgress() {
    const passedTime = audio.currentTime / audio.duration * 100;
    progressCurrentTime.textContent = getTimeString(audio.currentTime)
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

function changeVolume(volumeValue) {
    if (isMobile) {
        audio.muted = !audio.muted;
        if (audio.muted) volumeBtn.src = `assets/image/icons/icons8-volume-${VOLUME.MUTE}-64.png`;
        else volumeBtn.src = `assets/image/icons/icons8-volume-${VOLUME.MAX}-64.png`;
        return
    }
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

console.log(
    `
    Доп. функционал: 
    - перелистывание/перемотка/воспроизведение с клавиатуры (нажать на стрелки - переключение трека, зажатие стрелки - перемотка, пробел - Play/Pause
    - адаптация для мобильных устройств (перетягивание ползунка реализовано не только мышкой, но и тачем)
    - полоса буферизации
    - поповер при перемотке с временем перемотки
    - идеально подобранный плейлист и неплохой дизайн. 
    `
)
