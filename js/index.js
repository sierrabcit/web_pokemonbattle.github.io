//variables
var music = {},
    typeSprite = '',
    types = [],
    gameData = {},
    attackName = '',
    curAttack = {},
    randInt = 0,
    enemyAttack = {},
    characters = [],
    defendProgressInt = null,
    defendProgressComplete = 0,
    progressInt = null,
    progressComplete = 0;

function buildVars(){
  music = {
    opening: "../music/opening.mp3",
    battle: "../music/battle.mp3",
    victory: "../music/victory.mp3",
    charmander: "../music/charmander.mp3",
    squirtle: "../music/squirtle.mp3",
    bulbasaur: "../music/bulbasaur.mp3"
  }


/*
  typeSprite = 'http://orig15.deviantart.net/24d8/f/2011/057/3/5/ge___energy_type_icons_by_aschefield101-d3agp02.png';
  types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];
*/
  gameData = {
    step: 1,
    hero: {},
    enemy: {}
  }

  attackName = '';
  curAttack = {};
  randInt = 0;
  enemyAttack = {};
  defendProgressInt = null;
  defendProgressComplete = 0;
  progressInt = null;
  progressComplete = 0;


  characters = [
   
    {
      name: "charmander",
      type: 'fire',
      weakness: ['water'],
      resistance: ['grass'],
      img: {
        default: "../svg/charicon.svg",
        front: "../svg/charfront.svg",
        back: "../svg/charback.svg"
      },
      hp: {
        current: 500,
        total: 500
      },
      attacks: [
        {
          name: "ember",
          hp: randomNum(40,20),
          avail: {
            total: 30,
            remaining: 30
          }
        },
        {
          name: "flamethrower",
          hp: randomNum(60,45),
          avail: {
            total: 10,
            remaining: 10
          }
        },
        {
          name: "burning tail",
          hp: randomNum(75,60),
          avail: {
            total: 5,
            remaining: 5
          }
        },
        {
          name: "fire spin",
          hp: randomNum(160, 130),
          avail: {
            total: 2,
            remaining: 2
          }
        }
      ]
    },
    {
      name: "squirtle",
      type: 'water',
      weakness: ['electric','grass'],
      resistance: ['normal','fire'],
      img: {
        default: "../svg/squirtleicon.svg",
        front: "../svg/squirtfront.svg",
        back: "../svg/squirtback.svg"
      },
      hp: {
        current: 500,
        total: 500
      },
      attacks: [
        {
          name: "bubble",
          hp: randomNum(40,20),
          avail: {
            total: 30,
            remaining: 30
          }
        },
        {
          name: "water gun",
          hp: randomNum(60,45),
          avail: {
            total: 10,
            remaining: 10
          }
        },
        {
          name: "shell attack",
          hp: randomNum(75,60),
          avail: {
            total: 5,
            remaining: 5
          }
        },
        {
          name: "hydro pump",
          hp: randomNum(160, 130),
          avail: {
            total: 2,
            remaining: 2
          }
        }
      ]
    },
    {
      name: "bulbasaur",
      type: 'grass',
      weakness: ['fire'],
      resistance: ['water','psychic'],
      img: {
        default: "../svg/bulbaicon.svg",
        front: "../svg/bulbafront.svg",
        back: "../svg/bulbaback.svg",
      },
      hp: {
        current: 500,
        total: 500
      },
      attacks: [
        {
          name: "tackle",
          hp: randomNum(40,20),
          avail: {
            total: 30,
            remaining: 30
          }
        },
        {
          name: "vine whip",
          hp: randomNum(60,45),
          avail: {
            total: 10,
            remaining: 10
          }
        },
        {
          name: "razor leaf",
          hp: randomNum(75,60),
          avail: {
            total: 5,
            remaining: 5
          }
        },
        {
          name: "solar beam",
          hp: randomNum(160, 130),
          avail: {
            total: 2,
            remaining: 2
          }
        }
      ]
    },
    
  ];
}

function randomNum(max, min){
  // generate a random number
  if(min === undefined || min === '' || min === null){
    // min default value
    min = 0;
  }
  return Math.floor(Math.random() * (max - min) + min);
}

// CHARACTER BUILD
function populateChar(container,character){
console.log(character);
  var facing = 'front';
  if(character === 'hero'){
    facing = 'back';
  }
// build pokemon
  container.append('<section class="char"><img src="'+gameData[character].img[facing]+'" alt="'+gameData[character].name+'"><aside class="data"><h2>'+gameData[character].name+'</h2><div><progress max="'+gameData[character].hp.total+'"></progress><p><span>'+gameData[character].hp.current+'</span>/'+gameData[character].hp.total+'</p></div></aside></section>');
}

