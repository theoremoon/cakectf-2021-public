with open("./distfiles/output.txt", "r") as f:
    c, n, b = eval(f.readline())

K = Zmod(n)
P.<x> = PolynomialRing(K, implementation='NTL')
f = x^2 + b*x - c
ans = f.small_roots()[0]
print(int.to_bytes(int(ans), 1024//8, 'big'))
