
//ПЕРЕМЕННЫЕ

let rightPosition = 0;
let imgBlockPosition = 0;
let direction = 'right';
let timer = null;
let x = 0;
let halfWidth = window.screen.width / 2;
let hit = false;
let jump = false;
let fall = false;


let heroImg = document.getElementById('hero-img'); //КАРТИНКА ГЕРОЯ
let imgBlock = document.getElementById('imgBlock'); //БЛОК С КАРТИНКОЙ ГЕРОЯ
let canvas = document.getElementById('canvas'); // ОСНОВНОЙ ХОЛСТ ВСЕЙ ИГРЫ
let fsBtn = document.getElementById('fsBtn'); //КНОПКА ПЕРЕХОДА В ПОЛНОЭКРАННЫЙ РЕЖИМ
let info = document.getElementById('info');
let tileArray = [];
let imgBlockStyle = window.getComputedStyle(imgBlock);

let heroX = Math.ceil((Number.parseInt(window.getComputedStyle(imgBlock).getPropertyValue('left')) + 32)/ 32); 
let heroY = Math.ceil(Number.parseInt(window.getComputedStyle(imgBlock).getPropertyValue('bottom'))/ 32);


let jumpBlock = document.getElementById('jump-block'); //КНОПКА ПРЫЖКА
jumpBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`; //ПОЗИЦИЯ КНОПКИ ПРЫЖКА

let hitBlock = document.getElementById('hit-block'); //КНОПКА УДАРА
hitBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`; //ПОЗИЦИЯ КНОПКИ УДАРА




heroImg.onclick = (event) => {
    event.preventDefault();
} 


//ФУНКЦИЯ ПЕРЕХОДА В ПОЛНОЭКРАННЫЙ РЕЖИМ
fsBtn.onclick = () => {
    if(window.document.fullscreenElement !== null){
        fsBtn.src = 'img/fullscreen.png';
        window.document.exitFullscreen();
    }else {
        fsBtn.src = 'img/cancel.png';
        canvas.requestFullscreen();
    }
}


//ФУНКЦИИ

const hitHendler = () => {
    switch(direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1, 1)';
            if(rightPosition > 4){
                rightPosition = 1;
                hit = false;
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1, 1)';
            if(rightPosition > 3){
                rightPosition = 0;
                hit = false;
            }
            break;
        }
        default: break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-288px'; //+
}


const jumpHendler = () => {
    switch(direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1, 1)';
            if(rightPosition > 4){
                rightPosition = 1;
                jump = false;
                imgBlock.style.bottom = `${Number.parseInt(imgBlockStyle.getPropertyValue('bottom')) + 160}px`;
                imgBlockPosition = imgBlockPosition + 10;
                imgBlock.style.left = `${imgBlockPosition * 20}px`;
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1, 1)';
            if(rightPosition > 3){
                rightPosition = 0;
                jump = false;
                imgBlock.style.bottom = `${Number.parseInt(imgBlockStyle.getPropertyValue('bottom')) + 160}px`;
                imgBlockPosition = imgBlockPosition - 10;
                imgBlock.style.left = `${imgBlockPosition * 20}px`;
            }
            break;
        }
        default: break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-96px';
}

const updateHeroXY = () => {
    heroX = Math.ceil((Number.parseInt(window.getComputedStyle(imgBlock).getPropertyValue('left')) + 32)/ 32); 
    heroY = Math.ceil(Number.parseInt(window.getComputedStyle(imgBlock).getPropertyValue('bottom'))/ 32);

    info.innerText = `heroX = ${heroX}, heroY = ${heroY}`;
}

const checkFalling = () => {
    updateHeroXY();
    let isFalling = true;
    for(let i = 0; i < tileArray.length; i++){
        if((tileArray[i][0] === heroX) && ((tileArray[i][1] + 1) === heroY)){
            isFalling = false;
        }
    }
    if(isFalling) {
        info.innerText = info.innerText + ', Falling';
        fall = true;
    } else {
        info.innerText = info.innerText + ', not Falling';
        fall = false;
    }
}

const fallHendler = () => {
    heroImg.style.top = '-96px';
    imgBlock.style.bottom = `${Number.parseInt(imgBlockStyle.getPropertyValue('bottom')) - 40}px`;
    checkFalling();
}

