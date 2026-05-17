#Requires -Version 5.1
Set-Location -LiteralPath "C:\bthwani-suite"
& powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\scripts\GHB_CHECKPOINT_VERIFY.ps1" @args
exit $LASTEXITCODE
