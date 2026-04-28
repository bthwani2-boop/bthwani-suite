#Requires -Version 5.1

& powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1" @args
exit $LASTEXITCODE