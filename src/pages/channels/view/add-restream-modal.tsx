import { ButtonRow, ContainedButton, Headline3, Input, InputsWrapper, Loading, Modal, Option, OutlinedButton, Select, TextToast, ToggleSwitch, useFetch, useQuery, useToast } from 'gobble-lib-react';
import { useState } from 'react';
import { RestreamData } from './restream-data';
import styled from 'styled-components';
import { DangerButton } from '../../../components/danger-button';
import { deleteParams, getParams, patchParams, postParams } from '../../../network/request-types';
import { Tracks } from './tracks';
import { PasswordInput } from '../../../components/password-input';

const ModalWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
`;

type AddRestreamModalProps = {
    readonly show: boolean
    readonly requestClose: () => void
    readonly restreamData: RestreamData
    readonly addRestream: (data: RestreamData) => void
    readonly deleteRestream: () => void
}

export const AddRestreamModal = ({ show, requestClose, restreamData, addRestream, deleteRestream }: AddRestreamModalProps) => {
    const { pushToast } = useToast();
    const [updatedData, setUpdatedData] = useState(restreamData);
    const [deleteClicks, setDeleteClicks] = useState(0);

    const isNewRestream = restreamData.id === -1;

    const [tracks, loadingTracks] = useFetch<Tracks>('/api/ome/tracks', { requestData: getParams });

    const [addRestreamData, adding] = useQuery<RestreamData>(`/api/channel/${restreamData.channelId}/restreams`, {
        requestData: postParams,
        shouldThrow: true
    });
    const [updateRestreamData, updating] = useQuery<RestreamData>(`/api/channel/${restreamData.channelId}/restreams`, {
        requestData: patchParams,
        shouldThrow: true
    });
    const [deleteRestreamData, deleting] = useQuery<RestreamData>(`/api/channel/${restreamData.channelId}/restreams`, {
        requestData: deleteParams,
        shouldThrow: true
    });

    const onSaveClick = () => {

        if (!updatedData.name) {
            pushToast(<TextToast text='Name required!' />);
            return;
        }

        if (!updatedData.url) {
            pushToast(<TextToast text='URL required!' />);
            return;
        }

        if (!updatedData.streamKey) {
            pushToast(<TextToast text='Stream key required!' />);
            return;
        }

        if (!updatedData.videoTrack) {
            pushToast(<TextToast text='Video track required!' />);
            return;
        }

        if (!updatedData.audioTrack) {
            pushToast(<TextToast text='Audio track required!' />);
            return;
        }

        if (isNewRestream) {
            addRestreamData(JSON.stringify(updatedData))
                .then(resp => resp && addRestream(resp))
                .catch(() => pushToast(<TextToast text='Failed to save!' />));
        }
        else {
            updateRestreamData(JSON.stringify(updatedData), `${updatedData.id}`)
                .then(resp => resp && addRestream(resp))
                .catch(() => pushToast(<TextToast text='Failed to save!' />));
        }
    };

    const onDeleteClick = () => {
        if (deleteClicks === 0) {
            setDeleteClicks(1);
        }
        else {
            deleteRestreamData(undefined, `${updatedData.id}`)
                .then(() => deleteRestream())
                .catch(() => pushToast(<TextToast text='Failed to delete!' />));
        }
    };

    return (
        <Modal show={show} requestClose={requestClose}>
            {
                loadingTracks
                    ? <Loading />
                    : (
                        <ModalWrapper>
                            <Headline3>Forward Stream</Headline3>
                            <InputsWrapper>
                                <ToggleSwitch label='Active' checked={updatedData.active} onClick={() => setUpdatedData(old => ({ ...old, active: !old.active }))} />
                                <Input label='Name' value={updatedData.name} onChange={e => setUpdatedData(old => ({ ...old, name: e.target.value }))} />
                                <Input label='URL' value={updatedData.url} onChange={e => setUpdatedData(old => ({ ...old, url: e.target.value }))} />
                                <PasswordInput label='Stream Key' canEdit={true} value={updatedData.streamKey} onChange={val => setUpdatedData(old => ({ ...old, streamKey: val }))} />
                                <Select label='Video Track' value={updatedData.videoTrack} onChange={e => setUpdatedData(old => ({ ...old, videoTrack: e.target.value }))}>
                                    {updatedData.videoTrack === '' && <Option value={''}>===Pick Track===</Option>}
                                    {
                                        tracks?.video?.map(vt => <Option key={vt} value={vt}>{vt}</Option>)
                                    }
                                </Select>
                                <Select label='Audio Track' value={updatedData.audioTrack} onChange={e => setUpdatedData(old => ({ ...old, audioTrack: e.target.value }))}>
                                    {updatedData.audioTrack === '' && <Option value={''}>===Pick Track===</Option>}
                                    {
                                        tracks?.audio?.map(at => <Option key={at} value={at}>{at}</Option>)
                                    }
                                </Select>
                            </InputsWrapper>
                            <ButtonRow>
                                {!isNewRestream && <DangerButton onClick={() => onDeleteClick()} loading={deleting}>{deleteClicks === 0 ? 'Delete' : 'Click to Confirm'}</DangerButton>}
                                <ContainedButton onClick={onSaveClick} loading={adding || updating}>{isNewRestream ? 'Add' : 'Update'}</ContainedButton>
                                <OutlinedButton onClick={requestClose}>Cancel</OutlinedButton>
                            </ButtonRow>
                        </ModalWrapper>
                    )
            }
        </Modal>
    );
};