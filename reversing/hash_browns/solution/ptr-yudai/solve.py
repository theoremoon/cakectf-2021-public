import hashlib

with open("./distfiles/hash_browns", "rb") as f:
    f.seek(0x20a0)
    md5List = []
    for i in range(31):
        md5List.append(f.read(11).rstrip(b'\x00').decode())
    f.seek(0x2200)
    sha256List = []
    for i in range(31):
        sha256List.append(f.read(11).rstrip(b'\x00').decode())

def f(i, n):
    if n > 0:
        t, r = f(n, i % n)
        t -= i // n * r
        return r, t
    else:
        return 1, 0

flag = ''
for i in range(31):
    j = f(i, 31)[0]
    if j < 0: j += 31
    for c in range(0x100):
        if hashlib.md5(bytes([c])).hexdigest()[:10] == md5List[i]:
            break
    else:
        print("[-] Not found")
        exit(1)
    flag += chr(c)
    for c in range(0x100):
        if hashlib.sha256(bytes([c])).hexdigest()[:10] == sha256List[j]:
            break
    else:
        print("[-] Not found")
        exit(1)
    flag += chr(c)

print(flag)
