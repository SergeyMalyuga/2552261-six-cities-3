import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app.tsx';
import {store} from './store';
import {Provider} from 'react-redux';
import {checkAuthorization, fetchOffersAction} from './store/api-actions.ts';
import browserHistory from './browser-history.ts';
import HistoryRouter from './components/history-route/history-route.tsx';
import {ToastContainer} from 'react-toastify';

store.dispatch(checkAuthorization());
store.dispatch(fetchOffersAction());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={browserHistory}>
        <ToastContainer />
        <App/>
      </HistoryRouter>
    </Provider>
  </React.StrictMode>
);
