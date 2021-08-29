with open("flag.txt", "rb") as f:
    flag = list(f.read().strip())

def hadamard(M):
    d = M.determinant()
    x = 1.0
    for row in M:
        x *= row.norm()
    return (d / x) ** (1.0/M.ncols())

def keygen(n, d):
    k = int(floor(sqrt(n) * d))
    while True:
        R = k * Matrix.identity(ZZ, n) + random_matrix(ZZ, n, n, x=-d, y=d)
        if  hadamard(R) >= 0.7:
            break

    B = R
    while True:
        U = random_matrix(ZZ, n, n, algorithm="unimodular")
        B = U * B
        if hadamard(B) <= 0.2:
            break

    return B, R

def encrypt(B, m):
    assert B.nrows() == len(m)
    return vector(ZZ, m) * B  + random_vector(ZZ, len(m), x=-50, y=50)

B, R = keygen(len(flag), 100)
c = encrypt(B, flag)

print(list(B))
print(c)
