import { BaseTheme, ContainedButton } from 'gobble-lib-react';
import styled, { ThemeProps } from 'styled-components';

export const DangerButton = styled(ContainedButton)`
    background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.error.color};
    color: ${({ theme }: ThemeProps<BaseTheme>) => theme.error.on};
`;