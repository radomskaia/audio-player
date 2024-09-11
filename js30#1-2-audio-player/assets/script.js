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
    const container = createDOMElement('main', body, 'container');
    const footer = createDOMElement('footer', body, 'footer');
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
    rewindBtn = createDOMElement('img', buttonBox, 'rewindBtn', 'btn');
    playBtn = createDOMElement('img', buttonBox, 'playBtn', 'btn');
    forwardBtn = createDOMElement('img', buttonBox, 'rewindBtn', 'btn');


    audio = new Audio();
    console.log(audio)
    isPlay = false;
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

    // Event Listeners
    playBtn.addEventListener('click', playPauseMusic)
    forwardBtn.addEventListener('click', nextSong);
    rewindBtn.addEventListener('click', prevSong);
    document.addEventListener('keydown', keyDownRewind);
    document.addEventListener('keyup', keyUpRewind);
    audio.addEventListener('ended', nextSong)
    audio.addEventListener('timeupdate', showTime);
    audio.addEventListener('canplay', () => showTime(false))
    audio.addEventListener('progress', bufferedTime);
    progressBarClickZone.addEventListener('mousedown', () => isMouseMove = true);

    progressBarClickZone.addEventListener('mouseup', (e) => {
        isMouseMove = false;
        rewindSong(e);
        progressPopOver.classList.remove('progressPopOver_active');
        audio.currentTime = rewindTime;
    });

    progressBarClickZone.addEventListener('mouseleave', (e) => {
        if (!isMouseMove) return;

        audio.currentTime = rewindTime;
        progressPopOver.classList.remove('progressPopOver_active');

        isMouseMove = false
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

function changeSongNumber() {
    if (this === SONG_DIRECTION.NEXT) songNumber++;
    else if (this === SONG_DIRECTION.PREVIOUS) songNumber--;

    if (songNumber + 1 > album.length) songNumber = 0;
    if (songNumber < 0) songNumber = album.length - 1;

    audio.src = album[songNumber].audioSrc;
    coverImg.src = album[songNumber].coverSrc;
    artistName.textContent = album[songNumber].artist;
    songName.textContent = album[songNumber].songName;
    isPlay = false;
    playPauseMusic()
}

function keyDownRewind(e) {
    // console.log('до', arrowPressed);
    if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')
        || (e.key !== arrowPressed && arrowPressed !== undefined)) {
        if (isPressed) {
            stopKeyRewind(true)
            document.removeEventListener('keydown', keyDownRewind);
            console.log('keydown removed', isUp);
        }
        return
    }
    // if (isUp) return;
    if (!isPressed) pressedTime = e.timeStamp;
    isPressed = true;
    arrowPressed = e.key;
    if (e.timeStamp - pressedTime > HALF_OF_SECOND) {
        if (e.key === 'ArrowLeft') {
            keyRewind(e, SONG_DIRECTION.PREVIOUS);
        } else if (e.key === 'ArrowRight') {
            keyRewind(e, SONG_DIRECTION.NEXT)
        }
    }
}

function stopKeyRewind(bool) {
    isPressed = false;
    progressPopOver.classList.remove('progressPopOver_active');
    console.log('PopOver removed');
    audio.currentTime += rewindTime;
    rewindTime = 0;
    isUp = bool;
}

function keyUpRewind(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.code !== 'Space') return;
    if (isUp) {
        if (e.key === arrowPressed) {
            arrowPressed = undefined;
            isUp = false;
            document.addEventListener('keydown', keyDownRewind);
        }
        return;
    }

    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && (e.timeStamp - pressedTime > HALF_OF_SECOND)) {
        stopKeyRewind(false)
        arrowPressed = undefined;
        return
    }

    arrowPressed = undefined;
    isPressed = false;
    if (e.key === 'ArrowLeft') {
        prevSong()
    } else if (e.key === 'ArrowRight') {
        nextSong()
    } else if (e.code === 'Space') {
        playPauseMusic()
    }
}

function keyRewind(e, direction) {
    rewindTime = (e.timeStamp - pressedTime) / MILLISECONDS_IN_SECOND * REWIND_SPEED;
    console.log(rewindTime);
    rewindTime = direction === 'next' ? rewindTime : -rewindTime;
    progressPopOver.classList.add('progressPopOver_active');
    console.log('popover add');
    let updatedCurrenTime = audio.currentTime + rewindTime;
    if (updatedCurrenTime < 0) updatedCurrenTime = 0;
    if (updatedCurrenTime > audio.duration) updatedCurrenTime = audio.duration;
    textPopOver.textContent = getTimeString(updatedCurrenTime);
    const offsetPercent = updatedCurrenTime / audio.duration * TO_PERCENT;
    progressPopOver.style.left = `${offsetPercent}%`
    progressBar.style.setProperty('--progress-width', `${offsetPercent}%`)

}

function rewindSong(e) {
    const offsetX = e.clientX - progressBar.getBoundingClientRect().left;
    const timePercent = progressBar.clientWidth / offsetX;
    rewindTime = audio.duration / timePercent;
    progressPopOver.classList.add('progressPopOver_active');
    textPopOver.textContent = getTimeString(rewindTime);
    progressBar.style.setProperty('--progress-width', `${rewindTime / audio.duration * TO_PERCENT}%`)
    progressPopOver.style.left = `${offsetX}px`
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


init()


