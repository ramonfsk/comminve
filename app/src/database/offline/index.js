/**
 * @overview A minimalistic wrapper around React Native's AsyncStorage.
 * @license MIT
 */
import merge from 'lodash.merge';
import AsyncStorage from '@react-native-community/async-storage';

export default {
	/**
	 * Get a one or more value for a key or array of keys from AsyncStorage
	 * @param {String|Array} key A key or array of keys
	 * @return {Promise}
	 */
	async get(key) {
		if(!Array.isArray(key)) {
			const value = await AsyncStorage.getItem(key);
      return JSON.parse(value);
		} else {
			const values = AsyncStorage.multiGet(key);
      return values.map(value_1 => {
        return JSON.parse(value_1[1]);
      });
		}
	},

	/**
	 * Save a key value pair or a series of key value pairs to AsyncStorage.
	 * @param  {String|Array} key The key or an array of key/value pairs
	 * @param  {Any} value The value to save
	 * @return {Promise}
	 */
	save(key, value) {
		if(!Array.isArray(key)) {
			return AsyncStorage.setItem(key, JSON.stringify(value));
		} else {
			var pairs = key.map(function(pair) {
				return [pair[0], JSON.stringify(pair[1])];
			});
			return AsyncStorage.multiSet(pairs);
		}
	},

	/**
	 * Updates the value in the store for a given key in AsyncStorage. If the value is a string it will be replaced. If the value is an object it will be deep merged.
	 * @param  {String} key The key
	 * @param  {Value} value The value to update with
	 * @return {Promise}
	 */
	update(key, value) {
		const item = this.get(key);
    value = typeof value === 'string' ? value : merge({}, item, value);
    return AsyncStorage.setItem(key, JSON.stringify(value));
	},

	/**
	 * Delete the value for a given key in AsyncStorage.
	 * @param  {String|Array} key The key or an array of keys to be deleted
	 * @return {Promise}
	 */
	async delete(key) {
		if (Array.isArray(key)) {
			return await AsyncStorage.multiRemove(key);
		} else {
			return await AsyncStorage.removeItem(key);
		}
	},

	/**
	 * Get all keys in AsyncStorage.
	 * @return {Promise} A promise which when it resolves gets passed the saved keys in AsyncStorage.
	 */
	keys() {
		return AsyncStorage.getAllKeys();
	},

	/**
	 * Push a value onto an array stored in AsyncStorage by key or create a new array in AsyncStorage for a key if it's not yet defined.
	 * @param {String} key They key
	 * @param {Any} value The value to push onto the array
	 * @return {Promise}
	 */
	async push(key, value) {
		const currentValue = await this.get(key);
    if (currentValue === null) {
      // if there is no current value populate it with the new value
      return this.save(key, [value]);
    }
    if (Array.isArray(currentValue)) {
      return this.save(key, [...currentValue, value]);
    }
    throw new Error(`Existing value for key "${key}" must be of type null or Array, received ${typeof currentValue}.`);
	},
};