{
  pkgs ? import ./nix/pkgs.nix {}
}:
let
  shellPackage = {
    niv,
    nodejs,
    yarn-berry,
    gh-md-toc,
  }@deps: pkgs.mkShell {
    packages = builtins.attrValues deps;
  };
in
  pkgs.callPackage shellPackage {}