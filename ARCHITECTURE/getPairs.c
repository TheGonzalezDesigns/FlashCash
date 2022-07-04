#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <time.h>
#include <stdlib.h>
#include <sys/stat.h>

typedef char bSerial[93];
typedef char Serial[317];
typedef char Hash[11];
typedef char Contract[43];
typedef double Rate;
typedef unsigned short Volume;

typedef struct Permutations {
    unsigned long int binary;
    unsigned long int trinary;
    unsigned long int quadratic;
} Permutation;

typedef struct Tokens {
    Contract contract;
    Rate rate;
} Token;

typedef struct BinaryPairs {
    Token A;
    Token B;
    Hash  hash;
} BinaryPair;

typedef struct TriangularPairs {
    BinaryPair A;
    BinaryPair B;
    BinaryPair C;
    Hash       hash;
} TriangularPair;

typedef struct Coordinates {
    int row;
    int slot;
} Coordinates;

typedef struct BidimensionalTriangularPairs {
    TriangularPair ** pairs;
    Coordinates coordinates;
    Permutation permutations;
    Volume      contractVolume;
} BTP;

typedef struct Census {
    Volume      contractVolume;
    Permutation permutations;
    Contract    * contracts;
} Census;

Census          getFileData(const char*);
void            printData(char * filename, char * data);
char            * bSerialize(BinaryPair pair);
char            * serialize(TriangularPair);
char            * hashQuote(BinaryPair);
char            * hashPairs(TriangularPair);
char            * tail(const char *);
char            * export(BTP); 
char            * exportBinaries(BinaryPair *, int); 

bool            sameCoin(Token A, Token B);
bool            samePair(BinaryPair A, BinaryPair B);
bool            pairTrails(BinaryPair A, BinaryPair B);

BinaryPair      binaryPair(Token A, Token B);
void            buildBinaryPairs(Token *, short, BinaryPair *);
void            buildTriangularPairs(BinaryPair *, BTP);

void            genTokens(Contract *, short, Token *);
TriangularPair  getSampleTPair();
int             getTPSampleSize();
Coordinates     getCoordinates(const unsigned int index);
TriangularPair  ** create2DArray(const unsigned int quantity);

int main(int argc, char* argv[])
{
    clock_t t;
    double time_taken;

    printf("Filename:\t%s", argv[1]);

    Census census = getFileData(argv[1]);

    BTP tPairs;
    tPairs.contractVolume = census.contractVolume;
    tPairs.permutations.binary = census.permutations.binary;
    tPairs.permutations.trinary = census.permutations.trinary;
    tPairs.permutations.quadratic = census.permutations.quadratic;

    printf("\nStructuring all tokens from %s.\n\n", argv[1]);
    printf("__________________________________________________________\n");
    
    t = clock();
    tPairs.pairs = create2DArray(tPairs.permutations.trinary);
    
    Token tokens[tPairs.contractVolume];
    genTokens(census.contracts, tPairs.contractVolume, tokens);
    
    BinaryPair * binaries = calloc(tPairs.permutations.binary, sizeof(BinaryPair));

    buildBinaryPairs(tokens, tPairs.contractVolume, binaries);
    buildTriangularPairs(binaries, tPairs);
    t = clock() - t;
    time_taken = ((double)t)/CLOCKS_PER_SEC;
    
    printf("__________________________________________________________\n");
    if (time_taken < 1) printf("\nBuilding all pairs took %f ms to execute.\n", time_taken * 1000);
    else if (time_taken <= 60) printf("\nBuilding all pairs took %f seconds to execute.\n", time_taken);
    else if (time_taken >= 60) printf("\nBuilding all pairs took %f minutes to execute.\n", time_taken/60);
    else if (time_taken >= 60 * 60) printf("\nBuilding all pairs took %f hours to execute.\n", time_taken/60/60);
    printf("\n\n");
    
    unsigned int * _c = calloc(1, sizeof(unsigned int));
    
    // do
    // {
    //     printf("\n-------------------------------------------------------------------------------\n");
    //     printf("\nEnter Element:\t");
    //     scanf("%i", _c);
    //     tPairs.coordinates = getCoordinates(*_c);
    //     printf("_______________________________________________________________________________");
    //     if (*_c < tPairs.permutations.trinary)
    //     {
    //         printf("\n#%i-A:\t%s::%s", *_c, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].A.A.contract, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].A.B.contract);
    //         printf("\n#%i-B:\t%s::%s", *_c, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].B.A.contract, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].B.B.contract);
    //         printf("\n#%i-C:\t%s::%s", *_c, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].C.A.contract, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].C.B.contract);
    //         printf("\n\n#%i-S:\t%s", *_c, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].hash);
    //         printf("\n\n#%i-Z:\t%s", *_c, serialize(tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot]));
    //     }
    //     else
    //     {
    //         printf("\nOut of bounds, keep it below %li.\n", tPairs.permutations.trinary);
    //     }
    // } while(*_c != 666);

    char * _d, * _b;

    _d = export(tPairs);
    _b = exportBinaries(binaries, tPairs.permutations.binary);

    printData(argv[2], _d);
    printData(argv[3], _b);
    //
    free(_b);
    free(_d);
    free(_c);
    free(binaries);
    free(census.contracts);
    free(tPairs.pairs);
    
    printf("\n__________________________________________________________\n");

    return 0;
}

