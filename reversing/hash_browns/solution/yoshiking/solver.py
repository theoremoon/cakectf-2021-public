from hashlib import sha256, md5

def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    g, y, x = egcd(b%a, a)
    return (g, x - (b//a) * y, y)

# data1 = ['0d61f8370c', '8ce4b16b22', '0d61f8370c', '8006189430', '84c4047341', 'd956797521', '9371d7a2e3', '43ec3e5dee', '336d5ebc54', '336d5ebc54', '4c761f170e', '84c4047341', 'b14a7b8059', '9371d7a2e3', '4c761f170e', '44c29edb10', 'b9ece18c95', 'b9ece18c95', 'f186217753', 'f186217753', '4c761f170e', '84c4047341', '518ed29525', '9371d7a2e3', '26b17225b6', '336d5ebc54', '336d5ebc54', '3389dae361', '84c4047341', 'd956797521', '9371d7a2e3']
# data2 = ['ca978112ca', '3f79bb7b43', '559aead082', '74cd9ef9c7', '148de9c5a7', 'd2e2adf717', 'ba5ec51d07', 'ba5ec51d07', '74cd9ef9c7', '32ebb1abcc', '74cd9ef9c7', 'c4694f2e93', '7ace431cb6', '380918b946', '7ace431cb6', '3973e022e9', 'e632b7095b', '380918b946', '7ace431cb6', 'c4694f2e93', '7ace431cb6', '021fb596db', '32ebb1abcc', '684888c0eb', '74cd9ef9c7', '74cd9ef9c7', '380918b946', 'a318c24216', '7ace431cb6', 'c4694f2e93', 'd10b36aa74']
data1 = ['0d61f8370c', '8ce4b16b22', '0d61f8370c', '8006189430', '84c4047341', 'd956797521', '9371d7a2e3', '43ec3e5dee', '336d5ebc54', '336d5ebc54', '4c761f170e', '84c4047341', 'b14a7b8059', '9371d7a2e3', '4c761f170e', '44c29edb10', 'b9ece18c95', 'b9ece18c95', 'f186217753', 'f186217753', '4c761f170e', '84c4047341', '518ed29525', '9371d7a2e3', '26b17225b6', '336d5ebc54', '336d5ebc54', '3389dae361', '84c4047341', 'd956797521', '9371d7a2e3', 'a87ff679a2', '1679091c5a', 'c4ca4238a0', '8f14e45fce', 'c9f0f895fb', 'a87ff679a2']
data2 = ['ca978112ca', '3f79bb7b43', '7ace431cb6', 'd2e2adf717', '74cd9ef9c7', 'c4694f2e93', '2c624232cd', '559aead082', '7ace431cb6', 'd4735e3a26', 'ba5ec51d07', '684888c0eb', '7902699be4', '7ace431cb6', '148de9c5a7', '74cd9ef9c7', '32ebb1abcc', '32ebb1abcc', '3e23e81600', 'e632b7095b', '7ace431cb6', 'd2e2adf717', 'ef2d127de3', '3973e022e9', 'c4694f2e93', '021fb596db', '7ace431cb6', '380918b946', '74cd9ef9c7', 'a318c24216', '74cd9ef9c7', '380918b946', '74cd9ef9c7', 'ba5ec51d07', '380918b946', 'c4694f2e93', 'd10b36aa74']


flag = b""
for i in range(len(data1)):
    tmp = [b"", b""]
    g, x, y = egcd(i, len(data1))
    for c in range(256):
        h1 = md5(bytes([c])).hexdigest()[:10]
        h2 = sha256(bytes([c])).hexdigest()[:10]
        if h1 == data1[i]:
            tmp[0] = bytes([c])
        if h2 == data2[x]:
            tmp[1] = bytes([c])
    flag += b"".join(tmp)
print(flag)
