import { Icon, Input, TextToast, useToast } from 'gobble-lib-react';
import { useState } from 'react';
import { styled } from 'styled-components';

const IconsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
`;

type PasswordInputProps = {
    readonly label: string
    readonly value: string | undefined
    readonly canRefresh?: boolean
    readonly canEdit?: boolean
    readonly refreshPassword?: () => void
    readonly onChange?: (value: string) => void
}

export const PasswordInput = ({ label, value, canRefresh = false, canEdit = false, refreshPassword, onChange }: PasswordInputProps) => {

    const { pushToast } = useToast();

    const [visible, setVisible] = useState(false);

    const copyStreamKeyToClipBoard = () => {
        value && navigator.clipboard.writeText(value);
        pushToast(<TextToast text='Stream key copied to clipboard!' />);
    };

    return (
        <Input
            label={label}
            value={visible ? value : 'REALLY LONG Text to hide the password'}
            type={visible ? 'text' : 'password'}
            readOnly={!canEdit}
            onClick={() => visible && !canEdit && copyStreamKeyToClipBoard()}
            onChange={e => canEdit && onChange && onChange(e.target.value)}
            postfixContent={
                <IconsWrapper>
                    <Icon className={`far ${visible ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => !!value && setVisible(!visible)} />
                    {canRefresh && <Icon className='fas fa-redo' onClick={() => refreshPassword && refreshPassword()} />}
                </IconsWrapper>
            } />
    );
};