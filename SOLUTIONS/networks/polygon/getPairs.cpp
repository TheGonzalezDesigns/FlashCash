/******************************************************************************

                            Online C Compiler.
                Code, Compile, Run and Debug C program online.
Write your code in this editor and press "Run" button to compile and execute it.

*******************************************************************************/

#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <time.h>
#include <stdlib.h>

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
} BinaryPair;

typedef struct TriangularPairs {
    BinaryPair A;
    BinaryPair B;
    BinaryPair C;
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
TriangularPair ** create2DArray(const unsigned int quantity);

int main()
{
    clock_t t;
    double time_taken; // in seconds
    BTP tPairs;
    tPairs.contractVolume = 121;
    tPairs.permutations.binary = 14520;
    tPairs.permutations.trinary = 1727880;
    tPairs.permutations.quadratic = 203889840;
    tPairs.pairs = create2DArray(tPairs.permutations.trinary);
    
    Contract contracts[121] = {
        "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        "0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7",
        "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
        "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
        "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89",
        "0x2e1ad108ff1d8c782fcbbb89aad783ac49586756",
        "0x430ef9263e76dae63c84292c3409d61c598e9682",
        "0x980111ae1b84e50222c8843e3a7a038f36fecd2b",
        "0xeeeeeb57642040be42185f49c52f7e9b38f8eeee",
        "0x7075cab6bcca06613e2d071bd918d1a0241379e2",
        "0xde5ed76e7c05ec5e4572cfc88d1acea165109e44",
        "0xb25e20de2f2ebb4cffd4d16a55c7b395e8a94762",
        "0x2727ab1c2d22170abc9b595177b2d5c6e1ab7b7b",
        "0xfbdd194376de19a88118e84e279b977f165d01b8",
        "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
        "0xa7051c5a22d963b81d71c2ba64d46a877fbc1821",
        "0xf915fdda4c882731c0456a4214548cd13a822886",
        "0xa1428174f516f527fafdd146b883bb4428682737",
        "0xbe5cf150e1ff59ca7f2499eaa13bfc40aae70e78",
        "0x9c2c5fd7b07e95ee044ddeba0e97a665f142394f",
        "0x42d61d766b85431666b39b89c43011f24451bff6",
        "0x71b821aa52a49f32eed535fca6eb5aa130085978",
        "0x30ea765d4dda26e0f89e1b23a7c7b2526b7d29ec",
        "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
        "0x580a84c73811e1839f75d86d75d88cca0c241ff4",
        "0x8a953cfe442c5e8855cc6c61b1293fa648bae472",
        "0xc3cffdaf8f3fdf07da6d5e3a89b8723d5e385ff8",
        "0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c",
        "0x839f1a22a59eaaf26c85958712ab32f80fea23d9",
        "0xce6bf09e5c7a3e65b84f88dcc6475c88d38ba5ef",
        "0x1a3acf6d19267e2d3e7f898f42803e90c9219062",
        "0x1c954e8fe737f99f68fa1ccda3e51ebdb291948c",
        "0x50b728d8d964fd00c2d0aad81718b71311fef68a",
        "0xda537104d6a5edd53c6fbba9a898708e465260b6",
        "0xeee3371b89fc43ea970e908536fcddd975135d8a",
        "0xf6f85b3f9fd581c2ee717c404f7684486f057f95",
        "0xaecebfcf604ad245eaf0d5bd68459c3a7a6399c2",
        "0x431cd3c9ac9fc73644bf68bf5691f4b83f9e104f",
        "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
        "0x831753dd7087cac61ab5644b308642cc1c33dc13",
        "0x31042a4e66eda0d12143ffc8cc1552d611da4cba",
        "0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4",
        "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
        "0x3c1bb39bb696b443a1d80bb2b3a3d950ba9dee87",
        "0xd55fce7cdab84d84f2ef3f99816d765a2a94a509",
        "0xd3b71117e6c1558c1553305b44988cd944e97300",
        "0x25788a1a171ec66da6502f9975a15b609ff54cf6",
        "0x65a05db8322701724c197af82c9cae41195b0aa8",
        "0xdf7837de1f2fa4631d716cf2502f8b230f1dcc32",
        "0xe6fc6c7cb6d2c31b359a49a33ef08ab87f4de7ce",
        "0xe7804d91dfcde7f776c90043e03eaa6df87e6395",
        "0xcd7361ac3307d1c5a46b63086a90742ff44c63b3",
        "0x6ddb31002abc64e1479fc439692f7ea061e78165",
        "0xf4c83080e80ae530d6f8180572cbbf1ac9d5d435",
        "0x8eef5a82e6aa222a60f009ac18c24ee12dbf4b41",
        "0xc6c855ad634dcdad23e64da71ba85b8c51e5ad7c",
        "0x8d520c8e66091cfd6743fe37fbe3a09505616c4b",
        "0x4e1581f01046efdd7a1a2cdb0f82cdd7f71f2e59",
        "0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97",
        "0xf501dd45a1198c2e1b5aef5314a68b9006d842e0",
        "0xe4bf2864ebec7b7fdf6eeca9bacae7cdfdaffe78",
        "0x361a5a4993493ce00f61c32d4ecca5512b82ce90",
        "0x7fbc10850cae055b27039af31bd258430e714c62",
        "0x840195888db4d6a99ed9f73fcd3b225bb3cb1a79",
        "0x60bb3d364b765c497c8ce50ae0ae3f0882c5bd05",
        "0x2bc07124d8dac638e290f401046ad584546bc47b",
        "0xc10358f062663448a3489fc258139944534592ac",
        "0xef938b6da8576a896f6e0321ef80996f4890f9c4",
        "0x598e49f01befeb1753737934a5b11fea9119c796",
        "0x0d6ae2a429df13e44a07cd2969e085e4833f64a0",
        "0x72d6066f486bd0052eefb9114b66ae40e0a6031a",
        "0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4",
        "0x46f48fbdedaa6f5500993bede9539ef85f4bee8e",
        "0xd99bafe5031cc8b345cb2e8c80135991f12d7130",
        "0xc3ec80343d2bae2f8e680fdadde7c17e71e114ea",
        "0x55555555a687343c6ce28c8e1f6641dc71659fad",
        "0x6911f552842236bd9e8ea8ddbb3fb414e2c5fa9d",
        "0x521cddc0cba84f14c69c1e99249f781aa73ee0bc",
        "0xdb725f82818de83e99f1dac22a9b5b51d3d04dd4",
        "0xe8377a076adabb3f9838afb77bee96eac101ffb1",
        "0x2ab4f9ac80f33071211729e45cfc346c1f8446d5",
        "0x2c89bbc92bd86f8075d1decc58c7f4e0107f286b",
        "0xcaf5191fc480f43e4df80106c7695eca56e48b18",
        "0xfe712251173a2cd5f5be2b46bb528328ea3565e1",
        "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f",
        "0xd0660cd418a64a1d44e9214ad8e459324d8157f1",
        "0xc250e9987a032acac293d838726c511e6e1c029d",
        "0xc91c06db0f7bffba61e2a5645cc15686f0a8c828",
        "0x071ac29d569a47ebffb9e57517f855cb577dcc4c",
        "0xa2ca40dbe72028d3ac78b5250a8cb8c404e7fb8c",
        "0x596ebe76e2db4470966ea395b0d063ac6197a8c5",
        "0xe1c42be9699ff4e11674819c1885d43bd92e9d15",
        "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
        "0x5d47baba0d66083c52009271faf3f50dcc01023c",
        "0x1ce4a2c355f0dcc24e32a9af19f1836d6f4f98ae",
        "0x8346ab8d5ea7a9db0209aed2d1806afa0e2c4c21",
        "0x614389eaae0a6821dc49062d56bda3d9d45fa2ff",
        "0x1379e8886a944d2d9d440b3d88df536aea08d9f3",
        "0x7f67639ffc8c93dd558d452b8920b28815638c44",
        "0x613a489785c95afeb3b404cc41565ccff107b6e0",
        "0xe26cda27c13f4f87cffc2f437c5900b27ebb5bbb",
        "0xcf32822ff397ef82425153a9dcb726e5ff61dca7",
        "0xa3c322ad15218fbfaed26ba7f616249f7705d945",
        "0xa0e390e9cea0d0e8cd40048ced9fa9ea10d71639",
        "0x255707b70bf90aa112006e1b07b9aea6de021424",
        "0x2ce13e4199443fdfff531abb30c9b6594446bbc7",
        "0x04429fbb948bbd09327763214b45e505a5293346",
        "0x1631244689ec1fecbdd22fb5916e920dfc9b8d30",
        "0x6e65ae5572df196fae40be2545ebc2a9a24eace9",
        "0xf480f38c366daac4305dc484b2ad7a496ff00cea",
        "0xe82808eaa78339b06a691fd92e1be79671cad8d3",
        "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
        "0x8f006d1e1d9dc6c98996f50a4c810f17a47fbf19",
        "0x2f800db0fdb5223b3c3f354886d907a671414a7f",
        "0x4e78011ce80ee02d2c3e649fb657e45898257815",
        "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590",
        "0xe79feaaa457ad7899357e8e2065a3267ac9ee601",
        "0xa3fa99a148fa48d14ed51d610c367c61876997f1",
        "0x00e5646f60ac6fb446f621d146b6e1886f002905",
        "0x236eec6359fb44cce8f97e99387aa7f8cd5cde1f"
        
    };
    Token tokens[tPairs.contractVolume];
    genTokens(contracts, tPairs.contractVolume, tokens);
    
    BinaryPair * binaries = calloc(tPairs.permutations.binary, sizeof(BinaryPair));
    
    t = clock();
    buildBinaryPairs(tokens, tPairs.contractVolume, binaries);
    buildTriangularPairs(binaries, tPairs);
    t = clock() - t;
    time_taken = ((double)t)/CLOCKS_PER_SEC;
 
    printf("\nfun() took %f seconds to execute \n", time_taken);
    
    unsigned int * _c = calloc(1, sizeof(unsigned int));
    
    do
    {
        printf("\nEnter Element:\t");
        scanf("%i", _c);
        tPairs.coordinates = getCoordinates(*_c);
        printf("\n-------------------------------------------------------------------------------");
        printf("\n#%i-A:\t%s::%s", t, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].A.A.contract, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].A.B.contract);
        printf("\n#%i-B:\t%s::%s", t, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].B.A.contract, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].B.B.contract);
        printf("\n#%i-C:\t%s::%s", t, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].C.A.contract, tPairs.pairs[tPairs.coordinates.row][tPairs.coordinates.slot].C.B.contract);
    } while(*_c != 666);
    
    free(_c);
    
    // printf("\nTRI:\t%s::%s", tri.B.A.contract, tri.B.B.contract);
    // printf("\nTRI:\t%s::%s", tri.C.A.contract, tri.C.B.contract);
    
    free(tokens);
    free(binaries);
    free(tPairs.pairs);

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
                binaries[i++].B = tokens[b];
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

TriangularPair getSampleTPair() {
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

int getTPSampleSize() {
    
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

// Coordinates getGeneralCoordinates(const unsigned int index, const unsigned int margin) 
// {
//     Coordinates coordinates;
//     if(index == 0) 
//     {
//         coordinates.row = 0;
//         coordinates.slot = 0;
//     } 
//     else
//     {
//         coordinates.row = (index - 1) / margin;
//         coordinates.slot = (index - 1) % margin;
//     }
//     return coordinates;
// }

TriangularPair ** create2DArray(const unsigned int quantity) {
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