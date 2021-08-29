flag = "CakeCTF{th3_b357_p14c3_70_hid3_4_f14g_i5_in_4_f14g_f0r357}"

l = len(flag)
strs = [list("x" * l if 0x20 <= i < 0x7f else " " * l) for i in range(256)]
for i in range(l):
    p = ord(flag[i])
    strs[p][i] = flag[i]

for i in range(256):
    strs[i] = '"' + "".join(strs[i]) + '",'
    if 0x20 <= i < 0x7f:
        strs[i] += " // " + chr(i)
    strs[i] += "\n"

print("".join(strs))
