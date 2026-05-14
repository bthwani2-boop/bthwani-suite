import { MobileRoot } from '@bthwani/ui-kit/mobile';
import { AppCaptainAppearanceProvider, useAppCaptainAppearance } from '../shell/appearance';
import CaptainSurfaceHost from '../shell/mobile-entry';

function AppCaptainRuntimeRoot() {
	const { mode } = useAppCaptainAppearance();

	return (
		<MobileRoot language="ar" themeMode="light" appearanceMode={mode}>
			<CaptainSurfaceHost />
		</MobileRoot>
	);
}

export default function App() {
	return (
		<AppCaptainAppearanceProvider>
			<AppCaptainRuntimeRoot />
		</AppCaptainAppearanceProvider>
	);
}
