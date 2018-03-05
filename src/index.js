import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore,applyMiddleware,compose,combineReducers} from 'redux';
import {Provider} from "react-redux";
// import {Spin} from "antd";
import thunk from "redux-thunk";
import {BrowserRouter} from "react-router-dom";
import * as actionTypes from "./store/actions/actionTypes";
// import authReducer from "../src/store/reducers/Auth";
// import loginReducer from "./store/reducers/Login";
// import registerReducer from "./store/reducers/Register";
import userAuthReducer from "./store/reducers/UserAuth";
import logoutReducer from "./store/reducers/Logout";
import registerServiceWorker from './registerServiceWorker';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';         // defaults to localStorage for web
import { PersistGate } from 'redux-persist/integration/react';

// import { ConnectedRouter as Router, routerReducer, routerMiddleware } from "react-router-redux";
// import createHistory from 'history/createBrowserHistory';
// const history = createHistory();
// const middleware = routerMiddleware(history);



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const persistConfig = {
  key: 'root',
  storage,
}


const appReducer = combineReducers({
    /* your app’s top-level reducers */
    UserAuth:userAuthReducer,
    Logout:logoutReducer,
  })


  const persistedReducer = persistReducer(persistConfig, appReducer);
  
  const rootReducer = (state, action) => {
    if (action.type === actionTypes.ON_LOGOUT_SUCCESS) {
        Object.keys(state).forEach(key => {
          console.log('key deleted',key);
          localStorage.removeItem(`persist:${key}`);
          storage.removeItem(`persist:${key}`);
        });
        localStorage.clear();
        state = undefined
    }
    return persistedReducer(state, action)
  }

 let store = createStore(rootReducer ,
    composeEnhancers(
        applyMiddleware(thunk)
    ));

   
    
  let persistor = persistStore(store);

 

var ownerId = store.getState().UserAuth.ownerId;

const app=(
   <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}  >
                <BrowserRouter >
                    <App ownerId={ownerId}/>
                </BrowserRouter>
        </PersistGate>
   </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
