{
    arr[int($1 / bin) * bin] += 1
}

END {
    for (i = 0; i < hi; i = i + bin) {
        x = (i in arr ? arr[i] : 0)
        print i, x, acc / NR
        acc += x
    }
}