function attackMultiplier(attacker, curAttack){
  var defender = 'enemy';
  if(attacker === 'enemy'){
    defender = 'hero';
  }

  if(gameData[defender].weakness.indexOf(gameData[attacker].type) >= 0){
    // weakness exists
    curAttack.hp *= 2;
  }

  if(gameData[defender].resistance.indexOf(gameData[attacker].type) >= 0){
    // weakness exists
    curAttack.hp /= 2;
  }

  curAttack.hp = Math.floor(curAttack.hp);
  return curAttack.hp;
}


// music player
function playSound(name){
  $('audio.sfx').attr('src', music[name])
  // pause game music
  $('audio.music')[0].pause();
  // pokemon character sounds
  $('audio.sfx')[0].play();

  // timeout to stop music at given point
  setTimeout(function(){
    // pause the sfx
    $('audio.sfx')[0].pause();
    // start the music again
    $('audio.music')[0].play();
    // reset the sfx
    $('audio.sfx')[0].currentTime = 0;
  },2000);
}
// HP BAR ANIMATION
function setHP(){
  clearInterval(defendProgressInt);
  clearInterval(progressInt);
  $('.stadium .enemy progress').val(gameData.enemy.hp.current);
  $('.stadium .hero progress').val(gameData.hero.hp.current);
}
//reset game at end
function resetGame(){
  // set default values for game variables
  buildVars();

  // clear stadium
  $('.hero').empty();
  $('.enemy').empty();

  // reset
  $('.attack-list li').unbind('click');
  $('.attack-list').empty();
  $('.stadium .enemy').css({'padding':'0'});
  $('.instructions p').text('Choose your hero');

  // start game music again
  $('audio.music').attr('src',music["opening"]);
  $('audio.music')[0].play();

  // empty characters
  $('.characters').empty();
  $('.characters').removeClass('hidden');

  for(var i in characters){
    // build character list
    $(".characters").append('<div class="char-container"><img src="'+characters[i].img.default+'" alt="'+characters[i].name+'"><h2>'+characters[i].name+'</h2><span class="type '+characters[i].type+'"></span></div>')
  }
  characterChoice();
}
resetGame();
$('.logo').click(function(){resetGame();});

//choice of pokemon characters
function characterChoice(){
  $('.characters .char-container').click(function(){
    var name = $(this).children('h2').text().toLowerCase();

    switch(gameData.step){
   
      case 1:
        // step 1: choose your hero
        for(var i in characters){
          if(characters[i].name === name){
            //step 2: find and save your chosen hero's data
            gameData.hero = characters[i];
          }
        }

        //step 3: remove the character from the available list
        var char = $(this).remove();
        populateChar($('.stadium .hero'), 'hero');

        for(var i in gameData.hero.attacks){
          // populate attack list
         
          $('.attack-list').append('<li><p class="attack-name"><strong>'+gameData.hero.attacks[i].name+'</strong></p><p class="attack-count"><small><span>'+gameData.hero.attacks[i].avail.remaining+'</span>/'+gameData.hero.attacks[i].avail.total+'</small></p></li>');
        }

        $('.attack-list').addClass('disabled');

        // update instructions
        $('.instructions p').text('Choose your opponent!');
        // set health bar value
        $('.stadium .hero progress').val(gameData.hero.hp.current);

   
        playSound(name);

  
        gameData.step = 2;
        break;
            
      case 2:
    
        for(var i in characters){
          if(characters[i].name === name){
        
            gameData.enemy = characters[i];
          }
        }

        var char = $(this).remove();
        console.log(char);
        populateChar($('.stadium .enemy'), 'enemy');
     // console.log(populateChar);
        $('.stadium .enemy').css({'padding':'25px 0'});

        // update instructions
        $('.instructions p').text('Let the battle begin!');

        // hide the hero list
        $('.characters').children().slideUp('500', function(){
          $('.characters').addClass('hidden');
        });

        // update enemy health bar value
        $('.stadium .enemy progress').val(gameData.enemy.hp.current);
            console.log(gameData);

      /*  // the enemy whimpers in fear
        playSound(name);
*/
       
        gameData.step = 3;
        attackList();
        break;
    }
  });
}

