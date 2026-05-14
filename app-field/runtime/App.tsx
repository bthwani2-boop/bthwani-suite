import { getBThwaniAppearanceThemeMode } from '@bthwani/ui-kit';
import { MobileRoot } from '@bthwani/ui-kit/mobile';
import { AppFieldAppearanceProvider, useAppFieldAppearance } from '../shell/appearance';
import FieldSurfaceHost from '../shell/mobile-entry';

function AppFieldRuntimeRoot() {
	const { mode } = useAppFieldAppearance();

	return (
		<MobileRoot language="ar" themeMode={getBThwaniAppearanceThemeMode(mode)} appearanceMode={mode}>
			<FieldSurfaceHost />
		</MobileRoot>
	);
}

export default function App() {
	return (
		<AppFieldAppearanceProvider>
			<AppFieldRuntimeRoot />
		</AppFieldAppearanceProvider>
	);
}
