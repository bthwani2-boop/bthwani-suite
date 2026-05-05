import { MobileRoot } from '@bthwani/ui-kit/mobile';
import PartnerSurfaceHost from '../shell/mobile-entry';

export default function App() {
	return (
		<MobileRoot language="ar" themeMode="light">
			<PartnerSurfaceHost />
		</MobileRoot>
	);
}
