/**
 * @format
 */
/* eslint-disable no-shadow */
import { renderHook, act } from '@testing-library/react-hooks';

import AsyncStorage, { useAsyncStorage } from '../src';

afterEach(AsyncStorage.clear);

function expectStableCallbacks(result: any, rerender: () => void) {
  const previousFunctions = Object.values(result.current).filter(
    (item) => typeof item === 'function'
  );
  rerender();
  const nowFunctions = Object.values(result.current).filter(
    (item) => typeof item === 'function'
  );
  expect(nowFunctions).toHaveLength(previousFunctions.length);
  expect(nowFunctions).toEqual(previousFunctions);
}

describe('useAsyncStorage', () => {
  it('should export only stable output', async () => {
    const { result, rerender } = renderHook(() => useAsyncStorage('key'));
    expect(result.error).toBeUndefined();
    expectStableCallbacks(result, rerender);
  });

  it('can read/write data to/from storage', async () => {
    const newData = Math.floor(Math.random() * 1000).toString();
    const { result } = renderHook(() => useAsyncStorage('key'));

    await result.current.setItem(newData);

    const data = await result.current.getItem();

    expect(data).toBe(newData);
  });

  it('can remove from storage', async () => {
    await AsyncStorage.setItem('key', 'value');
    const { result } = renderHook(() => useAsyncStorage('key'));
    await act(() => result.current.removeItem());
    expect(await AsyncStorage.getItem('key')).toBeNull();
  });

  it.skip('should throw when mergeItem is not supported', async () => {
    const { result } = renderHook(() => useAsyncStorage('key'));
    const mergeItem = AsyncStorage.mergeItem;
    delete AsyncStorage.mergeItem;
    expect(result.current.mergeItem({})).rejects.toThrow();
    AsyncStorage.mergeItem = mergeItem;
  });

  it('can use merge with current data in storage', async () => {
    let originalPerson = {
      name: 'Jerry',
      age: 21,
      characteristics: {
        hair: 'black',
        eyes: 'green',
      },
    };

    const { result } = renderHook(() => useAsyncStorage('person'));

    await result.current.setItem(JSON.stringify(originalPerson));

    originalPerson.name = 'Harry';
    originalPerson.characteristics.hair = 'red';
    // @ts-expect-error
    originalPerson.characteristics.shoeSize = 40;

    await result.current.mergeItem(JSON.stringify(originalPerson));

    const currentPerson = await result.current.getItem();
    const person = JSON.parse(currentPerson);

    expect(person).toHaveProperty('name', 'Harry');
    expect(person.characteristics).toHaveProperty('hair', 'red');
    expect(person.characteristics).toHaveProperty('shoeSize', 40);
  });
});
