import random

def LFSR():
    r = random.randrange(1 << 64)
    while True:
        yield r & 1
        b = (r & 1) ^\
            ((r & 2) >> 1) ^\
            ((r & 8) >> 3) ^\
            ((r & 16) >> 4)
        r = (r >> 1) | (b << 63)

if __name__ == '__main__':
    with open("flag.txt", "rb") as f:
        flag = f.read()
        assert flag.startswith(b'CakeCTF{')
        m = int.from_bytes(flag, 'little')

    lfsr = LFSR()
    c = 0
    while m:
        c = (c << 1) | ((m & 1) ^ next(lfsr))
        m >>= 1

    print(hex(c))
