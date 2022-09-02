"""Plot a histogram of player ratings and dump to stdout.

Run `pip install seaborn` to install dependencies.
"""
import sys

import matplotlib.pyplot as plt
import seaborn as sns


def main():
    if len(sys.argv) < 2:
        raise RuntimeError("missing argument `bin_width`")

    ratings = [int(x) for x in sys.stdin]

    fig, ax = plt.subplots(figsize=(8, 4.5))

    sns.set_style("white")
    sns.histplot(ratings, binwidth=int(sys.argv[1]))
    sns.despine()

    ax.set_xlabel("Rating")
    ax.set_ylabel("# of players")

    xticks = range(0, 2500, 200)
    ax.set_xticks(xticks, [str(x) for x in xticks], rotation=30)

    fig.savefig(sys.stdout.buffer, format="svg", bbox_inches="tight")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
