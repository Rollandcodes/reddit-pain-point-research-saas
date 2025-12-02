#!/usr/bin/env python
"""Generate the index.html page for GitHub Pages deployment.

This script creates a simple index page that links to the generated
reports (CSV, Excel, HTML validation report).

Usage:
    python scripts/generate_index.py
"""
import os


def generate_index_html(output_dir: str = "public") -> str:
    """Generate index.html for GitHub Pages.

    Args:
        output_dir: Directory to write the index.html file.

    Returns:
        Path to the generated index.html file.
    """
    html = """<!DOCTYPE html>
<html>
<head><title>PainPointRadar Reports</title></head>
<body><h1>PainPointRadar Reports</h1><ul>
<li><a href="sample_output.csv">sample_output.csv</a></li>
<li><a href="sample_output.xlsx">sample_output.xlsx</a></li>
<li><a href="validation_report.html">validation_report.html</a></li>
</ul></body></html>"""

    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "index.html")
    with open(output_path, "w") as f:
        f.write(html)
    return output_path


if __name__ == "__main__":
    path = generate_index_html()
    print(f"Generated {path}")
