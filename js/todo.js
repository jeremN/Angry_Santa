//save score in localstorage
    /*
     On game load or initgame.

     score = 0;

     game.highScore = localStorage.getItem('highscore');

     if(game.highScore  === null) {    

     	localStorage.setItem('highscore', 0);    
     	game.highScore = 0;
     }
    */
//OU
    /*
    if (this.game.device.localStorage) {
        localStorage.score = this.score;
        if (localStorage.highScore) {
            if (localStorage.score > localStorage.highScore) {
                localStorage.highScore = localStorage.score;
            }
        }
        else {
            localStorage.highScore = localStorage.score;
        }
    }
    */

//A FAIRE
/*

CODE:

    ->Ajouter power up lvl
    =>OK->Ajouter collect cadeau

    ->Site statique du jeu (inté + anim js/css)

///////////////////////////////
GRAPHISME:

    =>JEU
        ->Pere noel + traineau + rene
        ->2-3 types d'ennemies + Boss
        ->2-3 types d'armes (dont armes ennemies)
        ->Décors (3/4 layers)
        ->Musique / Sons
        ->Life icône
        ->Splash screen (titre jeu + commandes jeu)

    =>SITE
        =>OK->Background
        ->Button "jouer"
        =>OK->Favicon
        ->Panneau à propos
        ->Anim du site

//////////////////////////////
BONUS:
    
    =>OK->Voir intégration mobile / tablet pour les commandes
    =>OK->Sauvegarde du score (sur localstorage)
    ->Transformer le jeu en app pour Ios / Android
    ->Force landscape
	
*/