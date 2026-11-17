@echo off
cd /d "%~dp0"
echo Sitio: http://localhost:8000   Admin: http://localhost:8000/admin.html
python -m http.server 8000
