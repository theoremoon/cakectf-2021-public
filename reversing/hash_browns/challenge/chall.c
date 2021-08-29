#include <stdio.h>
#include <string.h>
#include <openssl/md5.h>
#include <openssl/sha.h>

typedef unsigned char BYTE;

int f(int a, int b, int *x, int *y) {
  if (b == 0) {
    *x = 1;
    *y = 0;
    return a;
  }

  int d;
  d = f(b, a%b, y, x);
  *y -= a / b * *x;
  return d;
}

void md5(char* src, BYTE* hash) {
  MD5_CTX ctx;
  MD5_Init(&ctx);
  MD5_Update(&ctx, src, strlen(src));
  MD5_Final(hash, &ctx);
}

void sha256(char* src, BYTE* hash) {
  SHA256_CTX ctx;
  SHA256_Init(&ctx);
  SHA256_Update(&ctx, src, strlen(src));
  SHA256_Final(hash, &ctx);
}

int main(int argc, char**argv) {
  char hash1[][11] = {"0d61f8370c", "8ce4b16b22", "0d61f8370c", "8006189430", "84c4047341", "d956797521", "9371d7a2e3", "43ec3e5dee", "336d5ebc54", "336d5ebc54", "4c761f170e", "84c4047341", "b14a7b8059", "9371d7a2e3", "4c761f170e", "44c29edb10", "b9ece18c95", "b9ece18c95", "f186217753", "f186217753", "4c761f170e", "84c4047341", "518ed29525", "9371d7a2e3", "26b17225b6", "336d5ebc54", "336d5ebc54", "3389dae361", "84c4047341", "d956797521", "9371d7a2e3", "a87ff679a2", "1679091c5a", "c4ca4238a0", "8f14e45fce", "c9f0f895fb", "a87ff679a2"};
  char hash2[][11] = {"ca978112ca", "3f79bb7b43", "7ace431cb6", "d2e2adf717", "74cd9ef9c7", "c4694f2e93", "2c624232cd", "559aead082", "7ace431cb6", "d4735e3a26", "ba5ec51d07", "684888c0eb", "7902699be4", "7ace431cb6", "148de9c5a7", "74cd9ef9c7", "32ebb1abcc", "32ebb1abcc", "3e23e81600", "e632b7095b", "7ace431cb6", "d2e2adf717", "ef2d127de3", "3973e022e9", "c4694f2e93", "021fb596db", "7ace431cb6", "380918b946", "74cd9ef9c7", "a318c24216", "74cd9ef9c7", "380918b946", "74cd9ef9c7", "ba5ec51d07", "380918b946", "c4694f2e93", "d10b36aa74"};
  
  if (argc <= 1) {
    printf("Usage: %s <flag>\n", argv[0]);
    return 0;
  }

  int p = strlen(argv[1])/2;
  if(p != sizeof(hash1)/(sizeof(char) * 11)) {
    printf("Too sweet :(\n");
    return 0;
  }
  
  for(int i=0; i<p; i++) {
    int x, y;
    f(i, p, &x, &y);
    if(x < 0) {
      x += p;
    }

    BYTE h1[MD5_DIGEST_LENGTH], h2[SHA256_DIGEST_LENGTH];
    char c1[] = {argv[1][2*i], '\0'};
    char c2[] = {argv[1][2*i+1], '\0'};

    md5(c1, h1);
    sha256(c2, h2);

    char str1[11], str2[11];
    for(int j=0; j<5; j++) {
      sprintf(&str1[j*2], "%02x", h1[j]);
      sprintf(&str2[j*2], "%02x", h2[j]);
    }

    if(strcmp(hash1[i], str1) != 0) {
      printf("Too spicy :(\n");
      return 0;
    }
    if(strcmp(hash2[x], str2) != 0) {
      printf("Too spicy :(\n");
      return 0;
    }
  }
  printf("Yum! Yum! Yummy!!!! :)\nThe flag is one of the best ingredients.\n");
  return 0;
}
