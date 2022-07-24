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
    FILE *input_file = fopen(filename, "r+");
    if (input_file)
    {
        // printf("\nExtracting quote from:\t%s", filename);
        char *data = NULL;
        struct stat sb;
        stat(filename, &sb);
        char *file_contents = calloc(1, sb.st_size + 10);
        fread(file_contents, sb.st_size, 1, input_file);

        if (file_contents[0] == '-')
        {
            fclose(input_file);
            remove(filename);
        }
        else
        {
            data = sanitize(file_contents);
            // printf("\n%s:\t%s", filename, data);
            // clear files
            fseek(input_file, 0, SEEK_SET);
            fprintf(input_file, "%s\n", "-");
            fclose(input_file);
            free(file_contents);
            return data;
        }
    }
    // else
    //     printf("\nALERT:\t The following file is unavailble | %s", filename);
    return NULL;
}

char *extractHash(const char *catalog, int quantity)
{
    // printf("\nExtracting hash #%i", quantity);
    char *hash = calloc(7, sizeof(char));
    strncpy(hash, catalog + (quantity * 7), 6);
    // printf("\nExtracted hash:\t%s", hash);
    return hash;
}

char *reference(char *hash, const char *dir, const int length)
{
    char *ref = calloc(1, (1 + (sizeof(Hash) + (length * sizeof(char)))));
    sprintf(ref, "%s%s", dir, hash);

    return ref;
}

void composeQuotes(const char *catalog, const int quantity, const char *dir, const int length)
{
    char *file = NULL;
    char *filename = "dispatch.json";
    file = calloc(1, ((strlen(dir) + strlen(filename) + 1) * sizeof(char)));
    strcpy(file, dir);
    strcat(file, filename);
    FILE *dispatch = fopen(file, "w");

    if (dispatch)
    {

        if (!quantity)
        {
            printf("\nNo quotes to compose at:\t%s", dir);
            printf("\n__________________________________________________________\n");
            fprintf(dispatch, "%s\n", "[]");
        }
        else
        {
            char *hash = NULL;
            char *ref = NULL;
            char *data = NULL;

            printf("\nComposing %i Quotes to:\t%s\n", quantity, file);
            printf("\n__________________________________________________________\n");
            fprintf(dispatch, "%c\n", '[');

            for (int i = 1; i < quantity; i++)
            {
                hash = extractHash(catalog, i);
                // printf("\nQuerying hash:\t%s", hash);
                ref = reference(hash, dir, length);
                // printf("\nAccessing ref:\t%s", ref);
                data = extractQuote(ref);
                if (data)
                {
                    fprintf(dispatch, "\t%s%s\n", data, (i + 1 < quantity ? "," : ""));
                    // printf("\n%s:\n\t%s\n\n", file, data);
                }
                free(ref);
                free(data);
            }
            fprintf(dispatch, "%c", ']');
        }
        fclose(dispatch);
    }
    else
    {
        // printf("\nALERT:\t The following file is unavailble | %s", file);
        exit(EXIT_FAILURE);
    }
}

int main(int argc, char *argv[])
{
    clock_t t;
    double time_taken;
    t = clock();
    int quantity, tLimit;
    char *catalog = argv[1];
    sscanf(argv[2], "%d", &quantity);
    sscanf(argv[4], "%d", &tLimit);

    quantity += 1;
    if (quantity < tLimit)
        return 0;

    char *dir = argv[3];
    int length = strlen(dir);

    composeQuotes(catalog, quantity, dir, length);

    t = clock() - t;
    time_taken = ((double)t) / CLOCKS_PER_SEC;

    // printf("\n__________________________________________________________\n");
    if (time_taken < 1)
        printf("\nComposing all available quotes took %f ms to execute.\n", time_taken * 1000);
    else if (time_taken <= 60)
        printf("\nComposing all available quotes took %f seconds to execute.\n", time_taken);
    else if (time_taken >= 60)
        printf("\nComposing all available quotes took %f minutes to execute.\n", time_taken / 60);
    else if (time_taken >= 60 * 60)
        printf("\nComposing all available quotes took %f hours to execute.\n", time_taken / 60 / 60);
    printf("\n\n");

    return 0;
}
