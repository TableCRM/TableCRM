// creates the gloabl request animation frame function that React now depends on for testing

const requestAnimationFrame = global.requestAnimationFrame = callback => {
	setTimeout(callback, 0);
}

export default requestAnimationFrame;