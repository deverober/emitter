import { EmitterObject } from "./objects/EmitterObject";
import { EventManager } from "./events/EventManager";

const eventManager = EventManager.getInstance();

const obj = new EmitterObject();
const obj1 = new EmitterObject();

obj.subscribeToTargettedEvent({
	name: "test",
	callback: () => {
		console.log("Test passed in obj.");
	},
});

obj1.subscribeToTargettedEvent({
	name: "test",
	callback: () => {
		console.log("Test passed in obj1");
	},
});

EventManager.emitToAll("test");

// EventManager.emitToOne({
// 	callerId: obj._id,
// 	targetId: obj1._id,
// 	eventName: "add",
// });

// const obj2 = new EmitterObject([emitterEvent]);

// obj.emitter.emit("test");
