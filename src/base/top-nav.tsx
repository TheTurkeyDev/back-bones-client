import { CenterContent, Dropdown, DropdownContent, NavBar, NavLink, SiteName, TextButton, useThemeContext } from 'gobble-lib-react';
import styled from 'styled-components';

const UserIcon = styled.i`
    font-size: 32px;
`;

export const TopNav = () => {
    const { theme, setTheme } = useThemeContext();

    return (
        <NavBar>
            <SiteName to='/'>Back Bones</SiteName>
            <CenterContent>
                <NavLink link='/'>Home</NavLink>
                <NavLink link='/channels'>Channels</NavLink>
            </CenterContent>
            <Dropdown>
                <UserIcon className='fas fa-user-circle' />
                <DropdownContent sideAnchor='right'>
                    <TextButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</TextButton>
                </DropdownContent>
            </Dropdown>
        </NavBar>
    );
};