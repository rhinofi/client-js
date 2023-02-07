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
    [
      (self: super: {
        ci = {
          pr-step = self.callPackage
            ({
              lib,
              utils,
              yarn-berry,
              nodejs,
              name ? "pr-step"
            }:
            let
              yarnExe = lib.getExe yarn-berry;
            in utils.writeBashBin
              name
              ''
              set -ueo pipefail

              echo yarn version: $(${yarnExe} --version)

              ${yarnExe} --immutable
              ''
            )
            {}
          ;
          deploy-step = self.npm-publish;
        };
      })
      # TODO: format all code and resolve linter errors before enabling this
      # (self: super: super.reusable-overlays.ci-add-linting-and-formatting-checks self super)
    ]
    ++
    overlays
  ;

  # This can be used to work against local version of copy of rhino-core
  # repo instead of specific git commit defined in sources.json
  # pkgsBasePath = ../../rhino-core;
  pkgsBasePath = sources.rhino-core;
  pkgsPath = pkgsBasePath + "/nix/pkgs.nix";
in
  import pkgsPath { inherit config system; overlays = allOverlays; }
