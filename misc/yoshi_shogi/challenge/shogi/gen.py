dummy = b"It's not rev. If you want to continue, try harder."
flag  = b"CakeCTF{https://www.nicovideo.jp/watch/sm19221643}"
key = [ord('w'), ord('i'), ord('n')]

delta = []
a0, a1 = 7, 23
for i in range(len(flag)):
    delta.append(
        ((flag[i]-a0-a1)%0x100) ^ key[i%len(key)]
    )
    a0, a1 = a1, flag[i] ^ delta[i]

print(delta)

fakekey = []
a0, a1 = 7, 23
for i in range(len(flag)):
    fakekey.append(
        ((dummy[i]-a0-a1)%0x100) ^ delta[i]
    )
    a0, a1 = a1, dummy[i] ^ delta[i]

print(fakekey)
#key = fakekey

output = ''
a0, a1 = 7, 23
for i in range(len(delta)):
    output += chr(((delta[i] ^ key[i % len(key)]) + a0 + a1) % 0x100)
    a0 = a1
    a1 = ord(output[-1]) ^ delta[i]

print(output)
