import React from 'react';
import Routes from './routes';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import GlobalStyle from './styles/global';
import light from './styles/themes/light';
import dark from './styles/themes/dark'; 
import usePeristedState from './utils/usePersistedState';
import Index from './components/Index/';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
    const [theme, setTheme] = usePeristedState('theme', light);

    const toggleTheme = () => {
        setTheme(theme.title === 'light' ? dark : light);
    };

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <GlobalStyle/>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <Index toggleTheme={toggleTheme}></Index>
                        <Routes/>
                    </PersistGate>
                </Provider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
