#!/usr/bin/env bash
set -euo pipefail

echo "== Pont Factur-X: doctor =="

echo "- Python deps (inside container):"
python -c "import fastapi, celery, facturx, jinja2, sqlalchemy; print('OK')"

echo "- Optional deps:"
python - <<'PY'
import shutil
for b in ["gs", "verapdf"]:
    print(f"  {b}: {'FOUND' if shutil.which(b) else 'MISSING'}")
PY

echo "- EN16931 validators:"
if [ -d "api/app/validators/schematron/en16931/cii" ]; then
  echo "  FOUND"
else
  echo "  MISSING (run scripts/bootstrap_en16931.sh)"
fi

echo "✅ doctor finished."
