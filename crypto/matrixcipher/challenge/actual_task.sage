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

        m = random_vector(ZZ, n, x=0, y=255)
        c = encrypt(B, m)
        m_ = decrypt(B, R, c)
        if m == m_:
            break

    return B, R

def encrypt(B, m):
    assert B.nrows() == len(m)
    return vector(ZZ, m) * B  + random_vector(ZZ, len(m), x=-50, y=50)

def babai_rounding(w, basis):
    b_, _ = basis.gram_schmidt()
    b = w
    for i in range(len(b))[::-1]:
        c = round(b_[i].dot_product(b) / (b_[i].norm() ** 2))
        b = b - c * basis[i]

    return w - b

def decrypt(B, R, c):
    mB = babai_rounding(c, R)
    return mB * B.inverse()

B, R = keygen(len(flag), 100)
c = encrypt(B, flag)

B2 = B.LLL()
assert flag == list(decrypt(B, B2, c))
print(list(B))
print(c)
