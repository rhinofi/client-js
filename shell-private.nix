{
  pkgs ? import ./nix/pkgs-private.nix {}
}:
let
  baseShell = import ./shell.nix { inherit pkgs; };
in
  pkgs.mkShell {
    inputsFrom = [
      (baseShell.override { niv = pkgs.niv-with-gh-token; })
      pkgs.dev-shell-base
    ];
    packages = with pkgs; [
      npm-publish
    ];
  }

