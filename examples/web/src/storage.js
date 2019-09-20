import WebStorage from '@react-native-community/async-storage-backend-web';
import AsyncStorageFactory from '@react-native-community/async-storage';

const web = new WebStorage();

const storage = AsyncStorageFactory.create(web, {});

export default storage;