//ФУНКЦИЯ АНИМАЦИИ И ПЕРЕДВИЖЕНИЯ ВПРАВО
const rightHendler = () => {
    heroImg.style.transform = 'scale(-1, 1)';
    rightPosition = rightPosition + 1;
    imgBlockPosition = imgBlockPosition + 1;
    if(rightPosition > 5){
        rightPosition = 0;
    }
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-192px';
    imgBlock.style.left = `${imgBlockPosition * 20}px`;

    checkFalling();
}

//ФУНКЦИЯ АНИМАЦИИ И ПЕРЕДВИЖЕНИЯ ВЛЕВО
const leftHendler = () => {
    heroImg.style.transform = 'scale(1, 1)';
    rightPosition = rightPosition + 1;
    imgBlockPosition = imgBlockPosition - 1;
    if(rightPosition > 5){
        rightPosition = 0;
    }
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-192px';
    imgBlock.style.left = `${imgBlockPosition * 20}px`;

    checkFalling();
}

//ФУНКЦИЯ АНИМАЦИИ СОСТОЯНИЯ НА МЕСТЕ
const standHendler = () => {
    switch(direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1, 1)';
            if(rightPosition > 4){
                rightPosition = 1;
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1, 1)';
            if(rightPosition > 3){
                rightPosition = 0;
            }
            break;
        }
        default: break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '0px';

    checkFalling();
}

//ФУНКЦИЯ ВЫЗЫВАЮЩАЯ ТАЙМЕР ДЛЯ ЗАПУСКА ФУНКЦИИ СОСТОЯНИЯ НА МЕСТЕ 



//ОБРАБОТЧИКИ СОБЫТИЙ

jumpBlock.onclick = () => {jump = true};
hitBlock.onclick = () => {hit = true};

//ФУНКЦИЯ ЗАПУСКАЮЩАЯ АНИМАЦИЮ ДВИЖЕНИЯ ПРИ НАЖАТИИ
let onTouchStart = (event) => {
    clearInterval(timer);
    if(event.type === 'mousedown'){
        x = event.screenX;
    } else {
        x = event.touches[0].screenX;
    }
    
    timer = setInterval(() => {
        if(x > halfWidth) {
            direction = 'right';
            rightHendler();
        } else {
            direction = 'left';
            leftHendler();
        }
        
    }, 130);
}

//ФУНКЦИЯ ОТКЛЮЧАЮЩАЯ АНИМАЦИЮ ДВИЖЕНИЯ
let onTouchEnd = (event) => {
    clearInterval(timer);
    lifeCycle();
}

window.onmousedown = onTouchStart;
window.ontouchstart = onTouchStart;

window.onmouseup = onTouchEnd;
window.ontouchend = onTouchEnd;


const createTile = (x, y = 1) => {
    let tile = document.createElement('img');
    tile.src = 'assets/1 Tiles/Tile_02.png';
    tile.style.position = 'absolute';
    tile.style.left = `${x * 32}px`;
    tile.style.bottom = `${y * 32}px`;
    canvas.appendChild(tile);

    tileArray.push([x, y]);
}

const createTilesPlatform = (startX, startY, length) => {
    for(let i = 0; i < length; i++) {
        createTile(startX + i, startY);
    }
}

const addTiles = (i) => {
    createTile(i);
    let tileBlack = document.createElement('img');
    tileBlack.src = 'assets/1 Tiles/Tile_04.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = `${i * 32}px`;
    tileBlack.style.bottom = '0px';
    canvas.appendChild(tileBlack);
}

const lifeCycle = () => {
    timer = setInterval(() => {
        if (hit) {
            hitHendler();
        }else if (jump) {
            jumpHendler();
        }else if (fall) {
            fallHendler();
        } else {
            standHendler();
        }
    }, 150);
}

const start = () => {
    lifeCycle();
    for(let i = 0; i < 60; i = i + 1){
        if((i > 12) && (i < 17)){
            continue;
        }
        addTiles(i);
    }

    createTilesPlatform(10, 10, 10);
    createTilesPlatform(20, 5, 10);
    createTilesPlatform(40, 8, 10);
    createTilesPlatform(25, 15, 10);

}


start();