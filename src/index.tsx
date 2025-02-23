import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { BBRouter } from './router';
import { PageWrapper } from './base/page-wrapper';
import { ThemeContextProvider, Toast } from 'gobble-lib-react';
import { GlobalStyles } from './styling/global-styles';

const router = (
    <ThemeContextProvider>
        <GlobalStyles />
        <Toast>
            <Router>
                <PageWrapper>
                    <BBRouter />
                </PageWrapper>
            </Router>
        </Toast>
    </ThemeContextProvider>
);

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(router);