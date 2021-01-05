BEGIN {
    for (i = 0; i < hi; i = i + 10)
        a[i] = 0
}

{
    a[int($1 / 10) * 10] += 1
}

END {
    for (i = 0; i < hi; i = i + 10)
        print i, a[i]
}
