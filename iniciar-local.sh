#!/bin/sh
cd "$(dirname "$0")" && echo "Sitio: http://localhost:8000  Admin: http://localhost:8000/admin.html" && python3 -m http.server 8000
