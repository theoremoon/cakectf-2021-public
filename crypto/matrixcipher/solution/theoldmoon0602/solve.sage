import ast

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

B, c = open("./distfiles/output.txt").read().strip().split("\n")
B = Matrix(ZZ, ast.literal_eval(B))
c = vector(ZZ, ast.literal_eval(c))

m = decrypt(B, B.LLL(), c)
print("".join([chr(c) for c in m]))


