import argparse
import collections
import json
import statistics
from datetime import datetime, timezone
from pathlib import Path
from string import Template


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--directory", required=True)
    parser.add_argument("-b", "--bin", default=50)
    args = parser.parse_args()

    # collect ratings from JSON files
    ratings = []
    p = Path(args.directory)
    for child in p.iterdir():
        if not child.is_file():
            continue

        with open(child) as f:
            content = json.load(f)

        for player in content["leaderboard"]:
            ratings.append(player["rating"])

    # create histogram
    frequencies = collections.defaultdict(int)
    for rating in ratings:
        frequencies[rating // args.bin] += 1

    # get template file, and render variables
    with open("templates/dummy.html") as f:
        s = Template(f.read())

    print(
        s.substitute(
            active_players=len(ratings),
            median_rating=int(statistics.median(ratings)),
            update_date=datetime.now(timezone.utc).isoformat(timespec="seconds"),
        ),
        end="",
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
