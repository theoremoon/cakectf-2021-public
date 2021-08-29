from Crypto.Util.number import getPrime, isPrime, getRandomRange

def getSafePrime(bits):
    while True:
        p = getPrime(bits - 1)
        q = 2*p + 1
        if isPrime(q):
            return q

with open("flag.txt", "rb") as f:
    flag = f.read().strip()

p = getSafePrime(512)
g = getRandomRange(2, p)
r = getRandomRange(2, p)

cs = []
for m in flag:
    cs.append(pow(g, r*m, p))

print(p)
print(g)
print(cs)

