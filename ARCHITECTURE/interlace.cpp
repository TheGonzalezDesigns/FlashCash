#include <iostream>
#include <string>
#include <vector>
#include <string.h>
#include "flat_hash_map.hpp"
#include <fstream>

using namespace std;

typedef string Contract;
typedef double Rate;

typedef struct Tokens
{
    Contract contract;
    Rate rate;
} Token;

typedef string Hash;
typedef vector<Hash> hVector;

typedef string Head;
typedef string Tail;

typedef struct Hashes
{
    Hash entry;
    Head head;
    Tail tail;
} H;

typedef vector<H> HVector;
typedef ska::flat_hash_map<Hash, H> flatHashes;

typedef struct BinaryPairs
{
    Token A;
    Token B;
    H hash;
} BinaryPair;

typedef vector<BinaryPair> bVector;
typedef ska::flat_hash_map<Hash, BinaryPair> flatBinaries;

string getTail(Hash h)
{
    return h.substr(3);
}

string getHead(Hash h)
{
    return h.substr(0, 3);
}

H getHash(Hash h)
{
    H hash;

    hash.entry = h;
    hash.head = getHead(h);
    hash.tail = getTail(h);

    return hash;
}

flatBinaries flattenBinaries(bVector bPairs)
{
    flatBinaries bFlat;

    for (auto binary : bPairs)
    {
        bFlat.insert({binary.hash.entry, binary});
    }
    return bFlat;
}

HVector getTails(bVector map)
{
    HVector raw, tails;
    Hash t;
    int instances = 0;

    for (auto binary : map)
    {
        raw.push_back(binary.hash);
    }

    for (auto tail : raw)
    {
        // cout << tail << endl;
        for (auto _tail : tails)
        {
            if (_tail.tail == tail.tail)
                instances++;
        }
        if (!instances)
            tails.push_back(tail);
        instances = 0;
    }
    return tails;
}

flatHashes flattenHashes(HVector hashes)
{
    flatHashes hFlat;

    for (auto hash : hashes)
    {
        hFlat.insert({hash.entry, hash});
    }
    return hFlat;
}

bVector getSet(flatBinaries map, Tail tail, short setSize = 3)
{
    bVector set;

    for (auto binary : map)
    {
        if (setSize == 0)
            break;
        if (binary.second.hash.head == tail)
        {

            set.push_back(binary.second);
            setSize--;
        }
    }
    // for (auto item : set)
    // {
    //     cout << item.hash.entry << endl;
    // }
    return set;
}

bVector addSet(bVector map, bVector set)
{
    // cout << "Previous map: ";
    // for (auto binary : map)
    // {
    //     cout << binary.hash.entry << " | ";
    // }
    // cout << endl;

    // cout << "Previous map with new set: ";
    for (auto binary : set)
    {
        map.push_back(binary);
        // cout << binary.hash.entry << " | ";
    }
    // cout << endl;

    return map;
}

flatBinaries removeSet(flatBinaries map, bVector set)
{
    flatBinaries::iterator item;
    // cout << "Removing set: ";
    for (auto binary : set)
    {
        item = map.find(binary.hash.entry);
        if (item != map.end())
        {
            map.erase(item);
            // cout << binary.hash.entry << " | ";
        }
    }
    // cout << endl;

    return map;
}

Tail getSetTail(flatBinaries tails)
{
    H hash;
    Tail tail = "";
    // cout << "Set-tail: ";

    for (auto item : tails)
    {
        tail = item.second.hash.tail;
    }
    // cout << tail;

    // cout << endl;
    return tail;
}

flatHashes removeTail(flatHashes tails, Tail tail)
{
    flatHashes::iterator item;
    // cout << "Removing tails: ";
    for (auto hash : tails)
    {
        if (hash.second.tail == tail)
        {
            item = tails.find(hash.second.entry);
            tails.erase(item);
            // cout << hash.second.entry << " | ";
        }
    }
    // cout << endl;
    return tails;
}

Tail findTail(flatHashes tails, Hash tail)
{
    Tail next = "";

    for (auto t : tails)
    {
        next = t.second.tail;
        if (tail == t.second.tail)
            break;
    }

    if (next == "")
        next = tails.begin()->second.tail;

    return next;
}

bVector interlace(bVector map, const short setSize = 3)
{
    bVector interlaced, set;
    flatHashes tails = flattenHashes(getTails(map));
    flatBinaries _map = flattenBinaries(map), flatSet;
    Tail tail, next;
    // 869 elements
    next = tails.begin()->second.tail;
    for (int i = 0; i < _map.size();)
    {
        tail = next;
        // cout << tail << endl;
        // tails = removeTail(tails, tail); // this shrinks our r
        // // shr
        // tails.shrink_to_fit();
        // cout << "Limit:\t" << tails.size() << endl;
        // cout << "State:\t" << i << endl;

        set = getSet(_map, tail, setSize);
        flatSet = flattenBinaries(set);
        interlaced = addSet(interlaced, set);
        _map = removeSet(_map, set);
        i += flatSet.size();
        tail = getSetTail(flatSet);
        next = findTail(tails, tail); // use output
        // next = tail;
        // cout << "Next tail:\t" << next << endl;
        // cout << "Set tail:\t" << tail << endl;
        // cout << "Newly interlaced: ";
        // for (auto binary : interlaced)
        // {
        //     cout << binary.hash.entry << " | ";
        // }
        // cout << endl;
    };

    return interlaced;
}

void printMap(bVector map, string filename)
{
    fstream newFile;
    newFile.open(filename, ios::out);

    if (newFile.is_open())
    {
        for (auto binary : map)
        {
            newFile << binary.hash.entry
                    << " "
                    << binary.A.contract
                    << " "
                    << binary.B.contract
                    << endl;
        }
        newFile.close();
        cout << "Generated Interlaced Binaries to:\t"
             << filename
             << "\n__________________________________________________________\n"
             << endl;
    }
    else
    {
        cout << "Aww hell nah. This other file closed then a mothefucker." << endl;
        exit(EXIT_FAILURE);
    }
}

int main(int argc, char *argv[])
{ //"pairs.dcsn"
    fstream newfile;
    BinaryPair bPair;
    bVector bPairs;
    string tp;
    bVector interlaced;
    double loss;
    int spread = stoi(argv[3]);

    newfile.open(argv[1], ios::in);

    if (newfile.is_open())
    {
        while (getline(newfile, tp, ' '))
        {
            bPair.hash = getHash(tp);
            getline(newfile, tp, ' ');
            bPair.A.contract = tp;
            getline(newfile, tp, '\n');
            bPair.B.contract = tp;
            bPairs.push_back(bPair);
        }
        cout << "Interlacing Binaries from:\t"
             << argv[1]
             << "\n__________________________________________________________\n"
             << endl;
        newfile.close();
    }
    else
    {
        cout << "Aww hell nah. This other file closed then a mothefucker." << endl;
        exit(EXIT_FAILURE);
    }
    interlaced = interlace(bPairs, spread);

    loss = (static_cast<double>(bPairs.size() - interlaced.size()) / bPairs.size());

    cout << "Lost " << loss << "% of all " << bPairs.size() << " quotes | Retained:\t" << interlaced.size() << endl;

    printMap(interlaced, argv[2]);

    return 0;
}