# TODO: move to rhinofi/yarn-berry-cjs
{
  lib,
  nodejs,
  runCommandNoCC,
  yarn-berry-source,

  name ? "yarn"
}:
let
  package = runCommandNoCC
    name
    { buildInputs = [ nodejs ]; }
    ''
      binName=${name}
      binPath=$out/bin/$binName
      mkdir -p $(dirname $binPath)
      cp ${yarn-berry-source}/bin/$binName $binPath
      patchShebangs $binPath
    ''
  ;
in package.overrideAttrs (old: {
  passthru = (old.passthru or {}) // {
    inherit nodejs;
    yarn-source-path = "${yarn-berry-source}/bin/yarn";
  };
})