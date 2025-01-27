import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

import App from './App';
import { initAxiosClients } from './api/apiClients';
import { setUpInterceptor } from './api/interceptors';
import './i18n';
import './index.css';
import { initStore, store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import { loadPaConfiguration } from './services/configuration.service';
import { initOneTrust } from './utility/onetrust';

async function doTheRender() {
  try {
    // load config from JSON file
    await loadPaConfiguration();

    // init actions (previously static code) which make use of config
    initOneTrust();
    initStore();
    initAxiosClients();
    // move initialization of the Axios interceptor - PN-7557
    setUpInterceptor(store);

    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Suspense fallback="loading...">
                <App />
              </Suspense>
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
  } catch (e) {
    console.error(e);

    ReactDOM.render(
      <React.StrictMode>
        <div style={{ fontSize: 20, marginLeft: '2rem' }}>
          Problems loading configuration - see console
        </div>
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
}

// actual launching of the React app
void doTheRender();
