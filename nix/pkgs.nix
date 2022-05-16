{
  sources ? import ./sources.nix,
  config ? {},
  system ? builtins.currentSystem,
  overlays ? []
}:
  import sources.nixpkgs { inherit config system overlays; }
