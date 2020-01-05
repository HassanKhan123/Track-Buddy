import React, { Component } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import store, { persistor } from "./src/store";
import Root from "native-base";
import Navigation from './src/navigation'

export default class App extends Component {
  constructor(){
    super();
    console.disableYellowBox = true;
  }
  render() {
    return (
     
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            
            <Navigation />
          </PersistGate>
        </Provider>
     
    );
  }
}
