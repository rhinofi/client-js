#!/usr/bin/env bash
set -ueo pipefail

github_token=${GITHUB_TOKEN-}

if [[ -z $github_token ]]; then
  while read -r github_token; do
    break
  done
fi

github_user=${1:-dvf-ci}
netrc_path=${2:-$HOME/.netrc}
nix_conf_path=${3:-$HOME/.config/nix/nix.conf}

# Adding leaidng newline incase existing file doesn't end with one.
cat <<EOF >> "$netrc_path"

machine github.com
  login $github_user
  password $github_token
EOF

mkdir -p $(dirname "$nix_conf_path")

# Adding leaidng newline incase existing file doesn't end with one.
echo -e "\nnetrc-file = $netrc_path" >> "$nix_conf_path"
