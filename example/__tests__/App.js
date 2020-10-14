/**
 * @format
 */
/* eslint-disable no-shadow */

import 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Async Storage mock functionality', () => {
  describe('Promise based', () => {
    it('can read/write data to/from storage', async () => {
      const newData = Math.floor(Math.random() * 1000);

      await AsyncStorage.setItem('key', newData);

      const data = await AsyncStorage.getItem('key');

      expect(data).toBe(newData);
    });

    it('can clear storage', async () => {
      await AsyncStorage.setItem('temp_key', Math.random() * 1000);

      let currentValue = await AsyncStorage.getItem('temp_key');

      expect(currentValue).not.toBeNull();

      await AsyncStorage.clear();

      currentValue = await AsyncStorage.getItem('temp_key');

      expect(currentValue).toBeNull();
    });

    it('can clear entries in storage', async () => {
      await AsyncStorage.setItem('random1', Math.random() * 1000);
      await AsyncStorage.setItem('random2', Math.random() * 1000);

      let data1 = await AsyncStorage.getItem('random1');
      let data2 = await AsyncStorage.getItem('random2');

      expect(data1).not.toBeNull();
      expect(data2).not.toBeNull();

      await AsyncStorage.removeItem('random1');
      await AsyncStorage.removeItem('random2');
      data1 = await AsyncStorage.getItem('random1');
      data2 = await AsyncStorage.getItem('random2');
      expect(data2).toBeNull();
      expect(data1).toBeNull();
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

      await AsyncStorage.setItem('person', JSON.stringify(originalPerson));

      originalPerson.name = 'Harry';
      originalPerson.characteristics.hair = 'red';
      originalPerson.characteristics.shoeSize = 40;

      await AsyncStorage.mergeItem('person', JSON.stringify(originalPerson));

      const currentPerson = await AsyncStorage.getItem('person');
      const person = JSON.parse(currentPerson);

      expect(person).toHaveProperty('name', 'Harry');
      expect(person.characteristics).toHaveProperty('hair', 'red');
      expect(person.characteristics).toHaveProperty('shoeSize', 40);
    });
  });

  describe('Callback based', () => {
    it('can read/write data to/from storage', (done) => {
      const newData = Math.floor(Math.random() * 1000);

      AsyncStorage.setItem('key', newData, function () {
        AsyncStorage.getItem('key', function (_, value) {
          expect(value).toBe(newData);
          done();
        }).catch((e) => done.fail(e));
      });
    });
    it('can clear storage', (done) => {
      AsyncStorage.setItem('temp_key', Math.random() * 1000, () => {
        AsyncStorage.getItem('temp_key', (_, currentValue) => {
          expect(currentValue).not.toBeNull();
          AsyncStorage.clear(() => {
            AsyncStorage.getItem('temp_key', (_, value) => {
              expect(value).toBeNull();
              done();
            }).catch((e) => done.fail(e));
          });
        }).catch((e) => done.fail(e));
      });
    });

    it('can clear entries in storage', (done) => {
      AsyncStorage.setItem('random1', Math.random() * 1000, () => {
        AsyncStorage.setItem('random2', Math.random() * 1000, () => {
          AsyncStorage.getItem('random1', (_, data1) => {
            AsyncStorage.getItem('random2', (_, data2) => {
              expect(data1).not.toBeNull();
              expect(data2).not.toBeNull();

              AsyncStorage.removeItem('random1', () => {
                AsyncStorage.removeItem('random2', () => {
                  AsyncStorage.getItem('random1', (_, value1) => {
                    AsyncStorage.getItem('random2', (_, value2) => {
                      expect(value1).toBeNull();
                      expect(value2).toBeNull();
                      done();
                    }).catch((e) => done.fail(e));
                  });
                });
              });
            }).catch((e) => done.fail(e));
          });
        });
      });
    });

    it('can use merge with current data in storage', (done) => {
      let originalPerson = {
        name: 'Jerry',
        age: 21,
        characteristics: {
          hair: 'black',
          eyes: 'green',
        },
      };

      AsyncStorage.setItem('person', JSON.stringify(originalPerson), () => {
        originalPerson.name = 'Harry';
        originalPerson.characteristics.hair = 'red';
        originalPerson.characteristics.shoeSize = 40;
        AsyncStorage.mergeItem('person', JSON.stringify(originalPerson), () => {
          AsyncStorage.getItem('person', (_, currentPerson) => {
            const person = JSON.parse(currentPerson);
            expect(person).toHaveProperty('name', 'Harry');
            expect(person.characteristics).toHaveProperty('hair', 'red');
            expect(person.characteristics).toHaveProperty('shoeSize', 40);
            done();
          }).catch((e) => done.fail(e));
        });
      });
    });
  });
});
