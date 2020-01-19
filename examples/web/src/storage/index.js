import asyncStorageFactory from '@react-native-community/async-storage';
import WebStorage from '@react-native-community/async-storage-backend-web';

const webStorage = new WebStorage();

export default asyncStorageFactory.create(webStorage);
