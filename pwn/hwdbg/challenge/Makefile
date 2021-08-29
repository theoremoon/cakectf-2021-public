all: hwdbg

hwdbg: hwdbg.c
	musl-gcc hwdbg.c -o hwdbg -static
	strip --strip-all hwdbg

run:
	cp hwdbg mount/bin/
	chmod 4555 mount/bin/hwdbg
	cd mount; find . -print0 | cpio -o --null --format=newc > ../debugfs.cpio
	./debug.sh
