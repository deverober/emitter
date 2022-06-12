import events = require("events");

/**
 * Class that creates a singleton of the EventEmitter class
 */
export default class Emitter extends events.EventEmitter {
	private static instance?: events.EventEmitter;

	private constructor() {
		super();
	}

	public static getInstance() {
		if (!this.instance) {
			this.instance = new events.EventEmitter();
		}

		return this.instance;
	}
}
