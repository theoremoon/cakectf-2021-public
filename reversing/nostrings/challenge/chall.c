#include <stdio.h>

unsigned char table[][127] = {
#include "table.c"
};

int main() {
    char flag[58];
    printf("flag: ");
    scanf("%58s", flag);

    int x = 1;
    for (int i = 0; i < 58; i++) {
        if (flag[i] >= 0x7f) {
            printf("^o^\n");
            return 1;
        }
        x *= table[flag[i]][i] == flag[i];
    }

    if (x) {
        printf(".O. < i+! +o6 noh\n");
        printf(">v< this is the flag\n");
    } else {
        printf("-_- < flag in the string...\n");
    }
}
