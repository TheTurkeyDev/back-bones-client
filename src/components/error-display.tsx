import { Headline4 } from 'gobble-lib-react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
`;

type ErrorDisplayProps = {
    readonly error?: string
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {

    return (
        <Wrapper>
            <Headline4>{error}</Headline4>
        </Wrapper>
    );
};