const fullContainer = document.querySelector('#full-container');
const startPage = document.querySelector('.start-page');
const startPageBt = document.querySelector('.start-page > article > button');
const presentationPag = document.querySelector('.presentationPage');
const presentation = document.querySelector('.presentation');
const marioDiv = document.querySelector('.marioDiv');
const presentationButton = document.querySelector('.presentationButton');
const presentationText = document.querySelector('.presentationText').innerHTML=presentationTexts['presentation'];
const boardContainer = document.querySelector('.board-container');
const board = document.querySelector('.board');
const points = document.querySelector('.points');

const Loading = function(){
    this.loadingPage;
    this.loadingGif;
    this.loadingPic;
    this.loadingDegree = 0;
    this.loadingAnimation;
    this.loadingAnimationCount = 0;
}
Loading.prototype = {
    loading:function(loading){
        let loadingDiv = document.createElement('div');
        loadingDiv.classList.add('loadingPage');
        fullContainer.append(loadingDiv);
        loading.loadingPage = document.querySelector('.loadingPage');

        let loadingDivGif = document.createElement('div');
        loadingDivGif.classList.add('loadingGif');
        loadingDiv.append(loadingDivGif);
        loading.loadingGif = document.querySelector('.loadingGif');

        let loadingDivPic = document.createElement('div');
        loadingDivPic.classList.add('loadingPic');
        loading.loadingPage.append(loadingDivPic);
        loading.loadingPic = document.querySelector('.loadingPic');
    },
    moveGif:function(){
        let animation = this;
        this.loadingAnimationCount++;
        if(this.loadingAnimationCount > 20){
            this.loadingAnimationCount = 0;
            this.loadingDegree += 15;
            this.loadingGif.style.transform='rotate('+this.loadingDegree+'deg)';
        }

        this.loadingAnimation = requestAnimationFrame(function(){
            animation.moveGif();
        });
    },
    movePic:function(){
        let picDegree = 0;
        this.loginInterval = setInterval(()=>{
            picDegree += 180;
            this.loadingPic.style.transform='rotateY('+picDegree+'deg)';
        }, 2000);
    },
    stopGif:function(){
        cancelAnimationFrame(this.loadingAnimation);
        clearInterval(this.loginInterval);
    }
}

const StartPage = function(loading, presentationPage, gameRules){
    this.loading = loading;
    this.presentationPage = presentationPage;
    this.gameRules = gameRules;
}
StartPage.prototype = {
    enterButton:function(){
        let presentationPage = this.presentationPage;
        let loading = this.loading;
        let gameRules = this.gameRules;
        startPageBt.addEventListener('click', function(){
            presentationPag.style.display='block';
            presentationPag.style.transform='scale(1) translateY(0%)';
            
            startPage.style.opacity='0';
            startPage.style.zIndex='-1';
            gameRules.selectedMusic=3;
            gameRules.playMusic(gameRules.musicsNameArray[gameRules.selectedMusic], gameRules);
            presentationPage.presentationPageOnload();
        });
    },
    loadingStartPage:function(){
        let loading = this.loading;
        window.onload = function(){
            
            setTimeout(()=>{
            loading.loadingPage.style.transform='translateY(-200%)';
            loading.stopGif();
            startPage.style.opacity='1';     
            
            },2500);
        };
    }
}

const PresentationPage = function(loading, cards, gameState, boardConfig, gameRules, timer){
    this.loading = loading;
    this.cards = cards;
    this.gameRules   = gameRules;
    this.gameState = gameState;
    this.boardConfig = boardConfig;
    this.timer = timer;
}
PresentationPage.prototype = {
    presentationPageOnload:function(){
       
            this.presentationShow();
            this.playButton();
     
}, 
presentationShow:function(){
    let gameRules = this.gameRules;
    setTimeout(()=>{
        marioDiv.style.transform='translateX(250%)';
        document.querySelector('.presentationText').style.transform='translateX(0%)';
    },100);
},
    playButton:function(){
        let cards = this.cards;
        let gameState = this.gameState;
        let boardConfig = this.boardConfig;
        let gameRules = this.gameRules;
        let timer = this.timer;

        presentationButton.addEventListener('click', function(){
            presentationPag.style.transform='translateX(100%)';
            boardContainer.style.transform='translateX(0%)';
            setTimeout(async ()=>{
                timer.initTimer();
                gameRules.playSound('play',gameRules);
            
            gameRules.pauseMusic(gameRules.musicsNameArray[gameRules.selectedMusic], gameRules);
            await gameRules.sortMusic();
            gameRules.playMusic(gameRules.musicsNameArray[gameRules.selectedMusic], gameRules);
            gameRules.backgroundChange(gameRules.selectedMusic);
            }, 1000);
            
            setTimeout(()=>{
                cards.sortCards(cards, gameState, boardConfig);
            }, 1200);
        });
    }
}

