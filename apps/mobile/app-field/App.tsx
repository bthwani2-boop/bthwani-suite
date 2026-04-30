// NOTE (example-only): Placeholder identifiers in this file are examples for development and not runtime secrets. See kdt/merge-run/.../proposed/PROTECTED_TOKENS_ALLOWLIST.md for accepted tokens.
import { MobileRoot } from '@bthwani/ui-kit/mobile';
import FieldSurfaceHost from '@bthwani/app-shells/mobile/field/mobile-entry';

export default function App() {
	return (
		<MobileRoot language="ar" themeMode="light">
			<FieldSurfaceHost />
		</MobileRoot>
	);
}
