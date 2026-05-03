import React from 'react';
import { MobileRoot } from '@bthwani/ui-kit/mobile';
import {
	DshHomeApprovedVideoReelsViewer,
	DshSurfaceHost,
	type DshCommandTarget,
} from '../../dsh/frontend/app-client';

type DshNavigationCommand = {
	token: number;
	target: DshCommandTarget;
};

export default function App() {
	const [command] = React.useState<DshNavigationCommand>({
		token: 1,
		target: 'home',
	});

	return (
		<MobileRoot language="ar" themeMode="light">
			<DshSurfaceHost
				command={command}
				renderApprovedVideoReelsViewer={(props) => <DshHomeApprovedVideoReelsViewer {...props} />}
			/>
		</MobileRoot>
	);
}
