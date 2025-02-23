import { ButtonRow, ContainedButton, Headline3, Input, InputsWrapper, Modal, OutlinedButton, TextToast, ToggleSwitch, useQuery, useToast } from 'gobble-lib-react';
import { useState } from 'react';
import { Channel } from '../channel';
import { postParams } from '../../../network/request-types';

type NewChannelModalProps = {
    readonly show: boolean
    readonly requestClose: () => void
    readonly addChannel: (c: Channel) => void
}

export const NewChannelModal = ({ show, requestClose, addChannel }: NewChannelModalProps) => {
    const { pushToast } = useToast();
    const [name, setName] = useState('');

    const [createChannel] = useQuery<Channel>('/api/channel', { requestData: postParams });

    const onAddClick = () => {
        if (!name) {
            pushToast(<TextToast text='You must give this channel a name!' />);
            return;
        }

        const channel: Channel = {
            id: -1,
            name,
            created: new Date().toISOString()
        };
        createChannel(JSON.stringify(channel)).then(c => c && addChannel(c));
    };

    return (
        <Modal show={show} requestClose={requestClose}>
            <Headline3>New Channel</Headline3>
            <InputsWrapper>
                <Input label='Name' value={name} onChange={e => setName(e.target.value)} />
            </InputsWrapper>
            <ButtonRow>
                <ContainedButton onClick={onAddClick}>Add</ContainedButton>
                <OutlinedButton onClick={requestClose}>Cancel</OutlinedButton>
            </ButtonRow>
        </Modal>
    );
};