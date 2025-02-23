import { Card, CardContent, ContainedButton, Headline2, Headline4, Loading, useFetch } from 'gobble-lib-react';
import { Channel } from '../channel';
import styled from 'styled-components';
import { useState } from 'react';
import { NewChannelModal } from './new-channel-modal';
import { useNavigate } from 'react-router-dom';

const ClickableCard = styled(Card)`
    &:hover {
        cursor: pointer;
        opacity: 75%;
    }
`;

const PageWrapper = styled.div`
    height: fit-content;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 16px;
`;

const ChannelsList = styled.div`
    display: flex;
    gap: 8px;
`;

export const ManageChannels = () => {
    const navigate = useNavigate();

    const [data, loading, { setData }] = useFetch<readonly Channel[]>('/api/channel');

    const [showChannelAddModal, setShowChannelAddModal] = useState(false);

    const addChannel = (c: Channel) => {
        setData([...(data ?? []), c]);
        setShowChannelAddModal(false);
    };

    return (
        <PageWrapper>
            <Headline2>Channels</Headline2>
            <ChannelsList>
                {
                    loading && <Loading />
                }
                {
                    data?.map(c => (
                        <ClickableCard key={c.id} onClick={() => navigate(`/channel/${c.id}`)}>
                            <CardContent>
                                <i className='fas fa-video' style={{ fontSize: '100px' }} />
                                <Headline4>{c.name}</Headline4>
                            </CardContent>
                        </ClickableCard>
                    ))
                }
            </ChannelsList>
            <ContainedButton onClick={() => setShowChannelAddModal(true)}>New Channel</ContainedButton>
            {showChannelAddModal && <NewChannelModal show={showChannelAddModal} requestClose={() => setShowChannelAddModal(false)} addChannel={addChannel} />}
        </PageWrapper>
    );
};