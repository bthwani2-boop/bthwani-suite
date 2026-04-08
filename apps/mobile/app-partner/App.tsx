import { BthMobileRoot } from '@bthwani/ui-kit';
import PartnerHomeShell from '@bthwani/surfaces/platform/partner/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot direction="rtl" language="ar" themeMode="light">
			<PartnerHomeShell />
		</BthMobileRoot>
	);
}