bool sameCoin(Token A, Token B) 
{
    return strcmp(A.contract, B.contract) == 0;
}

bool samePair(BinaryPair A, BinaryPair B) 
{
    return sameCoin(A.A, B.A) || sameCoin(A.B, B.B);
}

bool pairTrails(BinaryPair A, BinaryPair B) 
{
    return sameCoin(A.B, B.A);
}

BinaryPair binaryPair(Token A, Token B)
{
    BinaryPair binary;
    binary.A = A;
    binary.B = B;
    strcpy(binary.hash, hashQuote(binary));
    printf("\nHash:\t%s", binary.hash);
    return binary;
}

void buildTriangularPairs(BinaryPair * binaries, BTP tPairs) 
{
    TriangularPair tri;
    
    unsigned int t = 0;
    unsigned long q = 0;
    const unsigned int quantity = tPairs.permutations.binary;
    
    for (short a = 0; a < quantity; a++) 
    {
        for (short b = 0; b < quantity; b++) 
        {
            if (!samePair(binaries[a], binaries[b]) && pairTrails(binaries[a], binaries[b])) 
            {
                tri.A = binaries[a];
                tri.B = binaries[b];
                for (short c = 0; c < quantity; c++) 
                {
                    if (!(samePair(binaries[a], binaries[c]) || samePair(binaries[b], binaries[c])) && pairTrails(binaries[b], binaries[c]) && pairTrails(binaries[c], binaries[a]))
                    {
                        tri.C = binaries[c];
                        strcpy(tri.hash, hashPairs(tri));
                        tPairs.coordinates = getCoordinates(t++);
                        tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot] = tri;
                    }
                }
            }
        }
    }
}

void buildBinaryPairs(Token * tokens, short quantity, BinaryPair * binaries) 
{
    for (short a = 0, i = 0; a < quantity; a++) 
    {
        for (short b = 0; b < quantity; b++) 
        {
            if (!sameCoin(tokens[a], tokens[b])) 
            {
                binaries[i].A = tokens[a];
                binaries[i].B = tokens[b];
                strcpy(binaries[i].hash, hashQuote(binaries[i]));
                i++;
            }
        }
    }
}

void genTokens(Contract * contracts, short quantity, Token * tokens)
{
    Token token;
    token.rate = 0;
    for (short c = 0; c < quantity; c++)
    {
        strcpy(token.contract, contracts[c]);
        tokens[c] = token;
        printf("Contract #%d:\t%s\n", c+1, tokens[c].contract);
    }
}

TriangularPair getSampleTPair()
{
    Token tToken;
    strcpy(tToken.contract, "0x0000000000000000000000000000000000000000");
    tToken.rate = 42.351442424245;
    BinaryPair tBinaryPair;
    tBinaryPair.A = tToken;
    tBinaryPair.B = tToken;
    TriangularPair tPair;
    tPair.A = tBinaryPair;
    tPair.B = tBinaryPair;
    tPair.C = tBinaryPair;
    
    return tPair;
}

int getTPSampleSize()
{
    
    const TriangularPair tPair = getSampleTPair();
    
    return sizeof(tPair);
}

Coordinates getCoordinates(const unsigned int index)
{
    Coordinates coordinates;
    if(index == 0) 
    {
        coordinates.row = 0;
        coordinates.slot = 0;
    } 
    else
    {
        const int margin = 24355;
        coordinates.row = (index - 1) / margin;
        coordinates.slot = (index - 1) % margin;
    }
    return coordinates;
}

TriangularPair ** create2DArray(const unsigned int quantity) 
{
    TriangularPair ** MDA;
    const int size = getTPSampleSize();
    const int margin = 24355;
    const int row = (quantity - 1) / margin;
    const int slot = (quantity - 1) % margin;
    const int mem = (row + 1) * size;
    const TriangularPair sample = getSampleTPair();
    TriangularPair * temp;
    Coordinates coordinates;
    
    MDA = calloc(margin, sizeof(* MDA));
    temp = calloc(margin * margin, sizeof(MDA[0]));
    
    for (int i = 0; i < margin; i++) 
    {
        MDA[i] = temp + (i * margin);
    }
    for (int o = 0; o < quantity; o++)
    {
        coordinates = getCoordinates(o);
        MDA[coordinates.row][coordinates.slot] = sample;
    }
    return MDA;
}

