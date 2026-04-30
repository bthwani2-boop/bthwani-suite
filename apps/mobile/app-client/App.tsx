// NOTE (example-only): Placeholder identifiers in this file are examples for development and not runtime secrets. See kdt/merge-run/.../proposed/PROTECTED_TOKENS_ALLOWLIST.md for accepted tokens.
import { MobileRoot } from '@bthwani/ui-kit/mobile';
import ClientSurfaceHost from '@bthwani/app-shells/mobile/client/mobile-entry';
import ApprovedVideoReelsViewer from './ApprovedVideoReelsViewer';

export default function App() {
	return (
		<MobileRoot language="ar" themeMode="light">
			<ClientSurfaceHost
				renderApprovedVideoReelsViewer={(props) => <ApprovedVideoReelsViewer {...props} />}
			/>
		</MobileRoot>
	);
}
