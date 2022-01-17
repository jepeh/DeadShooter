import { GAME } from './app/script.js'
import { Profile } from './profiles/profile.js'
import * as Utils from './app/utils.js'
import rewards from './app/rewards.js'
import * as Three from '../src/three.js'

//GAME.startGame(Profile.level)

$("#playbtn").on(' click ', () => {
	$("#cover, #GameMode").css("display", "grid")
	$("#playbtn").css("display", "none")
});


$("#GMCancel").on(' click ', () => {
	$("#cover, #GameMode").css("display", "none")
	$("#playbtn").css("display", "grid")
});

