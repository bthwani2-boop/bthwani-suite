import React from 'react';
import {
	DshHomeApprovedVideoReelsViewer,
	DshSurfaceHost,
	type DshCommandTarget,
	type DshHomeApprovedVideoReelsViewerProps,
} from '../../dsh/frontend/app-client';

export type ClientSurfaceHostProps = {
	renderApprovedVideoReelsViewer?: (props: DshHomeApprovedVideoReelsViewerProps) => React.ReactNode;
};

type DshNavigationCommand = {
	token: number;
	target: DshCommandTarget;
};

export function ClientSurfaceHost({ renderApprovedVideoReelsViewer }: ClientSurfaceHostProps) {
	const [command] = React.useState<DshNavigationCommand>({
		token: 1,
		target: 'home',
	});

	return (
		<DshSurfaceHost
			command={command}
			renderApprovedVideoReelsViewer={(props) =>
				renderApprovedVideoReelsViewer?.(props) ?? <DshHomeApprovedVideoReelsViewer {...props} />
			}
		/>
	);
}

export default ClientSurfaceHost;
