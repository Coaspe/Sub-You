import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import FirebaseContext from "./context/firebase";
import { firebase, FieldValue, storageRef } from "./lib/firebase";
import { store } from './redux/store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase, FieldValue, storageRef }}>
    <Provider store={store}>
      <App />
    </Provider>
  </FirebaseContext.Provider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();