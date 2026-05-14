import React from 'react';
import { appClientSurfaceRegistry, type DshCommandTarget, type DshHomeApprovedVideoReelsViewerProps } from '../composition';

export type ClientSurfaceHostProps = {
	renderApprovedVideoReelsViewer?: (props: DshHomeApprovedVideoReelsViewerProps) => React.ReactNode;
};

type DshNavigationCommand = {
	token: number;
	target: DshCommandTarget;
};

export function ClientSurfaceHost({ renderApprovedVideoReelsViewer }: ClientSurfaceHostProps) {
	const dsh = appClientSurfaceRegistry.dsh;
	const [command] = React.useState<DshNavigationCommand>({
		token: 1,
		target: 'home',
	});

	return (
		<dsh.SurfaceHost
			command={command}
			renderApprovedVideoReelsViewer={(props) =>
				renderApprovedVideoReelsViewer?.(props) ?? <dsh.ApprovedVideoReelsViewer {...props} />
			}
		/>
	);
}
