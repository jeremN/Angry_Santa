//save score in localstorage
    /*
     On game load or initgame.score = 0;

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
->Ajouter vagues enemy & deplacement en vague  
    =>OK mais correction a prévoir


->Ajouter power up lvl
->Ajouter collect cadeau
->Voir intégration mobile / tablet pour les commandes

->Graphisme
->Site statique du jeu

BONUS:

->Transformer le jeu en app pour Ios / Android
	
*/