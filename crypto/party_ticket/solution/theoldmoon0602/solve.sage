import ast

with open("./distfiles/output.txt") as f:
    c1, n1, b1 = ast.literal_eval(f.readline().strip())
    c2, n2, b2 = ast.literal_eval(f.readline().strip())


N = n1 * n2
PR.<x> = PolynomialRing(Zmod(N))

k1 = crt([1, 0], [n1, n2])
k2 = crt([0, 1], [n1, n2])

f1 = x*(x + b1) - c1
f2 = x*(x + b2) - c2

f = k1*f1 + k2*f2
f = f.monic()

d = f.degree()
beta = 1
epsilon = 0.05
X = ceil(0.5 * N^RR(beta^2 / d - epsilon))

for root in f.small_roots(X=X, beta=beta, epsilon=epsilon):
    r = int(root)
    print(r.to_bytes((r.bit_length() + 7) // 8, "big").strip(b"\0"))
