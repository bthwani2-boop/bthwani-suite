/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies are forbidden.",
      from: {},
      to: { circular: true }
    },
    {
      name: "ui-kit-must-not-depend-on-apps-or-surfaces",
      severity: "error",
      comment: "packages/ui-kit is a central authority and must not depend on apps or packages/surfaces.",
      from: { path: "^packages/ui-kit/" },
      to:   { path: "^(apps/|packages/surfaces/)" }
    },
    {
      name: "surfaces-must-not-depend-on-apps",
      severity: "error",
      comment: "packages/surfaces must not import from app implementations.",
      from: { path: "^packages/surfaces/" },
      to:   { path: "^apps/" }
    },
    {
      name: "repo-code-must-not-import-run-evidence",
      severity: "error",
      comment: "Source code must never import from tools/registry/runs evidence outputs.",
      from: { path: "^(apps/|packages/|services/)" },
      to:   { path: "^tools/registry/runs/" }
    }
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: "(^|/)(node_modules|dist|build|coverage|\\\\.next|\\\\.expo|tools/registry/runs)(/|$)",
    tsPreCompilationDeps: false,
    combinedDependencies: true,
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+"
      }
    }
  }
};
