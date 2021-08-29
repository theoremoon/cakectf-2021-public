#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define ROR32(x) (((x) >> 1) | (((x) & 1) << 31))

unsigned int calculate_hash(const unsigned char *s, int len) {
  unsigned int hash = 0x20210828;
  for (int i = 0; i < len; i++) {
    hash = ROR32(hash ^ s[i]);
  }
  return hash;
}

int validate_elf(FILE *fe) {
  unsigned int magic = 0;
  if (fread(&magic, sizeof(unsigned int), 1, fe) != 1)
    return 1;

  if (magic != 0x464c457f)
    return 1;

  return 0;
}

int validate_size(FILE *fe, FILE *fa) {
  int n = 0;
  if (fread(&n, sizeof(int), 1, fa) != 1) {
    puts("[-] ALDRYA file is truncated");
    fclose(fe);
    fclose(fa);
    exit(1);
  }

  fseek(fe, 0, SEEK_END);
  size_t size = ftell(fe);
  fseek(fe, 0, SEEK_SET);

  if (((n-1)*0x100 < size) && (size<=n*0x100)) {
    return n;
  } else {
    return -1;
  }
}

int validate_chunk(FILE *fe, FILE *fa) {
  unsigned int ehash, ahash;
  char *buf = calloc(0x100, 1);

  if (fread(buf, 1, 0x100, fe) <= 0) {
    free(buf);
    return 1;
  }

  if (fread(&ahash, sizeof(int), 1, fa) != 1) {
    puts("[-] ALDRYA file is truncated");
    free(buf);
    fclose(fe);
    fclose(fa);
    exit(1);
  }

  ehash = calculate_hash(buf, 0x100);
  free(buf);
  if (ehash == ahash)
    return 0;
  else
    return 1;
}

int validate(FILE *fe, FILE *fa) {
  if (validate_elf(fe))
    return 1;

  int n_chunks = validate_size(fe, fa);
  if (n_chunks == -1)
    return 1;

  for (int i = 0; i < n_chunks; i++) {
    if (validate_chunk(fe, fa))
      return 1;
  }
  return 0;
}

int main(int argc, char **argv) {
  if (argc < 3) {
    printf("Usage: %s <ELF> <ALDRYA>\n", argv[0]);
    return 1;
  }

  FILE *fe = fopen(argv[1], "rb");
  if (!fe) {
    perror(argv[1]);
    exit(1);
  }
  FILE *fa = fopen(argv[2], "rb");
  if (!fa) {
    perror(argv[2]);
    fclose(fe);
    exit(1);
  }

  if (validate(fe, fa)) {
    puts("[-] ELF file is not genuine");
    fclose(fe);
    fclose(fa);
    exit(1);
  } else {
    fclose(fe);
    fclose(fa);
    char *args[] = {argv[1], NULL};
    execv(argv[1], args);
  }

  return 0;
}
