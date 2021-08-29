import ast
from Crypto.Util.number import inverse

with open("distfiles/output.txt") as f:
    p, g, cs = map(ast.literal_eval, f.read().strip().split("\n"))

for i in range(len(cs)):
    a, b, c = cs[i], cs[i+1], cs[i+3]
    if a * inverse(b, p) % p == c * inverse(a, p) % p:
        G2 = a * inverse(b, p) % p
        G = pow(G2, 50, p) * inverse(a, p) % p
        break

flag = ''
for c in cs:
    for m in range(0x100):
        if pow(G, m, p) == c:
            flag += chr(m)
            break
    else:
        print("Not Found :thinking:")
        exit(1)

print(flag)
