@echo off
cd /d "%~dp0public"
echo Sitio: http://localhost:8000   Admin: http://localhost:8000/admin/
python -m http.server 8000
