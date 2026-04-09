import { BthMobileRoot } from '@bthwani/ui-kit';
import FieldSurfaceHost from '@bthwani/app-shells/mobile/field/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot language="ar" themeMode="light">
			<FieldSurfaceHost />
		</BthMobileRoot>
	);
}