const GameState = function(){
    this.state=false;
}
GameState.prototype = {
    on:function(){
        this.state=true;
    },
    off:function(){
        this.state=false;
    }
}
const Cards = function(){
    this.cardNumb = 36;
    this.cardWidth = 100;
    this.cardElement;
    this.cardElementFront;
    this.cardElementBack;
    this.countIgual=0;
    this.resetCountIgual=0;
    this.selectedCard;
    this.selectedCardId;
    this.selectedCardArray = [];
    this.selectedCardIdArray = [];
    this.matchCards = [];
    this.sortArray=[];
    this.cardImagesArray = [];
}

Cards.prototype = {
    createCards : function(){
        for(let i=0; i < this.cardNumb; i++){

        let cardDiv = document.createElement('div');
        cardDiv.classList.add('cards');
        cardDiv.setAttribute('id', i);
        cardDiv.setAttribute('data-even', this.countIgual);
        board.append(cardDiv);
        this.cardElement = document.querySelectorAll('.cards');

        let cardFrontDiv = document.createElement('div');
        cardFrontDiv.classList.add('cards-front');
        cardDiv.append(cardFrontDiv);
        this.cardElementFront = document.querySelectorAll('.cards-front');

        let cardBackDiv = document.createElement('div');
        cardBackDiv.classList.add('cards-back');
        cardDiv.append(cardBackDiv);
        this.cardElementBack = document.querySelectorAll('.cards-back');

        this.resetCountIgual++;
         
        if(this.resetCountIgual > 1){
            this.resetCountIgual = 0;
            this.countIgual++;
        }
        if(i == this.cardNumb-1){
            this.countIgual=0;
            this.resetCountIgual=0;
        }
        }
        
    },
    sortCards:async function(cards, gameState, boardConfig){
        
            let randomCardId;
            let countRow = 30;
            let countColumn = 0;
            while(cards.sortArray.length < cards.cardElement.length){
                randomCardId = Math.floor(Math.random()*cards.cardElement.length);
                if(!cards.sortArray.includes(randomCardId)){
                    cards.sortArray.push(randomCardId);
                }
            }
       
            if(cards.sortArray.length === cards.cardElement.length){
                await boardConfig.reorderCardsCoords(cards, gameState, boardConfig);
                boardConfig.reorderCardsExecute(cards, boardConfig);
            }
            
    },
    preLoadImages:function(cards){
        let countImage = 0;
        Array.from(this.cardElementBack).map((value, key)=>{
            if(value.parentElement.id > 0 && value.parentElement.id % 2 == 0){
                countImage++;
            }
            value.style.backgroundImage="url('Fotos/"+countImage+".png')";
        });
        Array.from(cards.cardElementFront).forEach((front)=>{
            front.style.backgroundImage='url(Fotos/logo.png)';
        });
    }
}

const GameRules = function(boardConfig, timer){
    this.timer = timer
    this.soundTrack;
    this.musicTrack;
    this.soundArray = [];
    this.countTrys=0;
    this.countErrors=0;
    this.countPoints = 0;
    this.boardConfig = boardConfig;
    this.currentSound='coin';
    this.soundsNameArray = ['coin', 'play', 'select', 'wrong'];
    this.soundsArray = []
    this.musicsNameArray = ['Athletic', 'Fortress', 'Haunted House', 'Overworld', 'Overworld2', 'Overworld3', 'Swimming', 'Underground'];
    this.musicsArray = [];
    this.selectedMusic;
    this.playedResult='';
    this.backgroundArray = [];
    this.backgroundElement;
}

