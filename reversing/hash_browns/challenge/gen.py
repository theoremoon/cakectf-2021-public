from hashlib import md5, sha256
from Crypto.Util.number import isPrime

def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    g, y, x = egcd(b%a, a)
    return (g, x - (b//a) * y, y)

flag = "CakeCTF{(^o^)==(-p-)~~(=_=)~~~POTATOOOO~~~(^@^)++(-_-)**(^o-)_486512778b4}"
print(f"[*] flag len: {len(flag)}")
print(f"           p: {len(flag)/2}, {isPrime(len(flag)//2)}")

p = len(flag)//2
ans1 = [""] * p
ans2 = [""] * p
for i in range(p):
    (g, x, y) = egcd(i, p)
    inv = x % p

    ans1[i] = md5(flag[2*i].encode()).hexdigest()[:10]
    ans2[inv] = sha256(flag[2*i+1].encode()).hexdigest()[:10]

print(ans1)
print(ans2)
