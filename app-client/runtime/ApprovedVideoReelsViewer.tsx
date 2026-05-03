import { dshAppClient } from '../composition';

export const ApprovedVideoReelsViewer = dshAppClient.DshHomeApprovedVideoReelsViewer;

export type DshHomeApprovedVideoReelsViewerProps = Parameters<typeof ApprovedVideoReelsViewer>[0];

export default ApprovedVideoReelsViewer;