GameRules.prototype = {
    selectCards:function(cards, gameRules, gameState){
        
        cards.cardElement.forEach((element)=>{

            element.addEventListener('click', function(){
                
                if(gameState.state){
                if(!cards.matchCards.includes(element.id) && !cards.selectedCardIdArray.includes(element.id)){
                    
                cards.selectedCard = element.dataset.even ;
                cards.selectedCardId = element.id ;
                cards.selectedCardArray.push(cards.selectedCard);
                cards.selectedCardIdArray.push(cards.selectedCardId);
                gameRules.verifyIgual(cards, gameRules, gameState);
                gameRules.flipCard(state=null, cards, element, gameState);
                }
                }
            });
            
        });
    },
    verifyIgual:function(cards, gameRules, gameState){
        
        switch(true){
            case cards.selectedCardArray.length == 1:
                gameRules.pauseSound();
                gameRules.playSound('select', gameRules);
            break;
            case cards.selectedCardArray.length == 2 && cards.selectedCardArray[0] == cards.selectedCardArray[1]:
                cards.matchCards.push(...cards.selectedCardIdArray);
                cards.selectedCardArray = [];
                cards.selectedCardIdArray = [];
                gameRules.playedResult=true;
                
                gameState.off();
                gameRules.endGame(cards, gameRules, gameState);
                gameRules.pauseSound();
                gameRules.playSound('select',gameRules);
                setTimeout(()=>{
                    gameRules.pauseSound();
                    gameRules.playSound('coin',gameRules);
                }, 500);
                
            break;
            case cards.selectedCardArray.length == 2 && cards.selectedCardArray[0] !== cards.selectedCardArray[1]:
            gameRules.playedResult=false;
            
            gameRules.flipCard('no', cards, gameRules, gameState);
            gameState.off();
            gameRules.pauseSound();
            gameRules.playSound('select',gameRules);
            setTimeout(()=>{
                gameRules.pauseSound();
                gameRules.playSound('wrong', gameRules);
            }, 500);
            
            break;
            default:
            
        }   
    },
    
    flipCard:function(state, cards, element, gameState){
       
       switch(state){
           case null:
            element.style.transition='none';
            element.style.transition='0.5s ease';
                element.style.transform='rotateY(180deg)';
                
           break;
           case 'no':
           setTimeout(()=>{
            cards.selectedCardIdArray.forEach((element)=>{
            
            cards.cardElement[element].style.transform='rotateY(0deg)';
            
           });
           cards.selectedCardArray = [];
            cards.selectedCardIdArray = [];
            gameState.on();
           }, 1000);
           break;
           default:
           
       }
    },
    computePoints:function(gameRules, cards){
        if(cards.matchCards.length !== cards.cardElement.length){
        switch(gameRules.playedResult){
            case true:
                gameRules.countTrys += 1;
                gameRules.countPoints += 1;
                
            break;
            case false:
                gameRules.countTrys += 1;
                gameRules.countErrors += 1;
                
            break;
            default:
        }
        
        points.innerHTML ='Plays: '+gameRules.countTrys+'  |   Pairs: '+gameRules.countPoints+'   |   Erros: '+gameRules.countErrors+'   <br><br>   Time Elapsed: '+this.timer.timer;
        let computedPoints = this;
        gameRules.playedResult='';
        requestAnimationFrame(function(){
            
            computedPoints.computePoints(gameRules, cards);
        });
    }
    },
    preLoadSounds:function(gameRules){
        
        this.soundsNameArray.map((value, key)=>{
            this.soundsArray.push('Sons/'+value+'.wav');
            let soundTrackDiv = document.createElement('audio');
            soundTrackDiv.setAttribute('src', this.soundsArray[key]);
            soundTrackDiv.classList.add('soundTrack');
            document.body.append(soundTrackDiv);
            gameRules.soundTrack = document.querySelectorAll('.soundTrack');
        });
    },
    playSound:function(sound, gameRules){
        let soundToPlay = this.soundsNameArray.indexOf(sound);
        this.currentSound = gameRules.soundTrack[soundToPlay];
        this.currentSound.play();
    },
    pauseSound:function(){
        this.currentSound.pause();
        this.currentSound.currentTime=0;
    },
    preLoadMusics:function(gameRules){

        this.musicsNameArray.map((value, key)=>{
            this.musicsArray.push('Music/'+value+'.mp3');
            let musicTrackDiv = document.createElement('audio');
            musicTrackDiv.classList.add('musicTrack');
            musicTrackDiv.setAttribute('src', this.musicsArray[key]);
            musicTrackDiv.setAttribute('type', 'audio/mp3');
            musicTrackDiv.setAttribute('loop', 'on');
            musicTrackDiv.setAttribute('preload', 'on');
            document.body.append(musicTrackDiv);
            gameRules.musicTrack = document.querySelectorAll('.musicTrack');
        });
    },
    playMusic:function(music, gameRules){
        let musicToPlay = this.musicsNameArray.indexOf(music);
        setTimeout(()=>{
            gameRules.musicTrack[musicToPlay].play();
        },500);
        
    },
    pauseMusic:function(music, gameRules){
        let musicToPlay = this.musicsNameArray.indexOf(music);
        gameRules.musicTrack[musicToPlay].pause();
    },
    sortMusic:function(){
        this.selectedMusic = Math.floor(Math.random()*this.musicsNameArray.length);
    },
    preLoadBackgroundImages:function(){
        
        for(let i=0; i < this.musicsNameArray.length; i++){
            let backgroundImg = document.createElement('img');
            backgroundImg.setAttribute('src', 'Cenarios/'+i+'.jpg');
            backgroundImg.classList.add('backgroundImage');
            boardContainer.append(backgroundImg);
            this.backgroundElement = document.querySelectorAll('.backgroundImage');
            this.backgroundArray.push(this.backgroundElement);
        }
            
            
        
        
    },
    backgroundChange:function(cenario){
        Array.from(this.backgroundElement).map((value, key)=>{
            value.style.opacity='0';
        });
        this.backgroundElement[cenario].style.opacity='1';
    },
    endGame:function(cards, gameRules, gameState){
        if(cards.matchCards.length == cards.cardElement.length){
            gameState.off();
            points.innerHTML = 'Congratulations you win!';
            setTimeout(()=>{
                gameRules.resetBoard(cards, gameRules, gameState);
            }, 1000);
            
        }else{
            gameState.on();
        }
    },
    resetBoard:function(cards, gameRules, gameState){
        points.innerHTML = 'The game will reestart, await!';
        //gameState.off();
        setTimeout(()=>{
            Array.from(cards.cardElement).forEach((element)=>{
                element.style.transform='rotateY(0deg)';
                
            });
        },1000);
            
        setTimeout(()=>{
            Array.from(cards.cardElement).forEach(async (element)=>{
            
            gameRules.countPoints = 0;
            gameRules.countTrys = 0;
            gameRules.countErrors = 0;
            gameRules.playedResult='';
            this.timer.timerSeconds='00';
            this.timer.timerMinutes='00';
            cards.matchCards=[];
            cards.sortArray = [];
            cards.sortCards(cards, gameState, this.boardConfig);
            gameRules.pauseMusic(gameRules.musicsNameArray[gameRules.selectedMusic], gameRules);
            await gameRules.sortMusic();
            gameRules.playMusic(gameRules.musicsNameArray[gameRules.selectedMusic], gameRules);
            gameRules.backgroundChange(gameRules.selectedMusic);
            gameRules.computePoints(gameRules, cards);
        });
        //gameState.on();
        }, 2000);
    }
}

