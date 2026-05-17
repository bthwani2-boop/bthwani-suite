import { getBThwaniAppearanceThemeMode } from '@bthwani/ui-kit';
import { MobileRoot } from '@bthwani/ui-kit/mobile';
import { AppPartnerAppearanceProvider, useAppPartnerAppearance } from '../shell/appearance';
import PartnerSurfaceHost from '../shell/mobile-entry';

function AppPartnerRuntimeRoot() {
	const { mode } = useAppPartnerAppearance();

	return (
		<MobileRoot language="ar" themeMode={getBThwaniAppearanceThemeMode(mode)} appearanceMode={mode}>
			<PartnerSurfaceHost />
		</MobileRoot>
	);
}

export default function App() {
	return (
		<AppPartnerAppearanceProvider>
			<AppPartnerRuntimeRoot />
		</AppPartnerAppearanceProvider>
	);
}
