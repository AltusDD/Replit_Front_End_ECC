
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.vite
    pkgs.nodePackages.typescript
  ];
}
