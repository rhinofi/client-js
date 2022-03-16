let
  pkgs = import ./nix/pkgs.nix {};
in
  pkgs.mkShell {
    packages = with pkgs; [
      nodejs
      yarn
    ];
  }
