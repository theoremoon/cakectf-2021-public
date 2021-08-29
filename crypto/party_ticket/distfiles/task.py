from Crypto.Util.number import getPrime, isPrime
from hashlib import sha512
import random

def getSafePrime(bits):
    while True:
        p = getPrime(bits - 1)
        q = 2*p + 1
        if isPrime(q):
            return q

def make_inivitation():
    with open("flag.txt", "rb") as f:
        flag = f.read().strip()
        m = int.from_bytes(flag + sha512(flag).digest(), "big")

    p = getSafePrime(512)
    q = getSafePrime(512)

    n = p * q
    assert m < n

    b = random.randint(2, n-1)

    c = m*(m + b) % n

    return c, n, b

# print("Dear Moe:")
print(make_inivitation())

# print("Dear Lulu:")
print(make_inivitation())
