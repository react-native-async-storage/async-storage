import { AsyncStorageFactory } from './AsyncStorageFactory';
import RCTAsyncStorage from './RCTAsyncStorage';
import type { ErrorLike } from './types';

function makeErrorMessage(header: string, details: ErrorLike[]): string {
  return [
    header,
    ...details.map(({ message, key }) => `  - ${key}: ${message}`),
  ].join('\n');
}

export const AsyncStorage = AsyncStorageFactory.create({
  multiGet(
    keys: readonly string[],
    callback: (result: Record<string, string | null>) => void
  ): void {
    RCTAsyncStorage.multiGet(keys, (errors, result) => {
      if (errors) {
        const message = makeErrorMessage(
          'Failed to fetch value for the following keys:',
          errors
        );
        throw new Error(message);
      }

      callback(result ? Object.fromEntries(result) : {});
    });
  },

  multiSet(values: Record<string, string>, callback: () => void): void {
    RCTAsyncStorage.multiSet(Object.entries(values), (errors) => {
      if (errors) {
        const message = makeErrorMessage(
          'Failed to set value for the following keys:',
          errors
        );
        throw new Error(message);
      }

      callback();
    });
  },

  multiRemove(strings: readonly string[], callback: () => void): void {
    RCTAsyncStorage.multiRemove(strings, (errors) => {
      if (errors) {
        const message = makeErrorMessage(
          'Failed to remove the following keys:',
          errors
        );
        throw new Error(message);
      }

      callback();
    });
  },

  drop(callback: () => void): void {
    RCTAsyncStorage.clear(callback);
  },

  extensions: {
    getAllKeys(callback: (keys?: string[]) => void): void {
      RCTAsyncStorage.getAllKeys((error, keys) => {
        if (error) {
          throw new Error(error.message);
        }

        callback(keys);
      });
    },

    mergeItems(values: Record<string, string>, callback: () => void): void {
      const entries = Object.entries(values);
      RCTAsyncStorage.multiMerge(entries, (errors?: ErrorLike[]) => {
        if (errors) {
          const message = makeErrorMessage(
            'Failed to merge the following keys:',
            errors
          );
          throw new Error(message);
        }

        callback();
      });
    },
  },
});
