import { BaseTheme, Body1 } from 'gobble-lib-react';
import styled, { ThemeProps } from 'styled-components';

export const ErrorText = styled(Body1)`
    color: ${({ theme }: ThemeProps<BaseTheme>) => theme.error.color};
`;