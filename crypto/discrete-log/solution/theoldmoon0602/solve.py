import ast

with open("distfiles/output.txt") as f:
    p, g, cs = map(ast.literal_eval, f.read().strip().split("\n"))

for flag0 in range(0x20, 0x7f):
    flags = [flag0]
    for i in range(1, len(cs)):
        for flagi in range(0x20, 0x7f):
            u = pow(cs[0], flagi, p)
            v = pow(cs[i], flag0, p)

            if u == v:
                flags.append((flagi))
    if len(flags) == len(cs):
        print(bytes(flags))
