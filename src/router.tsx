import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading, NotFound } from 'gobble-lib-react';
import { ManageChannels } from './pages/channels/manage/manage-channels';
import { ViewChannel } from './pages/channels/view/view-channel';

export const BBRouter = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/' element={<ManageChannels />} />
                <Route path='/channels' element={<ManageChannels />} />
                <Route path='/channel/:id' element={<ViewChannel />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};
