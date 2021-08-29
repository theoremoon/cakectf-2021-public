/**
 * YOU DON'T NEED TO READ THIS SOURCE CODE TO SOLVE THIS CHALLENGE!
 * READ THIS WHEN YOU REALLY WANT TO CHECK SOMETHING FOR SOME REASON.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <signal.h>

const char *PRIV[] = {
  "---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"
};
int get_privilege(void *addr) {
  int priv = 0;
  unsigned long start, end, target;
  char buf[0x100], *ptr;
  int fd = open("/proc/self/maps", O_RDONLY);
  target = (unsigned long)addr;
  for(ptr = buf, start = end = 0; ; ptr++) {
    if (read(fd, ptr, 1) <= 0) {
      break;
    }
    if (*ptr == '-' && start == 0) {
      start = strtol(buf, NULL, 16);
      ptr = buf - 1;
    } else if (*ptr == ' ' && end == 0) {
      end = strtol(buf, NULL, 16);
      ptr = buf - 1;
    } else if (*ptr == '\n') {
      if (start <= target && target < end) {
        priv |= (buf[0] == 'r') << 2;
        priv |= (buf[1] == 'w') << 1;
        priv |= (buf[2] == 'x') << 0;
        break;
      }
      start = end = 0;
      ptr = buf - 1;
    }
  }
  
  close(fd);
  return priv;
}

typedef struct {
  void (*fn_dialogue)(char*);
  char *message;
} COWSAY;

COWSAY *cowsay;
int is_deleted = 0;

void dialogue_cowsay(char *message)
{
  puts(" _______________________ ");
  if (message == NULL) {
    printf("< %-21s >\n", "** NO MESSAGE SET **");
  } else {
    printf("< %-21s >\n", message);
  }
  puts(" -----------------------");
  puts("        \\   ^__^");
  puts("         \\  (oo)\\_______");
  puts("            (__)\\       )\\/\\");
  puts("                ||----w |");
  puts("                ||     ||\n");
}

typedef unsigned long addr;
void describe_heap(void)
{
  addr p = (addr)cowsay - 0x10;
  puts("\n  [ address ]      [ heap data ]      ");
  puts("               +------------------+");
  for (int i = 0; i < 8; i++, p += 8) {
    printf("0x%012lx | %016lx |", p, *(addr*)p);

    if (p == (addr)cowsay) {
      if (cowsay->fn_dialogue == dialogue_cowsay) {
        printf(" <-- fn_dialogue (= valid function pointer)");
      } else if ((addr)cowsay->fn_dialogue == (addr)system) {
        printf(" <-- fn_dialogue (= system)");
      } else if (get_privilege(cowsay->fn_dialogue) & 1) {
        printf(" <-- fn_dialogue (= maybe function pointer)");
      } else {
        printf(" <-- fn_dialogue (= invalid function pointer)");
      }
    } else if (p == (addr)cowsay + 8) {
      if (cowsay->message == NULL) {
        printf(" <-- message (= empty)");
      } else if (get_privilege(cowsay->message) & 4 ) {
        printf(" <-- message (= '%s')", cowsay->message);
      } else {
        printf(" <-- message (= invalid pointer)");
      }
    }

    if (p == (addr)cowsay->message - 8) {
      if (p == (addr)cowsay - 8) {
        puts("\n               +------------------+ cowsay (freed) == cowsay->message");
      } else {
        puts("\n               +------------------+ cowsay->message");
      }
    } else if (p == (addr)cowsay - 8) {
      if (is_deleted) {
        puts("\n               +------------------+ cowsay (freed)");
      } else {
        puts("\n               +------------------+ cowsay");
      }
    } else {
      puts("\n               +------------------+");
    }
  }
}

void sigsegv_handler(int signum) {
  puts("Segmentation fault");
  exit(1);
}

int menu() {
  int choice;
  puts("1. Use cowsay");
  puts("2. Change message");
  puts("3. Delete cowsay (only once!)");
  puts("4. Describe heap");
  printf("> ");
  if (scanf("%d", &choice) != 1) exit(0);
  return choice;
}

int main(void)
{
  setvbuf(stdin, NULL, _IONBF, 0);
  setvbuf(stdout, NULL, _IONBF, 0);
  signal(SIGSEGV, sigsegv_handler);

  puts("Today, let's learn how dangerous Use-after-Free is!");
  puts("You're going to abuse the following structure:\n");
  puts("  typedef struct {");
  puts("    void (*fn_dialogue)(char*);");
  puts("    char *message;");
  puts("  } COWSAY;\n");
  puts("An instance of this structure is allocated on the heap:\n");
  puts("  COWSAY *cowsay = (COWSAY*)malloc(sizeof(COWSAY));\n");
  puts("You can");
  puts(" 1. Call `fn_dialogue` with `message` as its argument:");
  puts("  cowsay->fn_dialog(cowsay->message);\n");
  puts(" 2. Allocate and set `message` (This will never be freed):");
  puts("  cowsay->mesage = malloc(17);\n  scanf(\"%16s\", cowsay->message);\n");
  puts(" 3. Delete cowsay only once:");
  puts("  free(cowsay);\n");
  puts(" 4. See the heap around the cowsay instance\n");
  puts("Last but not least, here is the address of `system` function:");
  printf("  <system> = %p\n\n", system);

  /* Initialize */
  cowsay = (COWSAY*)malloc(sizeof(COWSAY));
  cowsay->fn_dialogue = dialogue_cowsay;
  cowsay->message = NULL;

  while (1) {
    switch(menu()) {

    case 1:
      /* Use cowsay */
      printf("[+] You're trying to call 0x%016lx\n", (addr)cowsay->fn_dialogue);
      cowsay->fn_dialogue(cowsay->message);
      break;

    case 2: {
      /* Change message */
      printf("Message: ");
      cowsay->message = malloc(17);
      if (scanf("%16s", cowsay->message) != 1) exit(0);
      break;
    }

    case 3:
      /* Free cowsay */
      if (is_deleted == 0) {
        free(cowsay);
        is_deleted = 1;
        puts("[+] Cowsay is deleted");
      } else {
        puts("[-] Cowsay is already deleted");
      }
      break;

    case 4:
      /* Show heap */
      describe_heap();
      break;

    default:
      puts("Invalid choice");
      break;
    }
  }
  return 0;
}
