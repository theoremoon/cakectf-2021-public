import sys
import struct

def ror32(v):
    return (v >> 1) | ((v & 1) << 31)

def gen_hash(s):
    h = 0x20210828
    for c in s:
        h = ror32(h ^ c)
    return h

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <ELF>")
        exit(1)

    hashlist = []
    with open(sys.argv[1], "rb") as f:
        proc = True
        while proc:
            chunk = f.read(0x100)
            if len(chunk) == 0:
                break
            elif len(chunk) != 0x100:
                chunk += b'\x00' * (0x100 - len(chunk))
                proc = False

            hashlist.append(gen_hash(chunk))

    sign = struct.pack('<I', len(hashlist))
    for h in hashlist:
        sign += struct.pack('<I', h)

    with open(sys.argv[1] + ".aldrya", "wb") as f:
        f.write(sign)
