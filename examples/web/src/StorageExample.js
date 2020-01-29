import React from 'react';
import './StorageExample.css';

import {idbStorage, localStorage, sessionStorage} from './storage';

function StorageExample() {
  const [isSingleMode, updateModeState] = React.useState(true);
  const [storage, updateStorage] = React.useState(idbStorage);

  const [valueState, updateValueState] = React.useState('');
  const [keyState, updateKeyState] = React.useState('');
  const [storedKeys, updateStoredKeys] = React.useState('');

  async function saveData() {
    if (!keyState) {
      alert('Key input cannot be empty');
      return;
    }

    await storage.set(keyState, valueState);
  }

  async function readData() {
    if (!keyState) {
      alert('Key input cannot be empty');
      return;
    }
    const value = await storage.get(keyState);
    updateValueState(value || '');
  }

  async function readMany() {
    if (!keyState) {
      alert('Keys input cannot be empty');
      return;
    }
    const keys = keyState.split(',').map(k => k.trim());

    const values = await storage.getMultiple(keys);

    const displayValues = Object.keys(values).map(k => values[k]);

    updateValueState(displayValues.join(', '));
  }

  async function saveMany() {
    if (!keyState) {
      alert('key cannot be empty');
      return;
    }
    const keys = keyState.split(',').map(k => k.trim());
    const values = valueState.split(',').map(v => v.trim());

    await storage.setMultiple(
      keys.map((key, index) => ({[key]: values[index]})),
    );
  }

  async function deleteData() {
    if (!keyState) {
      alert('key cannot be empty');
      return;
    }

    await storage.remove(keyState);
  }

  async function deleteMany() {
    if (!keyState) {
      alert('key cannot be empty');
      return;
    }

    const keys = keyState.split(',').map(k => k.trim());

    await storage.removeMultiple(keys);
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

      <div className="modeContainer">
        <h3>Storage:</h3>
        <select
          onChange={({target: {value}}) => {
            if (value === 'idb') {
              updateStorage(idbStorage);
            } else if (value === 'local') {
              updateStorage(localStorage);
            } else {
              updateStorage(sessionStorage);
            }
          }}>
          <option value="idb">idb</option>
          <option value="local">local storage</option>
          <option value="session">session storage</option>
        </select>
      </div>

      <div className="modeContainer">
        <h3>Input:</h3>
        <select
          onChange={({target: {value}}) => {
            updateModeState(value === 'single');
          }}>
          <option value="single">Single value</option>
          <option value="multiple">Many values</option>
        </select>
      </div>

      {!isSingleMode ? (
        <p className="multiModeInfo">
          Note: keys and values should be separated by a coma
        </p>
      ) : null}

      <input
        className="input"
        placeholder={isSingleMode ? 'key' : 'keys (comma separated)'}
        value={keyState}
        onChange={({target: {value: key}}) => {
          updateKeyState(key);
        }}
        autoFocus
      />

      <input
        className="input"
        placeholder={isSingleMode ? 'value' : 'values (comma separated)'}
        value={valueState}
        onChange={({target: {value}}) => {
          updateValueState(value);
        }}
        autoFocus
      />

      <div className="savedKeysContainer">
        <h4>Saved keys:</h4>
        <p>{storedKeys}</p>
      </div>

      <div className="controlSection">
        {isSingleMode ? (
          <>
            <button onClick={readData}>Read single</button>
            <button onClick={saveData}>Save single</button>
            <button onClick={deleteData}>Delete single</button>
          </>
        ) : (
          <>
            <button onClick={readMany}>Read many</button>
            <button onClick={saveMany}>Save many</button>
            <button onClick={deleteMany}>Delete many</button>
          </>
        )}
        <div>
          <button onClick={getKeys}>Get keys</button>

          <button onClick={clearDb}>Clear</button>
        </div>
      </div>
    </div>
  );
}

export default StorageExample;
