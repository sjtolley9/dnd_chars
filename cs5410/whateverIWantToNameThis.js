let nowTime = performance.now();

let events = [];

let eventsToLog = [];

function addEvent() {
	//eventName
	let name = document.getElementById("eventName").value;
	document.getElementById("eventName").value = "";
	//interval
	let interval = document.getElementById("interval").value;
	document.getElementById("interval").value = 1000;
	//iters
	let iters = document.getElementById("iters").value;
	document.getElementById("iters").value = 10;

	if (name && interval && iters) {
		let ev = {
			name: name,
			interval: interval-0,
			iters: iters,
			curInterval: interval
		}

		events.push(ev);
	}
}

function update(dT) {
	eventsToLog = [];
	for (let eI = events.length-1; eI >= 0; eI--) {
		let ev = events[eI];
		ev.curInterval -= dT;
		if (ev.curInterval <= 0) {
			while (ev.curInterval <= 0 && ev.iters > 0){
				ev.iters--;
				eventsToLog.push(`Event : ${ev.name} (${ev.iters} remaining) <br />`);

				ev.curInterval += ev.interval;
			}
			if (ev.iters == 0) {
				events.splice(eI, 1);
			}
		}
	}
}

function render() {
	let upd = false;
	for (eI in eventsToLog) {
		document.getElementById("logBox").innerHTML += eventsToLog[eI];
		upd = true;
	}
	if (upd) {
		document.getElementById("logBox").scrollTop = document.getElementById("logBox").scrollHeight;
	}
}

function gameLoop(newTime) {
	let dT = newTime - nowTime;
	update(dT);
	render();
	nowTime = newTime;

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);