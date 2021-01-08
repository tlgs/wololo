#!/usr/bin/awk -f
#
# <script summary here>
#
# Usage
# -----
# $ echo '1 1 2 3 4 4 4 5' | tr ' ' '\n' | ./histogram.awk -v bin=1
# 0
# 2
# 1
# 1
# 3
# 1


{
  max = $1 > max ? $1 : max
  arr[int($1 / bin) * bin] += 1
}

END {
  for (i = 0; i <= max; i = i + bin) {
    print (i in arr ? arr[i] : 0)
  }
}
