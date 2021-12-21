import { supabase } from '../supabase';
import { definitions } from '../supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

import { store } from '.';
import { Character, CharacterCopy } from '../types';

/**
 * Class for managing:
 * - conversion between query and database types,
 * - checking if a copy of something exists,
 * - adding to the store and db,
 * - removing from the store and db
 *
 * @template T The query type to manage.
 */
export abstract class Manager<T> {
	/**
	 * Converts the data queried to the actual db schema.
	 * @param data
	 */
	abstract storeToDb(data: T): any;

	/**
	 * Checks if an instance of `base` already exists.
	 * @param data
	 */
	abstract doesCopyExist(base: any): boolean;

	/**
	 * Add to the db and sync to local store.
	 * @param data
	 */
	abstract add(data: T): Promise<PostgrestError | null>;

	/**
	 * Delete from the db and sync to local store.
	 * @param data
	 */
	abstract delete(data: T): Promise<PostgrestError | null>;

	abstract save(data: T): Promise<PostgrestError | null>;
} // Manager

class CharacterManager extends Manager<CharacterCopy> {
	override storeToDb(data: CharacterCopy): definitions['CharacterCopies'] {
		return {
			// @ts-ignore
			owner: supabase.auth.user()?.id,
			ascension: data.ascension,
			level: data.level,
			constellations: data.constellations,
			copy_of: data.copy_of.id,
		};
	} // storeToDb

	override doesCopyExist(base: Character): boolean {
		return !!store.CharacterCopies.find(copy => copy.copy_of.name === base.name);
	} // doesCopyExist

	override async add(data: CharacterCopy) {
		const dbEntry = this.storeToDb(data);

		const { error } = await supabase
			.from<definitions['CharacterCopies']>('CharacterCopies')
			.insert([dbEntry]);

		if (!error) {
			store.CharacterCopies.push(data);
		} // if

		return error;
	} // add

	override async delete(data: CharacterCopy) {
		// Can't use id since some they can be created
		// on the frontend and not be assigned one.
		const { error } = await supabase
			.from<definitions['CharacterCopies']>('CharacterCopies')
			.delete().match({
				owner: supabase.auth.user()?.id,
				copy_of: data.copy_of.id,
			});

		if (!error) {
			const deletionIndex = store.CharacterCopies.indexOf(data);
			store.CharacterCopies.splice(deletionIndex, 1);
		} // if

		return error;
	} // delete

	override async save(data: CharacterCopy) {
		const { error } = await supabase
			.from<definitions['CharacterCopies']>('CharacterCopies')
			.update(this.storeToDb(data)).match({
				owner: supabase.auth.user()?.id,
				copy_of: data.copy_of.id,
			});

		return error;
	} // save
} // CharacterManager

export const characterManager = new CharacterManager();
