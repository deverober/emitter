import { randomBytes } from "crypto";
import { EventManager } from "../events/EventManager";
import { Unsubscribe, EmitterEvent } from "../events/EventTypes";

/*
	A class that can receive events
*/
export class EmitterObject {
	// Randomly generated id to tag events for individual use
	_id: string = randomBytes(4).toString("hex");
	/*
		Array of unsubscribe objects consisting of a name and callback function to unsubscribe from individual services
	*/
	subscribedEvents: Unsubscribe[] = [];
	/**
	 *
	 * @param name The name of the event
	 * @param callback An optional callback that will bind this and be called when the event name is emitted
	 */
	subscribeToTargettedEvent({ name, callback }: EmitterEvent) {
		/*
			Create a unique name from the objects _id and the event name
		*/
		const uniqueName = this._id + "-" + name;
		// The object to store
		let result: Unsubscribe;

		if (callback) {
			result = EventManager.addSubscriber({
				id: this._id,
				eventName: name,
				callback: callback.bind(this),
			});
		} else {
			result = EventManager.addSubscriber({
				id: this._id,
				eventName: name,
			});
		}
		// Push the object containing the event name and unsubscribe function to the array
		this.subscribedEvents.push(result);
	}

	/**
	 *
	 * @param name The name of the event to unsubscribe from
	 */
	unsubscribeFromEvent(name: string) {
		const uniqueName = this._id + "-" + name;

		/*
			Find the index of the event with the matching name.
		*/
		const index = this.subscribedEvents.findIndex(
			(event) => event.eventName === uniqueName
		);
		//	If the index doesn't exist
		if (index === -1) {
			console.log("Could not find an event with name: ", uniqueName);
			return;
		}

		// call the events unsubscribe function to remove event
		this.subscribedEvents[index].unsubscribe();
	}
}
