import { createStore,applyMiddleware,compose} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import {AsyncStorage} from 'react-native'
import rootReducer from './rootReducer'
const persistConfig = {
    key: 'root',
    storage:AsyncStorage,
    whitelist:['userReducer']
  }
  
const persistedReducer = persistReducer(persistConfig, rootReducer)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer,composeEnhancers(applyMiddleware(thunk)))
export let persistor = persistStore(store)

export default store