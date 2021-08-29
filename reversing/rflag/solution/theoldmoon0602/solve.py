from ptrlib import Process, Socket
import os

query1 = '[8-f]'
query2 = '[4-7]|[c-f]'
query3 = '[2-3]|[6-7]|[a-b]|[e-f]'
query4 = '1|3|5|7|9|b|d|f'

xs = [0 for _ in range(32)]


HOST = os.getenv('HOST', '0.0.0.0')
PORT = os.getenv('PORT', '10023')
sock = Socket(HOST, int(PORT))
# sock = Process(["./rflag"])

sock.sendlineafter("4: ", query1)
line = sock.recvlineafter("Response: ")
ps = eval(line.decode().strip())
for p in ps:
    xs[p] |= 0b1000

sock.sendlineafter("4: ", query2)
line = sock.recvlineafter("Response: ")
ps = eval(line.decode().strip())
for p in ps:
    xs[p] |= 0b0100

sock.sendlineafter("4: ", query3)
line = sock.recvlineafter("Response: ")
ps = eval(line.decode().strip())
for p in ps:
    xs[p] |= 0b0010

sock.sendlineafter("4: ", query4)
line = sock.recvlineafter("Response: ")
ps = eval(line.decode().strip())
for p in ps:
    xs[p] |= 0b0001

h = "".join([hex(x)[2:] for x in xs])
sock.sendlineafter("answer?", h)

print(sock.recvuntil("}"))
