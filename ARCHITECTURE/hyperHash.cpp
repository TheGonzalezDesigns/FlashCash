#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
#include <string.h>
#include "flat_hash_map.hpp"
#include <fstream>
#include <cstdio>
#include <stdlib.h>

using namespace std;

typedef string Hash;
typedef string Serial;
typedef string Contract;
typedef double Rate;
typedef unsigned short Volume;

typedef struct Tokens
{
	Contract contract;
	Rate rate;
} Token;

typedef struct BinaryPairs
{
	Token A;
	Token B;
	Hash hash;
} BinaryPair;

typedef vector<BinaryPair> bVector;

typedef struct TriangularPairs
{
	bVector pairs; // to ascess via pairs[i]
	Hash hash;
} TriangularPair;

typedef vector<TriangularPair> tVector;
typedef TriangularPair *tRef;
typedef vector<tRef> tRefs;
typedef ska::flat_hash_map<Hash, TriangularPair> flatTrinaries;

typedef struct Quotes
{
	BinaryPair binary;
	tRefs trinaries;
} Quote;

typedef vector<Quote> qVector;

collectRefinedQuotes(string filename) 
{
	fstream newfile;
	tVector tPairs;
	BinaryPair bPair;
	bVector bPairs;
	TriangularPair tPair;
	string tp;

	cout << "File:\t" << filename << endl;

	newfile.open(filename, ios::in);

	if (newfile.is_open())
	{
		while (getline(newfile, tp, ' '))
		{
			tPair.hash = tp;

			for (int i = 0; i < 3; i++)
			{
				getline(newfile, tp, ' ');
				bPair.hash = tp;
				getline(newfile, tp, ' ');
				bPair.A.contract = tp;
				getline(newfile, tp, '\n');
				bPair.B.contract = tp;
				tPair.pairs.push_back(bPair);
			}
			tPairs.push_back(tPair);
			tPair.pairs.clear();
		}
		cout << "Aww hell yes. Let's get trading!" << endl;
		newfile.close(); // close the file object.
	}
	else
	{
		cout << "Aww hell nah. This file closed then a mothefucker." << endl;
		exit(EXIT_FAILURE);
	}
}

int main(int argc, char *argv[])
{
	string filename = argv[2];
	do {
		collecRefinedQuotes(filename);
	} while (true);
	return 0;
}