function Timer(){
    this.timerSeconds;
    this.timerMinutes;
    this.timerRequestSeconds;
    this.timer='00:00';
}
Timer.prototype = {
    initTimer:function(){

        this.timerSeconds = '00';
        this.timerMinutes = '00';
        
        let initTimerAnimation = this;
        
        this.timerRequestSeconds = setInterval(()=>{
           this.timerSeconds++;
            if(this.timerSeconds < 10){
                this.timerSeconds = '0'+this.timerSeconds;
            }
            if(this.timerSeconds > 59){
                this.timerSeconds = '00';
                this.timerMinutes++;

                if(this.timerMinutes < 10){
                    this.timerMinutes = '0'+this.timerMinutes;
                }
            }
            this.timer = this.timerMinutes + ':' + this.timerSeconds;
        }, 1000);
    }
}
const BoardConfig = function(cards){
    this.cards = cards;
    this.screenSize = Math.floor(Math.floor(window.innerWidth / this.cards.cardElement[0].offsetWidth)*this.cards.cardElement[0].offsetWidth);
    this.countRow;
    this.countRowArray = [];
    this.countColumnArray = [];
    this.countColumn=0;
    this.marginCalc;
}
BoardConfig.prototype = {
    boardResize:function(cards, boardConfig, gameState){
        window.addEventListener('resize', function(){
            boardConfig.screenSize = Math.floor(Math.floor(window.innerWidth / cards.cardElement[0].offsetWidth)*cards.cardElement[0].offsetWidth);
            
            if(boardConfig.screenSize % cards.cardWidth !== 0){
                    
                    boardConfig.reorderCardsCoords(cards, gameState, boardConfig);
                    boardConfig.reorderCardsExecute(cards, boardConfig);
                    
                }
            
        });
    },
    reorderCardsCoords:function(cards, gameState, boardConfig){
        
            let countRow = this.countRow  = 5;
            let countColumn = this.countColumn = 0;
            this.countRowArray = [];
            this.countColumnArray = [];
            this.marginCalc = (this.screenSize - board.offsetWidth)/2;
            
            if(this.marginCalc < 0){
                this.marginCalc = (this.marginCalc) * -1;
            }
            
        if(cards.sortArray.length === cards.cardElement.length && window.innerWidth >= 300){
            
                Array.from(cards.sortArray).forEach((element)=>{
                    
                    if(countColumn > 0 && countColumn > (board.offsetWidth - cards.cardElement[element].offsetWidth)){
                        
                        countRow +=  cards.cardElement[element].offsetHeight;
                        countColumn=0;
                    }
                    boardConfig.countColumnArray.push(countColumn);
                    boardConfig.countRowArray.push(countRow);
                    
                    countColumn +=  cards.cardElement[element].offsetWidth;
                });
                
                if(cards.sortArray.length == cards.cardElement.length){
                    gameState.on();
                }
            }
    },
    reorderCardsExecute:function(cards, boardConfig){
        
        Array.from(cards.cardElement).map((value, key)=>{
            value.style.transition='1.5s ease';
            value.style.transitionDelay = boardConfig.countRowArray[cards.sortArray[key]] / 1000 +'s'; 
            value.style.marginLeft = boardConfig.countColumnArray[cards.sortArray[key]] + boardConfig.marginCalc+'px';                
            value.style.marginTop = boardConfig.countRowArray[cards.sortArray[key]]+'px';
        });            
    }
}


