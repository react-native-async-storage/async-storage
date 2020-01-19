import React from 'react';
import './StorageExample.css';

import storage from './storage';

function StorageExample() {
  const [valueState, updateValueText] = React.useState('');
  const [keyState, updateKeyState] = React.useState('');
  const [storedKeys, updateStoredKeys] = React.useState('');

  async function saveData() {
    if (!keyState) {
      alert('key cannot be empty');
      return;
    }

    await storage.set(keyState, valueState);
  }

  async function readData() {
    if (!keyState) {
      alert('key cannot be empty');
      return;
    }
    const value = await storage.get(keyState);
    updateValueText(value || '');
  }

  async function deleteData() {
    if (!keyState) {
      alert('key cannot be empty');
      return;
    }

    await storage.remove(keyState);
  }

  async function getKeys() {
    const keys = await storage.getKeys();

    updateStoredKeys(keys ? keys.join(', ') : '');
  }

  async function clearDb() {
    const youSure = window.confirm('You sure you want to drop the whole db?');

    if (youSure) {
      await storage.clearStorage();
    }
  }

  return (
    <div className="container">
      <h2>Async Storage - Web storage example</h2>

      <div className="inputSection">
        <div className="inputField">
          <p>Key: </p>
          <input
            value={keyState}
            onChange={({target}) => {
              updateKeyState(target.value);
            }}
          />
        </div>

        <div className="inputField">
          <p>Value: </p>
          <input
            value={valueState}
            onChange={({target}) => {
              updateValueText(target.value);
            }}
          />
        </div>

        <div className="inputField">
          <p>Stored keys: </p>

          <p style={{flex: 1, color: '#585858'}}>{storedKeys}</p>
        </div>
      </div>

      <div className="controlSection">
        <button onClick={saveData}>Save</button>
        <button onClick={readData}>Read</button>
        <button onClick={deleteData}>Delete</button>
        <button onClick={getKeys}>Get Keys</button>
        <button onClick={clearDb}>Clear</button>
      </div>
    </div>
  );
}

export default StorageExample;
