from PIL import Image

img = Image.open("./distfiles/chall.png")
w, h = img.size

bits = []
for y in range(h):
    for x in range(w):
        a, b, c = img.getpixel((x, y))
        bits += [a & 1, b & 1, c & 1]

for flen in range(100, 1000):
    bits2 = [1 for i in range(flen)]
    for i, b in enumerate(bits):
        bits2[i % flen] &= b

    if any(b !=0 for b in bits2):
        x = sum(b*(2**i) for i, b in enumerate(bits2))
        print(x.to_bytes((x.bit_length() + 7) // 8, "big"))
