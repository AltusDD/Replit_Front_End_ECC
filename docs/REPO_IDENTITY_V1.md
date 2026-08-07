# REPO_IDENTITY_V1 (FRONTEND)

CANONICAL FE
ORIGIN: https://github.com/AltusDD/Replit_Front_End_ECC.git
WORKDIR: C:\_ecc\ecc_frontend_clean
BRANCH: main

RULES
- NO COMMITS FROM OneDrive PATHS.
- If not a git repo: STOP.

REQUIRED PREFLIGHT (MUST PASS)
- git rev-parse --show-toplevel
- git remote -v
- git branch --show-current
- git rev-parse --short HEAD

RUN
- powershell -ExecutionPolicy Bypass -File tools\repo_preflight.ps1
