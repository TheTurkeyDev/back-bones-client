import { Body1, ButtonRow, ConfirmationModal, Headline2, Headline4, Icon, Input, InputsWrapper, Loading, OutlinedButton, SpaceBetween, Table, TD, TextToast, TH, ToggleSwitch, useFetch, useQuery, useToast } from 'gobble-lib-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Channel } from '../channel';
import { DangerButton } from '../../../components/danger-button';
import { AddRestreamModal } from './add-restream-modal';
import { RestreamData } from './restream-data';
import { deleteParams, patchParams, postParams } from '../../../network/request-types';

const PageWrapper = styled.div`
    height: fit-content;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 16px;
    padding-top: 8px;
`;

const HeaderWrapper = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    gap: 4px;
`;

const IconsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
`;

const CustomTable = styled(Table)`
    max-width: 900px;
    margin-inline: auto;
`;

const CustomRow = styled.tr`
    &:hover {
        background-color: #66666633;
        cursor: pointer;
    }
`;

const platformIcons: { readonly [key: string]: string } = {
    'twitch': 'fab fa-twitch',
    'youtube': 'fab fa-youtube',
    'custom': 'fas fa-broadcast-tower'
};

export const ViewChannel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pushToast } = useToast();

    const [channel, loadingChannel, { setData: setChannelInfo, resetData }] = useFetch<Channel>(`/api/channel/${id}`);
    const [restreamPlatforms, loadingRestream, { setData }] = useFetch<readonly RestreamData[]>(`/api/channel/${id}/restreams`);
    const [getStreamKey, fetchingStreamKey] = useQuery<{ readonly key: string }>(`/api/channel/${id}/streamkey`, { shouldThrow: true });
    const [updateChannel] = useQuery<Channel>('/api/channel', { requestData: patchParams });
    const [deleteChannel] = useQuery<Channel>('/api/channel', { requestData: deleteParams });
    const [refreshStreamKey] = useQuery<{ readonly key: string }>(`/api/channel/${id}/streamkey`, { requestData: postParams });

    const [toDeleteChannel, setToDeleteChannel] = useState(false);
    const [toRefreshStreamKey, setToRefreshStreamKey] = useState(false);
    const [streamKey, setStreamKey] = useState<string>();
    const [editRestreamPlatform, setEditRestreamPlatform] = useState<RestreamData>();
    const [editName, setEditName] = useState(false);

    const onDeleteConfirm = () => {
        if (!channel?.id)
            return;
        deleteChannel(undefined, `${channel.id}`).then(() => {
            setToDeleteChannel(false);
            navigate('/channels');
        });
    };

    const togglePublic = () => {
        if (!channel)
            return;

        const updatedChannel = { ...channel, isPublic: !channel.isPublic };

        setChannelInfo(updatedChannel);
        onUpdateChannel(updatedChannel);
    };

    const onUpdateChannel = (channel: Channel) => {
        if (!channel)
            return;

        updateChannel(JSON.stringify(channel), `${channel.id}`).then(resp => {
            if (!resp)
                return;

            setChannelInfo(resp);
            setEditName(false);
        });
    };

    const copyStreamKeyToClipBoard = () => {
        streamKey && navigator.clipboard.writeText(streamKey);
        pushToast(<TextToast text='Stream key copied to clipboard!' />);
    };

    const toggleStreamKey = () => {
        if (streamKey)
            setStreamKey(undefined);
        else
            getStreamKey().then(json => setStreamKey(json?.key));
    };

    const onRefreshConfirm = () => {
        refreshStreamKey().then(json => {
            setStreamKey(json?.key);
            setToRefreshStreamKey(false);
        });
    };

    const addRestream = (data: RestreamData) => {
        setData([...(restreamPlatforms ?? []).filter(d => d.id !== data.id), data]);
        setEditRestreamPlatform(undefined);
    };

    const deleteRestream = () => {
        setData((restreamPlatforms ?? []).filter(p => p.id !== editRestreamPlatform?.id));
        setEditRestreamPlatform(undefined);
    };

    if (loadingChannel)
        return <Loading />;

    if (!channel)
        return <Body1>Channel Missing?</Body1>;

    return (
        <PageWrapper>
            {editName ? (
                <Input label='' value={channel.name} onChange={e => setChannelInfo({ ...channel, name: e.target.value })} postfixContent={
                    <IconsWrapper>
                        <Icon className='fas fa-check' onClick={() => onUpdateChannel(channel)} />
                        <Icon className='fas fa-times' onClick={() => { setEditName(false); resetData(); }} />
                    </IconsWrapper>
                } />
            ) :
                <HeaderWrapper>
                    <Headline2>{channel.name}</Headline2>
                    <Icon className='fas fa-pen' onClick={() => setEditName(!editName)} />
                </HeaderWrapper>
            }
            <ButtonRow>
                <OutlinedButton onClick={() => navigate('clips')}>Clips</OutlinedButton>
                <OutlinedButton onClick={() => navigate('vods')}>VODs</OutlinedButton>
            </ButtonRow>
            <InputsWrapper>
                <Input
                    label='Stream Key'
                    value={fetchingStreamKey || !streamKey ? 'Fetching key...' : streamKey}
                    type={streamKey ? 'text' : 'password'}
                    readOnly
                    onClick={() => streamKey && copyStreamKeyToClipBoard()}
                    postfixContent={
                        <IconsWrapper>
                            <Icon className={`far ${streamKey ? 'fa-eye-slash' : 'fa-eye'}`} onClick={toggleStreamKey} />
                            <Icon className='fas fa-redo' onClick={() => setToRefreshStreamKey(true)} />
                        </IconsWrapper>
                    } />
                <ToggleSwitch label='Public' checked={channel.isPublic} onClick={togglePublic} />
            </InputsWrapper>
            <SpaceBetween>
                <Headline4>Restream</Headline4>
                <OutlinedButton onClick={() => setEditRestreamPlatform(({
                    id: -1,
                    channelId: channel.id,
                    active: true,
                    platform: 'twitch',
                    url: null,
                    streamKey: '',
                    protocol: 'rtmp',
                }))}>Add</OutlinedButton>
            </SpaceBetween>
            <CustomTable>
                <tr>
                    <TH>Active</TH>
                    <TH>Platform</TH>
                    <TH>Protocol</TH>
                    <TH>URL</TH>
                    <TH>Stream Key</TH>
                </tr>
                {
                    ([...(restreamPlatforms ?? [])]).sort((a, b) => a.id - b.id).map(p => (
                        <CustomRow key={p.id} onClick={() => setEditRestreamPlatform(p)}>
                            <TD>
                                <i className={p.active ? 'fas fa-check' : 'fas fa-times'} style={{ color: p.active ? 'green' : 'red' }} />
                            </TD>
                            <TD>
                                <i className={platformIcons[p.platform]} />
                            </TD>
                            <TD>
                                {p.protocol}
                            </TD>
                            <TD>
                                {p.url}
                            </TD>
                            <TD>
                                {p.streamKey}
                            </TD>
                        </CustomRow>
                    ))
                }
            </CustomTable>
            <ButtonRow>
                <DangerButton onClick={() => setToDeleteChannel(true)}>DELETE CHANNEL</DangerButton>
            </ButtonRow>
            <ConfirmationModal
                show={!!toDeleteChannel}
                text={`Are you sure you want to delete the channel '${channel?.name}' ?`}
                yesText='Yes'
                onYesClick={onDeleteConfirm}
                noText='No'
                onNoClick={() => setToDeleteChannel(false)} />
            <ConfirmationModal
                show={!!toRefreshStreamKey}
                text='Are you sure you want to refresh your stream key? All streams trying to use the old key will no longer work!'
                yesText='Yes'
                onYesClick={onRefreshConfirm}
                noText='No'
                onNoClick={() => setToRefreshStreamKey(false)} />
            {editRestreamPlatform !== undefined && channel && (
                <AddRestreamModal show={editRestreamPlatform !== undefined}
                    requestClose={() => setEditRestreamPlatform(undefined)}
                    restreamData={editRestreamPlatform}
                    addRestream={addRestream}
                    deleteRestream={deleteRestream} />
            )}
        </PageWrapper>
    );
};