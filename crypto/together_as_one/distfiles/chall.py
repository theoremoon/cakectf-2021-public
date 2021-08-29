from Crypto.Util.number import getStrongPrime, bytes_to_long

p = getStrongPrime(512)
q = getStrongPrime(512)
r = getStrongPrime(512)

n = p*q*r

x = pow(p + q, r, n)
y = pow(p + q*r, r, n)

m = bytes_to_long(open("./flag.txt", "rb").read())
assert m.bit_length() > 512
c = pow(m, 0x10001, n)

print(f"{n = :#x}")
print(f"{c = :#x}")
print(f"{x = :#x}")
print(f"{y = :#x}")
