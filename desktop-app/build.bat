@echo off
echo Building SpeechToText for Windows...

echo Creating icons...
python create_icons.py

echo Installing PyInstaller...
pip install pyinstaller

echo Building executable...
pyinstaller --onefile --windowed ^
    --icon=assets\icon.ico ^
    --name=SpeechToText ^
    --add-data "assets;assets" ^
    --hidden-import=pynput.keyboard._win32 ^
    --hidden-import=pynput.mouse._win32 ^
    --hidden-import=deepgram ^
    main.py

echo.
echo Build complete! Output: dist\SpeechToText.exe
pause
