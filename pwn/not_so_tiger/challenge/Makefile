all:
	g++ -Wl,-z,now,-z,relro main.cpp -o ../distfiles/chall -std=c++17 -fstack-protector -no-pie
	cp main.cpp ../distfiles
	cp /lib/x86_64-linux-gnu/libc-2.31.so ../distfiles
