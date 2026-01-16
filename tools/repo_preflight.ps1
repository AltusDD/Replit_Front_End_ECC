$ErrorActionPreference = 'Stop'
$expected = 'https://github.com/AltusDD/Replit_Front_End_ECC.git'

$toplevel = (git rev-parse --show-toplevel)
$origin = (git remote get-url origin)
$branch = (git branch --show-current)
$head = (git rev-parse --short HEAD)

Write-Output ('TOPLEVEL=' + $toplevel)
Write-Output ('ORIGIN=' + $origin)
Write-Output ('BRANCH=' + $branch)
Write-Output ('HEAD=' + $head)

if($origin -ne $expected){
  Write-Output ('FAIL_ORIGIN_MISMATCH expected=' + $expected)
  exit 1
}

if(!(Test-Path '.\src\App.tsx')){
  Write-Output 'FAIL_MISSING_src_App_tsx'
  exit 1
}

if(!(Test-Path '.\vite.config.js') -and !(Test-Path '.\vite.config.ts')){
  Write-Output 'FAIL_MISSING_vite_config'
  exit 1
}

Write-Output 'OK'
exit 0
