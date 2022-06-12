export interface EmitterEvent {
	name: string;
	callback?: Function;
}

export interface Subscriber {
	id: string;
	eventName: string;
	callback?: Function;
}

export interface SubscriberObject {
	id: string;
	name: string;
	callback?: Function;
}

export interface Unsubscribe {
	eventName: string;
	unsubscribe: () => void;
}

export interface ToEvent {
	callerId: string;
	targetId: string;
	eventName: string;
}
