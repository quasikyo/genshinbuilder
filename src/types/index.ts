import { UnwrapNestedRefs } from "vue";

export type AuthFunction = (email: string, password: string) => void;

export type Store = UnwrapNestedRefs<any>;
export type StoreEvent = 'ready';
export type StoreSubscriber = (store: Store) => void;
export type SubscriptionRecord = { name: string, func: StoreSubscriber };
export type StoreSubscribersByEvent = Record<StoreEvent, SubscriptionRecord[]>;