//your pokemon
function attackEnemy(that, callback){

  // name of your attack
  attackName = that.children('.attack-name').children('strong').text().toLowerCase();

  for(var i in gameData.hero.attacks){
    if(gameData.hero.attacks[i].name === attackName){
      // get chosen attack data
      curAttack = gameData.hero.attacks[i];
    }
  }

  // if there are attacks left
  if(curAttack.avail.remaining > 0){
    // attack
    $('.attack-list').addClass('disabled');

    $('.hero .char img').animate(
      {
        'margin-left': '-30px',
        'margin-top': '10px'
      },
      50,
      'swing'
    );
    $('.hero .char img').animate(
      {
        'margin-left': '30px',
        'margin-top': '-10px'
      },
      50,
      'swing'
    );
    $('.hero .char img').animate(
      {
        'margin-left': '0px',
        'margin-top': '0px'
      },
      50,
      'swing'
    );

    // attack enemy
    gameData.enemy.hp.current -= attackMultiplier('hero', curAttack);

    if(gameData.enemy.hp.current <= 0){
      // Enemy is dead

      clearModal();
    $('.modal-in header').append('<h1>Your Opponent has Fainted!</h1><span class="close">x</span>');
    $('.modal-in section').append('<iframe src="https://giphy.com/embed/hSgrVbmXBGIQo" width="400" height="auto" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
    $('.modal-out').slideDown('400');
      modalControls();

      gameData.enemy.hp.current = 0;
      // clear the stadium
      $('.enemy').empty();
      // show the available characters again
      $('.characters').removeClass('hidden');
      $('.characters').children().slideDown('500');

      gameData.enemy = {};

      // choose enemy
      gameData.step = 2;
    
      $('.attack-list li').unbind('click');
    }else{
 

      // subtract attack
      curAttack.avail.remaining--;

      // interval to animate health bar
      progressInt = setInterval(function(){
        // get current value of health bar
        var val = $('.stadium .enemy progress').val();
        val--;

        // update health bar value
        $('.stadium .enemy progress').val(val);

        if(val === gameData.enemy.hp.current){
        
          clearInterval(progressInt);
          progressComplete = 1;
        }
      },1);

    
      $('.stadium .enemy .data p span').text(gameData.enemy.hp.current);
      that.children('.attack-count').children('small').children('span').text(curAttack.avail.remaining);


      setTimeout(function(){
        defend(that);
      }, 1000);
    }
  }
}

//enemy pokemon
function defend(that){
  // random attack
  randInt = randomNum(gameData.enemy.attacks.length);
  enemyAttack = gameData.enemy.attacks[randInt];

  // enemy attack animation sequence
  $('.enemy .char img').animate(
    {
      'margin-right': '-30px',
      'margin-top': '-10px'
    },
    50,
    'swing'
  );
  $('.enemy .char img').animate(
    {
      'margin-right': '30px',
      'margin-top': '10px'
    },
    50,
    'swing'
  );
  $('.enemy .char img').animate(
    {
      'margin-right': '0px',
      'margin-top': '0px'
    },
    50,
    'swing'
  );

  // attack the hero
  gameData.hero.hp.current -= attackMultiplier('enemy', enemyAttack);

  if(gameData.hero.hp.current <= 0){
//hero dies

    clearModal();
    $('.modal-in header').append('<h1>Oh no!<br> Your pokemon has fainted!</h1><span class="close">x</span>');
    $('.modal-in section').append('<iframe src="https://giphy.com/embed/2Z3tGEWANAp2M" width="400" height="auto" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
    $('.modal-out').slideDown('400');
    modalControls()

    gameData.hero.hp.current = 0;

    resetGame();
  }else{
    // hero lives

    // subtract attack from enemy count
    gameData.enemy.attacks[randInt].avail.remaining--;

    // health bar animation
    defendProgressInt = setInterval(function(){
      // get current val of health bar
      var val = $('.stadium .hero progress').val();
      val--;

      // update health bar value
      $('.stadium .hero progress').val(val);

      if(val === gameData.hero.hp.current){
        // stop the interval when target is attained
        clearInterval(defendProgressInt);
        defendProgressComplete = 1;
      }
    },1);

    // update health value
    $('.stadium .hero .data p span').text(gameData.hero.hp.current);

    setTimeout(function(){
      if(defendProgressComplete && progressComplete){
        $('.attack-list').removeClass('disabled');
      }else{
        setHP();
        $('.attack-list').removeClass('disabled');
      }
    }, 500);
  }
}

//attack sequences
function attackList(){
  // attack instantiation
  $('.attack-list').removeClass('disabled');

  $('.attack-list li').click(function(){
    // when attack choice is clicked
    var doAttack = 1;

    if(gameData.step === 3){
      // attack step - start attack sequence
      attackEnemy($(this));
    }
  });

  setTimeout(function(){
    //set & start the battle music after choosing pokemon
    $('audio.music').attr('src',music["battle"]);
    $('audio.music')[0].play();
  },1500);
}
//popup modal
function modalControls(){
  $('.modal-out').click(function(){
    $(this).slideUp('400');
  });
  $('.modal-in .close').click(function(e){
    $('.modal-out').slideUp('400');
  });

  $('.modal-in').click(function(e){
    e.stopPropagation();
    e.preventDefault();
  });
}
console.log(progressComplete);
function clearModal(){
  $('.modal-in header').empty();
  $('.modal-in section').empty();
  $('.modal-in footer').empty();
  setHP();
}
