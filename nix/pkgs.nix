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
    (import ./overlays.nix { inherit sources; })
    ++
    overlays
  ;
in
  import sources.nixpkgs { inherit config system; overlays = allOverlays; }
