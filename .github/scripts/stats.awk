#!/usr/bin/awk -f
#
# This script takes a list of numbers separated by newlines and
# outputs the following statistics:
#   - Mean (μ)
#   - Variance (σ²)
#
# Usage
# -----
# $ seq 1 2 10 | ./stats.awk
# 5
# 8
#
# Notes
# -----
# This computes the population variance;
# multiply by `(NR / (NR - 1))` to obtain the sample variance.
#
# References
# ----------
# <https://en.wikipedia.org/wiki/Variance#Sample_variance>


{
  sum += $1
  sumsq += $1 ^ 2
}

END {
  print sum / NR
  print (sumsq / NR) - (sum / NR) ^ 2
}
