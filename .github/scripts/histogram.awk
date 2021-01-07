{
    hi = $1 > hi ? $1 : hi
    arr[int($1 / bin) * bin] += 1
}

END {
    for (i = 0; i < hi; i = i + bin) {
        print i, (i in arr ? arr[i] : 0)
    }
}
