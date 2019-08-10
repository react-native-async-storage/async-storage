import LegacyStorage from '@react-native-community/async-storage-legacy';
import AsyncStorageFactory from '@react-native-community/async-storage';


const legacy = new LegacyStorage();

const storage = AsyncStorageFactory.create(legacy, {});

export default storage;
