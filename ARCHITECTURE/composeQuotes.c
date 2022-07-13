#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <time.h>
#include <stdlib.h>
#include <sys/stat.h>

typedef char Hash[7];
typedef Hash *Files;
typedef char nFlag[4];
typedef char pFlag[3];

char *sanitize(char *data)
{
    int len = strlen(data);
    int _len = len - 1;
    int x;
    char *sanitized = NULL;
    for (int i = 0; i < _len; i++)
    {
        x = _len - i;
        if (data[x] == '}')
        {
            _len = i;
            len -= i;
            sanitized = calloc(x + 2, sizeof(char));
            strncpy(sanitized, data, x + 1);
        }
    }

    // printf("<Start>%s</End>", sanitized);
    return sanitized;
}
char *extractQuote(const char *filename)
{
    FILE *input_file = fopen(filename, "r");
    char *data = NULL;
    struct stat sb;
    stat(filename, &sb);
    char *file_contents = calloc(1, sb.st_size);
    fread(file_contents, sb.st_size, 1, input_file);
    data = sanitize(file_contents);
    // printf("\n%s:\t%s", filename, data);

    fclose(input_file);
    free(file_contents);
    return data;
}

char *extractHash(const char *catalog, int quantity)
{
    char *hash = calloc(1, sizeof(Hash));
    strncpy(&hash, catalog + (quantity * 7), 6);
    return hash;
}

char *reference(char *hash, const char *dir, const int length)
{
    char *ref = calloc(1, (1 + (sizeof(Hash) + (length * sizeof(char)))));
    sprintf(ref, "%s%s", dir, &hash);

    return ref;
}

void composeQuotes(const char *catalog, const int quantity, const char *dir, const int length)
{
    FILE *dispatch = fopen("dispatch.json", "w");

    char *hash = NULL;
    char *ref = NULL;
    char *data = NULL;

    fprintf(dispatch, "%c", '[');
    for (int i = 1; i < quantity; i++)
    {
        hash = extractHash(catalog, i);
        ref = reference(hash, dir, length);
        data = extractQuote(ref);
        if (data)
            fprintf(dispatch, "%s%c\n", data, (i + 1 < quantity ? ',' : ']'));
        free(ref);
        free(data);
    }

    fclose(dispatch);
}

int main(int argc, char *argv[])
{
    clock_t t;
    double time_taken;
    t = clock();

    int quantity;
    char *catalog = argv[1];
    sscanf(argv[2], "%d", &quantity);
    char *dir = argv[3];
    int length = strlen(dir);

    composeQuotes(catalog, quantity, dir, length);

    t = clock() - t;
    time_taken = ((double)t) / CLOCKS_PER_SEC;

    printf("\n__________________________________________________________\n");
    if (time_taken < 1)
        printf("\nBuilding all pairs took %f ms to execute.\n", time_taken * 1000);
    else if (time_taken <= 60)
        printf("\nBuilding all pairs took %f seconds to execute.\n", time_taken);
    else if (time_taken >= 60)
        printf("\nBuilding all pairs took %f minutes to execute.\n", time_taken / 60);
    else if (time_taken >= 60 * 60)
        printf("\nBuilding all pairs took %f hours to execute.\n", time_taken / 60 / 60);
    printf("\n\n");

    // node./ filterQuotes.js "$dispatch" in system()
    return 0;
}
