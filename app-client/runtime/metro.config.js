const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, 'node_modules'),
	path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.unstable_enableSymlinks = true;

// Prevent Metro from walking up past the project root to find node_modules.
// In pnpm workspaces this causes double-resolution where Metro finds both the
// hoisted root copy and the nested .pnpm copy, leading to split module graphs
// and ESM/CJS interop breakage (the 'default' of undefined error).
config.resolver.disableHierarchicalLookup = false;

// Force Metro to use the `main` field (CJS) instead of the `exports` map.
// @expo/vector-icons ships pure-ESM files via the `module`/`exports` fields.
// When Metro resolves those it gets ESM `export default` modules whose `.default`
// property is non-writable in the Fabric renderer — crashing with
// "TypeError: property is not writable" and "ExceptionsManager" ordering errors.
config.resolver.unstable_enablePackageExports = false;

config.resolver.blockList = [
	/.*\.next([/\\]|$).*/,
	/.*\.turbo([/\\]|$).*/,
	/.*[/\\]tools[/\\]registry[/\\]runs([/\\]|$).*/,
	/.*[/\\]build[/\\]cache([/\\]|$).*/,
];

module.exports = config;
