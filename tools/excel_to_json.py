#!/usr/bin/env python3
"""Convert an Excel spreadsheet to a JSON file."""
import argparse
from pathlib import Path
import pandas as pd
import json


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert Excel to JSON")
    parser.add_argument("excel_file", type=Path, help="Path to Excel file")
    parser.add_argument("json_file", type=Path, help="Output JSON path")
    parser.add_argument(
        "--orient",
        default="records",
        help="pandas DataFrame.to_dict orient option (default: records)",
    )
    args = parser.parse_args()

    df = pd.read_excel(args.excel_file)
    data = df.to_dict(orient=args.orient)
    args.json_file.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )


if __name__ == "__main__":
    main()
