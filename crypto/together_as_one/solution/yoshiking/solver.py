from Crypto.Util.number import long_to_bytes, inverse, GCD

exec(open("./distfiles/output.txt").read())

q = GCD(n, x-y)
r = GCD(n//q, y - (x - q))
p = n // (q * r)

assert n == p*q*r

d = inverse(0x10001, (p-1)*(q-1)*(r-1))
print(long_to_bytes(pow(c, d, n)))
