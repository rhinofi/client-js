{
  writers,
  bash,
  lib,
  moreutils,
  jq,
  name ? "append-dev-to-node-package-version"
}:
writers.writeBashBin name ''
  set -ueo pipefail

  ${lib.getExe jq} \
    '.version = .version + "-dev"' \
    package.json \
    | ${moreutils}/bin/sponge package.json
''