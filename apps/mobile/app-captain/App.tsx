import { BthMobileRoot } from '@bthwani/ui-kit';
import CaptainHomeShell from '@bthwani/surfaces/platform/captain/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot direction="rtl" language="ar" themeMode="light">
			<CaptainHomeShell />
		</BthMobileRoot>
	);
}
