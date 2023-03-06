import argparse
import json
import statistics
import sys
from datetime import datetime, timezone
from pathlib import Path
from string import Template


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", required=True)
    parser.add_argument("--bin", default=50)
    args = parser.parse_args()

    ratings = []
    p = Path(args.input_dir)
    for child in p.iterdir():
        if not child.is_file():
            continue

        with open(child) as f:
            content = json.load(f)

        for player in content["leaderboard"]:
            ratings.append(player["rating"])

    max_rating = max(ratings)
    frequencies = [0 for _ in range(max_rating // args.bin + 1)]
    for rating in ratings:
        frequencies[rating // args.bin] += 1

    p = Path(__file__).parent / "templates" / "index.html"
    with open(p) as f:
        index_template = Template(f.read())

    template_data = dict(
        labels=list(range(0, max_rating, args.bin)),
        data=frequencies,
        bin_size=args.bin,
        active_players=len(ratings),
        median_rating=int(statistics.median(ratings)),
        timestamp=datetime.now(timezone.utc).isoformat(timespec="seconds"),
    )

    rendered = index_template.safe_substitute(template_data)
    sys.stdout.write(rendered)

    return 0


if __name__ == "__main__":
    sys.exit(main())
