import { PostgrestError } from '@supabase/supabase-js';
import { MessageApi } from 'naive-ui';

export function alertUser(
	message: MessageApi,
	error: PostgrestError | null,
	operation: string,
) {
	if (error) {
		console.error(error);
		message.error(`${operation} failed.`);
	} else {
		message.success(`${operation} successful.`);
	} // if
} // alertUser
