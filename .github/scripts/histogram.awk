{
    m = $1 > m ? $1 : m
    arr[int($1 / bin) * bin] += 1
}

END {
    for (i = 0; i < m; i = i + bin) {
        print i, (i in arr ? arr[i] : 0)
    }
}
