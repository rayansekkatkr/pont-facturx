#!/usr/bin/env bash
set -euo pipefail

# Fetch EN16931 validation artefacts (Schematron/XSLT) into the repo.
# Source: https://github.com/ConnectingEurope/eInvoicing-EN16931 (tag validation-1.3.15 by default)

TAG="${1:-validation-1.3.15}"
TARGET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../api/app/validators/schematron" && pwd)/en16931"

echo "-> Installing EN16931 validators into: ${TARGET_DIR}"
rm -rf "${TARGET_DIR}"
mkdir -p "$(dirname "${TARGET_DIR}")"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

git clone --depth 1 --branch "${TAG}" https://github.com/ConnectingEurope/eInvoicing-EN16931.git "$tmp/en16931"

# keep only what's needed for CII validation
mkdir -p "${TARGET_DIR}"
cp -R "$tmp/en16931/cii" "${TARGET_DIR}/cii"
cp -R "$tmp/en16931/ubl" "${TARGET_DIR}/ubl"
cp "$tmp/en16931/README.md" "${TARGET_DIR}/README.md" || true

echo "✅ Done."
echo "You can now set ENABLE_SCHEMATRON=1 in docker-compose.yml (or env) to enable Schematron checks."
