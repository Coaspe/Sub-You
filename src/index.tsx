import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import FirebaseContext from "./context/firebase";
import { firebase, FieldValue, storageRef } from "./lib/firebase";

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase, FieldValue, storageRef }}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root')
);
  
  serviceWorkerRegistration.register();