import {POST as REDDIT_POST, PREVIEW_IMAGE} from './reddit-api';

export type POST = Omit<REDDIT_POST['data'], 'preview'> & PREVIEW_IMAGE['source'] & {
    displayedLast: EpochTimeStamp,
    firstSeen: EpochTimeStamp
}
