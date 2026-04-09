import { BthMobileRoot } from '@bthwani/ui-kit';
import FieldSurfaceHost from '@bthwani/app-shells/mobile/field/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot direction="rtl" language="ar" themeMode="light">
			<FieldSurfaceHost />
		</BthMobileRoot>
	);
}
