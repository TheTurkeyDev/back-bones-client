import { Body1, Body1Css, WithChildren } from 'gobble-lib-react';
import styled from 'styled-components';
import { TopNav } from './top-nav';

const Wrapper = styled.div`
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
`;

const ScrollWrapper = styled.div`
    display: grid;
    grid-template-rows: minmax(auto, 1fr) auto;
    overflow-y: auto;
`;

const MainWrapper = styled.main`
    height: fit-content;
`;

const Footer = styled.footer`
    ${Body1Css}
    align-self: end;
`;

export const PageWrapper = ({ children }: WithChildren) => {
    return (
        <Wrapper>
            <header>
                <TopNav />
            </header>
            <ScrollWrapper>
                {children}
                <Footer>
                    <Body1>ALPHA v0.1</Body1>
                </Footer>
            </ScrollWrapper>
        </Wrapper>
    );
};