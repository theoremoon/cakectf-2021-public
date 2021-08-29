#include <stdio.h>
#include <unistd.h>

void main() {
  char arg[10] = {0};
  unsigned long address = 0, value = 0;

  setvbuf(stdin, NULL, _IONBF, 0);
  setvbuf(stdout, NULL, _IONBF, 0);
  printf("<main> = %p\n", main);
  printf("<printf> = %p\n", printf);

  printf("address: ");
  scanf("%p", (void**)&address);
  printf("value: ");
  scanf("%p", (void**)&value);
  printf("data: ");
  scanf("%9s", (char*)&arg);
  *(unsigned long*)address = value;

  puts(arg);
  _exit(0);
}
