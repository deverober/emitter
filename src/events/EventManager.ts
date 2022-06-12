import Emitter from "./Emitter";
import {
	ToEvent,
	SubscriberObject,
	Unsubscribe,
	Subscriber,
} from "./EventTypes";

// Singleton that coordinates all events
export class EventManager {
	private static instance?: EventManager;
	// An array of all subscribers and their callbacks
	private static subscribers: SubscriberObject[] = [];
	// A singleton of EventEmitter
	private static emitter: Emitter = Emitter.getInstance();

	private constructor() {}
	/**
	 *
	 * @returns A singleton of EventManager
	 */
	public static getInstance() {
		if (!this.instance) {
			this.instance = new EventManager();
		}

		return this.instance;
	}

	/**
	 *
	 * @param param0 Object containing the id of the subscriber, the event name, and an optional callback function
	 * @returns An object with the subscribed event's name and an unsubscribe function
	 */
	public static addSubscriber({
		id,
		eventName,
		callback,
	}: Subscriber): Unsubscribe {
		// Generate a unique name for the subscriber; this allows individual targetting of events
		const subscriberObject: SubscriberObject = {
			id,
			name: id + "-" + eventName,
			callback,
		};
		// Push the subscriber object to the list of subscriptions
		this.subscribers.push(subscriberObject);
		// Create an Unsubscribe object to return to the subscriber
		const subscriberInfo: Unsubscribe = {
			// The generated event name by the server.
			eventName: subscriberObject.name,
			// The function allowing unsubscription from the event
			unsubscribe: () => {
				const index = this.subscribers.findIndex(
					(subscriber) => subscriber.name === subscriberInfo.eventName
				);

				if (index === -1) {
					throw new Error(
						`Unable to unsubscribe from event with name: ${subscriberInfo.eventName}`
					);
				}

				delete this.subscribers[index];
			},
		};

		return subscriberInfo;
	}

	/**
	 *
	 * @param param0 An object containing the id of the object emitting the event, the id of the target and the event name
	 */
	public static emitToOne({ callerId, targetId, eventName: name }: ToEvent) {
		const target = this.subscribers.find(
			(subscriber) => subscriber.id === targetId
		);

		if (!target) {
			throw new Error(
				`Caller ${callerId} was not able to contact target ${targetId} using event named ${name}`
			);
		}

		const eventName = target.id + "-" + name;
		this.emitter.emit(eventName);
	}

	/**
	 *
	 * @param eventName 'Emit an event to all objects subscribed to the same event name
	 */
	public static emitToAll(eventName: string) {
		const targets = this.subscribers.filter((subscriber) => {
			const name = subscriber.name.split("-")[1];

			return name === eventName;
		});

		targets.forEach((target) => {
			if (target.callback) {
				target.callback();
			}
			this.emitter.emit(target.name);
		});
	}
}
