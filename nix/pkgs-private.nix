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
          deploy-step = self.callPackage
            ({
              append-dev-to-node-package-version,
              bash-logging-helpers,
              coreutils,
              gh-with-ci-creds,
              jq,
              lib,
              nodejs,
              npm-publish,
              utils,
              name ? "deploy-step"
            }: utils.writeBashBin
              "deploy-step"
              ''
                set -ueo pipefail
                source ${bash-logging-helpers.defaultBinPath}

                is_dev_release=''${1:-true}
                gh_relase_extra_args=
                npm_publish_extra_args=
                log "is_dev_release: $is_dev_release"

                if [[ $is_dev_release == true ]]; then
                  ${lib.getExe append-dev-to-node-package-version}

                  gh_relase_extra_args=--prerelease
                  npm_publish_extra_args="--tag next"
                fi

                version=$(${lib.getExe jq} -r .version package.json)

                log
                log_separator
                log_bold "publishig to npm, version: $version"
                log

                log ${npm-publish} $npm_publish_extra_args
                title=$(${coreutils}/bin/cat release-info/latest-release-title)

                log
                log_separator
                log_bold "creating a GitHub release"
                log "with title: $title"
                log

                log ${lib.getExe gh-with-ci-creds} dev release create -t "$title" "$version" $gh_relase_extra_args
              ''
            )
            {}
          ;
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