Census getFileData(const char* filename)
{
    Census _census;
    int quantity, binary, trinary, quadratic;
    char nFlag[] = "%*s";
    char pFlag[] = "%s";
    char * trail;
    char * trans;

    FILE* input_file = fopen(filename, "r");
    if (!input_file)
        exit(EXIT_FAILURE);
    struct stat sb;
    if (stat(filename, &sb) == -1) {
        perror("stat");
        exit(EXIT_FAILURE);
    }

    char* file_contents = malloc(sb.st_size);
    fread(file_contents, sb.st_size, 1, input_file);

    sscanf(file_contents, "%d%d%d%d", &quantity, &binary, &trinary, &quadratic);

    trans = calloc(((4 + quantity) * 3), sizeof(char));
    trail = calloc(((4 + quantity) * 3), sizeof(char));

    Contract contracts[quantity];

    strcpy(trail, "%*d%*d%*d%*d");
    
    for (int i = 0; i < quantity; i++)
    {
        strcpy(trans, trail);
        strcat(trans, pFlag);
        sscanf(file_contents, trans, contracts[i]);
        // printf("\nFlags: %s",  trans);
        // printf("\n#%i-Contract: %s", i + 1, contracts[i]);
        strcpy(trans, "");
        strcat(trail, nFlag);
    }
    free(trail);
    free(trans);
    fclose(input_file);
    free(file_contents);

    _census.contractVolume = quantity;
    _census.permutations.binary = binary;
    _census.permutations.trinary = trinary;
    _census.permutations.quadratic = quadratic;
    _census.contracts = malloc(sizeof(contracts));
    for (int i = 0; i < quantity; i++) 
    {
        strcpy(_census.contracts[i], contracts[i]);
    }

    return _census;
}

void printData(char * filename, char * data)
{
    FILE* output_file = fopen(filename, "w");
    struct stat sb;

    printf("__________________________________________________________\n");
    if (!output_file) {
        printf("\nFailed to update %s \n", filename);
        exit(EXIT_FAILURE);
    }
    if (stat(filename, &sb) == -1) {
        perror("stat");
        exit(EXIT_FAILURE);
    }
    fprintf(output_file, "%s", data);
    printf("\nSuccessfully updated %s \n", filename);

    fclose(output_file);
}

char * serialize(TriangularPair pair)
{
    char * serial = calloc(1, sizeof(Serial));

    strcat(serial, pair.hash);
    strcat(serial, " ");
    strcat(serial, pair.A.hash);
    strcat(serial, " ");
    strcat(serial, pair.A.A.contract);
    strcat(serial, " ");
    strcat(serial, pair.A.B.contract);
    strcat(serial, "\n");
    strcat(serial, pair.B.hash);
    strcat(serial, " ");
    strcat(serial, pair.B.A.contract);
    strcat(serial, " ");
    strcat(serial, pair.B.B.contract);
    strcat(serial, "\n");
    strcat(serial, pair.C.hash);
    strcat(serial, " ");
    strcat(serial, pair.C.A.contract);
    strcat(serial, " ");
    strcat(serial, pair.C.B.contract);
    strcat(serial, "\n");

    // printf("\n%s:\t%s\n", pair.hash, serial);

    return serial;
}

char * bSerialize(BinaryPair pair)
{
    char * serial = calloc(1, sizeof(bSerial));

    strcat(serial, pair.hash);
    strcat(serial, " ");
    strcat(serial, pair.A.contract);
    strcat(serial, " ");
    strcat(serial, pair.B.contract);
    strcat(serial, "\n");

    // printf("\n%s:\t%s\n", pair.hash, serial);

    return serial;
}

char * hashQuote(BinaryPair pair)
{
    char * hash = calloc(7, sizeof(char));
    strcat(hash, tail(pair.A.contract));
    strcat(hash, tail(pair.B.contract));
    return hash;
}

char * hashPairs(TriangularPair pair)
{
    char * hash = calloc(10, sizeof(char));
    strcat(hash, tail(pair.A.A.contract));
    strcat(hash, tail(pair.B.A.contract));
    strcat(hash, tail(pair.C.A.contract));
    return hash;
}

char * tail(const char *str)
{
    char * result = calloc(4, sizeof(char));
    strncpy(result, str + 39, 3);
    return result;
}

char * export(BTP all) 
{
    int q = all.permutations.trinary;
    char * data = calloc(q, sizeof(Serial));

    for (int i = 0; i < q - 1; i++)
    {
        all.coordinates = getCoordinates(i);
        // serialize(all.pairs[all.coordinates.row][all.coordinates.slot]);
        // printf("%i:\t%s", i, serialize(all.pairs[all.coordinates.row][all.coordinates.slot]));
        // printf("%i:\t%s", i, all.pairs[all.coordinates.row][all.coordinates.slot].A.A.contract);
        strcat(data, serialize(all.pairs[all.coordinates.row][all.coordinates.slot]));
    }

    return data;
}
char * exportBinaries(BinaryPair * binaries, int quantity)
{
    char * data = calloc(quantity, sizeof(bSerial));

    for (int i = 0; i < quantity - 1; i++)
    {
        strcat(data, bSerialize(binaries[i]));
    }

    return data;
}