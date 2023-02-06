{
  bash,
  coreutils,
  curl,
  gawk,
  gh-md-toc-source,
  gnugrep,
  gnused,
  lib,
  runCommandNoCC,

  name ? "gh-md-toc"
}:
let
  package = runCommandNoCC
    name
    { buildInputs = [ bash gnused gnugrep coreutils ]; }
    ''
      binName=${name}
      binPath=$out/bin/$binName
      mkdir -p $(dirname $binPath)
      cp ${gh-md-toc-source}/gh-md-toc $binPath
      patchShebangs $binPath
    ''
  ;
in package