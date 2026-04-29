import { dshAppClient } from '@bthwani/surfaces/app-client';

export const ApprovedVideoReelsViewer = dshAppClient.DshHomeApprovedVideoReelsViewer;

export type DshHomeApprovedVideoReelsViewerProps = Parameters<typeof ApprovedVideoReelsViewer>[0];

export default ApprovedVideoReelsViewer;