async function initGame(){
    
    const gameState = new GameState();
    
    const timer = new Timer();

    const cards = new Cards();
    await cards.createCards();
    await cards.preLoadImages(cards);
    
    
    const boardConfig = new BoardConfig(cards);
    boardConfig.boardResize(cards, boardConfig, gameState);
    
    const gameRules = new GameRules(boardConfig, timer);
    gameRules.computePoints(gameRules, cards);
    gameRules.preLoadSounds(gameRules);
    gameRules.preLoadMusics(gameRules);
    gameRules.preLoadBackgroundImages();
    gameRules.selectCards(cards, gameRules, gameState);
    
    const loading = new Loading();
    loading.loading(loading);
    loading.moveGif();
    loading.movePic();

    const presentationPage = new PresentationPage(loading, cards, gameState, boardConfig, gameRules, timer);
    
    const startPage = new StartPage(loading, presentationPage, gameRules);
    startPage.enterButton();
    startPage.loadingStartPage();
}

async function cookiesVerify(){
    
    if(!document.cookie.memoryCard){
    let nameValue = 'name=memoryCard;';
    let dateNow = 'expireson='+Number(Date.now())+10+';';
    let path = 'path=/;'
    let cookie = nameValue+dateNow+path;
        document.cookie = cookie;
        initGame();
    }else{
        initGame();
    }
}
cookiesVerify();