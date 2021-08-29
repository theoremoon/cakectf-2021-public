with open("./distfiles/chall", "rb") as f:
    data = f.read()
    p = data.find(b"FakeCTF")
    data = data[p:p+(127 - 0x20) * 127]

data = b" " * 127 * 0x20 + data
data = [data[i:i+127] for i in range(0, len(data), 127)]

flag = ""
for i in range(59):
    for y in range(127):
        if data[y][i] == y:
            flag += chr(y)
print(flag)
