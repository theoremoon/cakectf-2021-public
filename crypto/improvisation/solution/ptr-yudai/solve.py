def LFSR(seed):
    r = seed
    while True:
        yield r & 1
        b = (r & 1) ^\
            ((r & 2) >> 1) ^\
            ((r & 8) >> 3) ^\
            ((r & 16) >> 4)
        r = (r >> 1) | (b << 63)

with open("distfiles/output.txt", "r") as f:
    c = int(f.read(), 16)
    c = int(bin(c)[2:][::-1], 2)

cc = c << 1
prefix = int.from_bytes(b'CakeCTF{', 'little')
seed = (cc & ((1<<64)-1)) ^ prefix

lfsr = LFSR(seed)
m = 0
while cc:
    m = (m << 1) | ((cc & 1) ^ next(lfsr))
    cc >>= 1

print(int.to_bytes(int(bin(m)[2:][::-1], 2), 64, 'little').rstrip(b'\x00'))
