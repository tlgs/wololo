import argparse
import json
import logging
import os
import sys
import uuid

import urllib3
from urllib3.exceptions import MaxRetryError
from urllib3.util import Retry

logger = logging.getLogger(__name__)
stdout_handler = logging.StreamHandler(sys.stdout)
stdout_handler.setFormatter(
    logging.Formatter(
        "{asctime} [{levelname:<8}] {message}",
        datefmt="%Y-%m-%d %H:%M:%S",
        style="{",
    )
)

http = urllib3.PoolManager(timeout=1, retries=Retry(total=5, redirect=0))

base_url = (
    "https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=3&start={}&count={}"
)


def _setup_logging():
    logger.setLevel(logging.INFO)
    logger.addHandler(stdout_handler)


def _enable_urllib3_logging():
    urllib3_logger = logging.getLogger("urllib3")
    urllib3_logger.setLevel(logging.INFO)
    urllib3_logger.addHandler(stdout_handler)


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
    parser.add_argument("-d", "--directory", required=True)
    args = parser.parse_args()

    _setup_logging()
    _enable_urllib3_logging()

    try:
        total_players = get_total_players()
    except (MaxRetryError, json.JSONDecodeError, ValueError):
        return 1

    for i in range(1, total_players, 10_000):
        try:
            r = http.request("GET", base_url.format(i, 10_000))
        except MaxRetryError:
            logger.critical("hit max retries")
            return 1

        logger.info(
            f"success {i=} status={r.status} length={r.headers['Content-Length']}"
        )

        os.makedirs(args.directory, exist_ok=True)

        file_name = str(uuid.uuid4())
        with open(f"{args.directory}/{file_name}.json", "wb") as f:
            f.write(r.data)

    return 0


if __name__ == "__main__":
    sys.exit(main())
