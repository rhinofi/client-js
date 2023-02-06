{
  sources ? import ./sources.nix,
  config ? {},
  system ? builtins.currentSystem,
  overlays ? []
}:
let
  allOverlays =
    # These overlays augment centrally defined packages with things specific
    # to this service.
    [
      (self: super: {
        yarn-berry-source = sources.yarn-berry-cjs;
        yarn-berry = super.callPackage (import ./packages/yarn-berry.nix) {};
      })
      (self: super: {
        gh-md-toc-source = sources.github-markdown-toc;
        gh-md-toc = super.callPackage (import ./packages/gh-md-toc.nix) {};
      })
    ]
    ++
    overlays
  ;
in
  import sources.nixpkgs { inherit config system; overlays = allOverlays; }
