import { BaseTheme } from 'gobble-lib-react';
import { createGlobalStyle, ThemeProps } from 'styled-components';
import '@fontsource/ubuntu';

export const GlobalStyles = createGlobalStyle`
    html, body, #root {
        height: 100vh;
    }

    #root {
        overflow: hidden;
    }

    body {
        margin: 0;
        background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.background.color};
        color: ${({ theme }: ThemeProps<BaseTheme>) => theme.background.on};
        transition: background-color 0.2s, color 0.2s;
    }
`;