import { BthMobileRoot } from '@bthwani/ui-kit';
import PartnerSurfaceHost from '@bthwani/app-shells/mobile/partner/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot direction="rtl" language="ar" themeMode="light">
			<PartnerSurfaceHost />
		</BthMobileRoot>
	);
}
