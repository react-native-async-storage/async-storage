import React from 'react';
import './App.css';
import storage from './storage';

class App extends React.Component {
  state = {
    key: '',
    value: '',
    savedText: '',
    storageKeys: [],
  };

  componentDidMount() {
    this.readFromStorage();
  }

  saveToStorage = async () => {
    if (this.state.key) {
      await storage.set(this.state.key, this.state.value);
    }
  };

  readFromStorage = async () => {
    let readText = '';
    if (this.state.key) {
      readText = (await storage.get(this.state.key)) || '';
    }

    this.setState({
      savedText: readText,
    });
  };

  clearFromStorage = async () => {
    if (this.state.key) {
      await storage.remove(this.state.key);
    }

    await this.readFromStorage();
  };

  showKeys = async () => {
    const keys = await storage.getKeys();

    console.log({keys});

    this.setState(() => ({
      storageKeys: keys,
    }));
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.section}>
          <span style={styles.subtitle}>storage key: </span>
          <input
            style={styles.input}
            value={this.state.key}
            name="key"
            onChange={this.handleInputChange}
          />
        </div>
        <div style={styles.section}>
          <span style={styles.subtitle}>value: </span>
          <input
            style={styles.input}
            value={this.state.value}
            name="value"
            onChange={this.handleInputChange}
          />
        </div>

        <span style={styles.title}>Stored text: {this.state.savedText} </span>
        <span style={styles.title}>
          Stored keys: {this.state.storageKeys.join(', ')}
        </span>

        <div style={styles.buttonsContainer}>
          <button style={styles.button} onClick={this.saveToStorage}>
            Save
          </button>
          <button style={styles.button} onClick={this.readFromStorage}>
            Read
          </button>
          <button style={styles.button} onClick={this.clearFromStorage}>
            Clear
          </button>
          <button style={styles.button} onClick={this.showKeys}>
            Show keys
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '16px',
  },
  input: {
    borderColor: '#333',
    borderWidth: '1px',
    borderStyle: 'solid',
    marginHorizontal: '12px',
    flex: 3 / 5,
    alignSelf: 'center',
  },

  section: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '8px',
  },
  subtitle: {
    flex: 2 / 5,
    fontSize: '14px',
    width: '40px',
    alignContent: 'flex-end',
    textAlign: 'right',
  },
  title: {
    fontSize: '18px',
    color: 'rgba(0,0,0,.87)',
    marginVertical: '12px',
    display: 'block',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    height: '40px',
    width: '150px',
    margin: '8px',
    cursor: 'pointer',
  },
};

export default App;
