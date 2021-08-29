from PIL import Image
from random import getrandbits

with open("flag.txt", "rb") as f:
    flag = int.from_bytes(f.read().strip(), "big")

bitlen = flag.bit_length()
data = [getrandbits(8)|((flag >> (i % bitlen)) & 1) for i in range(256 * 256 * 3)]

img = Image.new("RGB", (256, 256))

img.putdata([tuple(data[i:i+3]) for i in range(0, len(data), 3)])
img.save("chall.png")
