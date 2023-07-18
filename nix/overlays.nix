{ sources ? import ./sources.nix }:
[
  (self: super: {
    yarn-berry-source = sources.yarn-berry-cjs-rhinofi;
    yarn-berry = super.callPackage (import ./packages/yarn-berry.nix) {};
  })
  (self: super: {
    gh-md-toc-source = sources.github-markdown-toc;
    gh-md-toc = super.callPackage (import ./packages/gh-md-toc.nix) {};
  })
  (self: super: {
    append-dev-to-node-package-version = super.callPackage (import ./packages/append-dev-to-node-package-version.nix) {};
  })
]