import argparse
import json
import logging
import os
import sys

import urllib3
from urllib3.exceptions import MaxRetryError
from urllib3.util import Retry

logger = logging.getLogger(__name__)

http = urllib3.PoolManager(timeout=3, retries=Retry(total=3, redirect=0))

base_url = (
    "https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=3&start={}&count={}"
)


def _setup_logging():
    logger.setLevel(logging.INFO)

    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setFormatter(
        logging.Formatter(
            "{asctime} [{levelname:<8}] {message}",
            datefmt="%Y-%m-%d %H:%M:%S",
            style="{",
        )
    )
    logger.addHandler(stdout_handler)


def get_total_players():
    try:
        r = http.request("GET", base_url.format(1, 1))
    except MaxRetryError:
        logger.critical("hit max retries")
        raise

    try:
        body = json.loads(r.data.decode("utf-8"))
    except json.JSONDecodeError:
        logger.critical("failed to decode response JSON")
        raise

    try:
        total_players = body["total"]
    except ValueError as err:
        logger.critical(f"missing field {err}")
        raise

    return total_players


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()

    _setup_logging()

    try:
        total_players = get_total_players()
        logger.info(f"success {total_players=}")
    except (MaxRetryError, json.JSONDecodeError, ValueError):
        return 1

    for i, start in enumerate(range(1, total_players, 10_000), start=1):
        try:
            r = http.request("GET", base_url.format(start, 10_000))
        except MaxRetryError:
            logger.critical(f"hit max retries {start=}")
            return 1

        status = r.status
        content_length = int(r.headers["Content-Length"])
        logger.info(f"success {start=} {status=} {content_length=}")

        os.makedirs(args.output_dir, exist_ok=True)
        file_name = f"{i:02}.json"
        with open(f"{args.output_dir}/{file_name}", "wb") as f:
            f.write(r.data)

        logger.info(f"wrote file {args.output_dir}/{file_name}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
