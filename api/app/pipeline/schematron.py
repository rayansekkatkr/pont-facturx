from __future__ import annotations

import glob
import os
import subprocess
import tempfile
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

    def _extract_issues(svrl_doc: Any) -> dict[str, Any]:
        failed: list[dict[str, Any]] = []
        warnings: list[dict[str, Any]] = []
        for node in svrl_doc.xpath("//svrl:failed-assert", namespaces=NSMAP):
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

    def _run_with_lxml() -> dict[str, Any]:
        xml_doc = etree.parse(str(xml_path))
        xslt_doc = etree.parse(str(xslt_path))
        transform = etree.XSLT(xslt_doc)
        svrl = transform(xml_doc)
        return _extract_issues(svrl)

    def _run_with_saxon() -> dict[str, Any]:
        # Many ConnectingEurope stylesheets rely on XPath/XSLT 2.0 functions.
        # lxml/libxslt is XSLT 1.0 only, so we provide a Saxon-HE fallback.
        # Saxon 12+ also expects xmlresolver on the classpath for catalog resolution.
        # Allow overriding via SAXON_CP, otherwise default to /opt/saxon/* (all jars).
        classpath = os.environ.get("SAXON_CP")
        jar = os.environ.get("SAXON_JAR") or "/opt/saxon/saxon-he.jar"
        if not classpath:
            jar_path = Path(jar)
            if jar_path.exists():
                classpath = str(jar_path.parent / "*")
        if not classpath:
            return {
                "status": "error",
                "reason": "missing_saxon",
                "xslt": xslt_path,
                "hint": "Install Saxon-HE and set SAXON_CP (or bake jars under /opt/saxon)",
            }

        with tempfile.TemporaryDirectory() as tmpdir:
            out_path = Path(tmpdir) / "svrl.xml"
            cmd = [
                "java",
                "-cp",
                classpath,
                "net.sf.saxon.Transform",
                f"-s:{xml_path}",
                f"-xsl:{xslt_path}",
                f"-o:{str(out_path)}",
            ]
            proc = subprocess.run(cmd, capture_output=True, text=True)
            if proc.returncode != 0 or not out_path.exists():
                return {
                    "status": "error",
                    "reason": "saxon_failed",
                    "xslt": xslt_path,
                    "returncode": proc.returncode,
                    "stdout_tail": (proc.stdout or "")[-4000:],
                    "stderr_tail": (proc.stderr or "")[-4000:],
                    "cmd": " ".join(cmd),
                }
            svrl_doc = etree.parse(str(out_path))
            return _extract_issues(svrl_doc)

    try:
        return _run_with_lxml()
    except Exception as e:
        # Most commonly: XSLTParseError due to XPath 2.0 functions.
        saxon_res = _run_with_saxon()
        if saxon_res.get("status") != "error":
            saxon_res["engine"] = "saxon"
            return saxon_res
        return {
            "status": "error",
            "reason": "xslt_invocation_failed",
            "xslt": xslt_path,
            "error": str(e),
            "saxon": saxon_res,
        }
