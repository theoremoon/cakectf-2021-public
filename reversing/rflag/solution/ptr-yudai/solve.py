from ptrlib import *
import os

HOST = os.getenv('HOST', '0.0.0.0')
PORT = os.getenv('PORT', '10023')

sock = Socket(HOST, int(PORT))

guess = [(0, 16) for i in range(32)]

# noushi algorithm
rlist = [
    "[0-7]", "[012389ab]", "[014589cd]", "[02468ace]"
]
m = 16
for rnd in range(4):
    sock.sendlineafter(": ", rlist[rnd])
    response = eval(sock.recvlineafter(": "))
    for i in range(32):
        if guess[i][0] % m == 0:
            if i in response:
                guess[i] = (guess[i][0], guess[i][0] + m//2)
            else:
                guess[i] = (guess[i][0] + m//2, guess[i][0] + m)
        else:
            if i in response:
                guess[i] = (guess[i][1], guess[i][1] + m//2)
            else:
                guess[i] = (guess[i][1] + m//2, guess[i][1] + m)
    m //= 2

answer = ''
for i in range(32):
    answer += f'{guess[i][0]:x}'

sock.sendlineafter("\n", answer)
sock.recvline()
print(sock.recvline())

sock.close()
