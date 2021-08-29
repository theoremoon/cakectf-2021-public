#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>

void print_usage(char *progname)
{
  puts("Hardware (I/O port) debugging utility\n");
  printf("Usage: %s mr|mw|ior|iow <size> <offset>\n", progname);
  exit(1);
}

int mem_read(off_t _offset, size_t _size)
{
  fputs("mem_read: Not implemented\n", stderr);
  return -1;
}

int mem_write(off_t offset, size_t size)
{
  char buf[0x1000];
  int fd = open("/dev/mem", O_RDWR|O_SYNC);
  if (fd == -1) {
    perror("/dev/mem");
    return -1;
  }

  lseek(fd, offset, SEEK_SET);
  for (size_t i = 0; i < size; i += 0x1000) {
    ssize_t nb = read(0, buf, 0x1000);
    if (nb <= 0) break;
    write(fd, buf, i + 0x1000 <= size ? nb : size % 0x1000);
  }

  close(fd);
}

int io_read(size_t size) {
  fputs("io_read: Not implemented\n", stderr);
  return -1;
}

int io_write(size_t size) {
  fputs("io_write: Not implemented\n", stderr);
  return -1;
}

int main(int argc, char **argv)
{
  if (argc < 4)
    print_usage(argv[0]);

  size_t size = strtoll(argv[2], NULL, 16);
  off_t offset = strtoll(argv[3], NULL, 16);

  if (strcmp(argv[1], "mr") == 0) {
    /* Memory read for hardware operation */
    return mem_read(offset, size);

  } else if (strcmp(argv[1], "mw") == 0) {
    /* Memory write for hardware operation */
    return mem_write(offset, size);

  } else if (strcmp(argv[1], "ior") == 0) {
    /* Input from hardware I/O port */
    return io_read(size);

  } else if (strcmp(argv[1], "iow") == 0) {
    /* Output to hardware I/O port */
    return io_write(size);

  } else {
    print_usage(argv[0]);
  }
}
