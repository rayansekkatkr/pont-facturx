from __future__ import annotations

import glob
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from lxml import etree

SVRL_NS = "http://purl.oclc.org/dsdl/svrl"
NSMAP = {"svrl": SVRL_NS}


@dataclass
class SchematronIssue:
    flag: str
    rule_id: str
    location: str
    text: str


def _find_cii_xslt(validators_root: str) -> str | None:
    root = Path(validators_root)
    # Prefer preprocessed compiled XSLT if present; fall back to any EN16931 CII xslt/xsl
    patterns = [
        str(root / "cii" / "xslt" / "EN16931-CII-validation-preprocessed.xslt"),
        str(root / "cii" / "xslt" / "EN16931-CII-validation-preprocessed.xsl"),
        str(root / "cii" / "xslt" / "EN16931-CII-validation.xslt"),
        str(root / "cii" / "xslt" / "EN16931-CII-validation.xsl"),
        str(root / "cii" / "xslt" / "*CII*validation*.xslt"),
        str(root / "cii" / "xslt" / "*CII*validation*.xsl"),
    ]
    for p in patterns:
        matches = glob.glob(p)
        if matches:
            return matches[0]
    return None


def run_en16931_cii_schematron(xml_path: str, validators_root: str) -> dict[str, Any]:
    """Validate a CII XML with EN16931 Schematron (ConnectingEurope artefacts).

    This runs the pre-compiled XSLT that outputs an SVRL report, then extracts failed assertions.
    """
    xslt_path = _find_cii_xslt(validators_root)
    if not xslt_path:
        return {
            "status": "skipped",
            "reason": "missing_xslt",
            "hint": "Run scripts/bootstrap_en16931.sh to download EN16931 artefacts",
        }

    xml_doc = etree.parse(str(xml_path))
    xslt_doc = etree.parse(str(xslt_path))
    transform = etree.XSLT(xslt_doc)
    svrl = transform(xml_doc)

    failed = []
    warnings = []
    for node in svrl.xpath("//svrl:failed-assert", namespaces=NSMAP):
        flag = (node.get("flag") or "fatal").lower()
        issue = SchematronIssue(
            flag=flag,
            rule_id=node.get("id") or "",
            location=node.get("location") or "",
            text=("".join(node.xpath("svrl:text/text()", namespaces=NSMAP)) or "").strip(),
        )
        if flag in ("warning", "warn", "info"):
            warnings.append(issue.__dict__)
        else:
            failed.append(issue.__dict__)

    return {
        "status": "ok" if not failed else "failed",
        "xslt": xslt_path,
        "errors": failed,
        "warnings": warnings,
        "error_count": len(failed),
        "warning_count": len(warnings),
    }
