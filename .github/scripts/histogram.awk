#!/usr/bin/awk -f
#
# This script takes a list of numbers separated by newlines
# and outputs the frequencies of each bin.
# The bin width must be specified - it's passed to AWK as the `bin` variable;
# see 'Usage' for an example.
#
# Usage
# -----
# $ echo '1 1 2 3 4 4 4 5' | tr ' ' '\n' | ./histogram.awk -v bin=2
# 2
# 2
# 4
#
# Notes
# -----
# The first bin implicitly starts at zero.


{
  max = $1 > max ? $1 : max
  arr[int($1 / bin) * bin] += 1
}

END {
  for (i = 0; i <= max; i = i + bin) {
    print (i in arr ? arr[i] : 0)
  }
}
