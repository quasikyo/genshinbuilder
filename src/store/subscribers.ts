import {
	Store,
	StoreEvent,
	StoreSubscriber,
	StoreSubscribersByEvent
} from "../types";

// Meant for private use in store
export const subscribers: StoreSubscribersByEvent = {
	'ready': [],
};

/**
 * Register `subscriber` to be called with
 * the `Store` instance when `event` occurs.
 *
 * @param event
 * @param subscriber
 */
export function subscribe(event: StoreEvent, subscriber: StoreSubscriber) {
	const alreadyRegistered =
		subscribers[event].some(({ name }) => name === subscriber.name);

	if (!alreadyRegistered) {
		subscribers[event].push({
			name: subscriber.name,
			func: subscriber,
		});
	} // if
} // listen

export function notify(event: StoreEvent, store: Store) {
	subscribers[event].forEach(({ func }) => func(store));
} // notify
