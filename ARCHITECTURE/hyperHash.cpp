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

typedef struct Tokens {
    Contract	contract;
    Rate		rate;
} Token;

typedef struct BinaryPairs {
    Token	A;
    Token	B;
	Hash	hash;
} BinaryPair;

typedef vector<BinaryPair> bVector;

typedef struct TriangularPairs {
    bVector	pairs; //to ascess via pairs[i]
    Hash    hash;
} TriangularPair;

typedef vector<TriangularPair> tVector;
typedef TriangularPair * tRef;
typedef vector<tRef> tRefs;
typedef ska::flat_hash_map<Hash, TriangularPair> flatTrinaries;

typedef struct Quotes {
	BinaryPair	binary;
	tRefs		trinaries;
} Quote;

typedef vector<Quote> qVector;

// start getting prices and stream them into the program

int main(int argc, char* argv[]) {//"pairs.dcsn"
	fstream newfile;
	tVector tPairs;
	BinaryPair bPair;
	bVector bPairs;
	TriangularPair tPair;
	string tp;
	
	cout << "File:\t" << argv[1] << endl; 

	newfile.open(argv[1], ios::in);

   if (newfile.is_open())
   { 
      while(getline(newfile, tp, ' '))
	  { 
		tPair.hash = tp;

		for(int i = 0; i < 3; i++) {
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
      newfile.close();   //close the file object.
   } else {
		cout << "Aww hell nah. This file closed then a mothefucker." << endl;
		exit(EXIT_FAILURE);
   }

	cout << "\nFile:\t" << argv[2] << endl; 

	newfile.open(argv[2], ios::in);

   if (newfile.is_open())
   { 
      while(getline(newfile, tp, ' '))
	  { 
		bPair.hash = tp;
		getline(newfile, tp, ' ');
		bPair.A.contract = tp;
		getline(newfile, tp, '\n');
		bPair.B.contract = tp;
		bPairs.push_back(bPair);
      }
	  cout << "\nAww hell yes. Let's get it!!" << endl;
      newfile.close();   //close the file object.
   } else {
		cout << "Aww hell nah. This other file closed then a mothefucker." << endl;
		exit(EXIT_FAILURE);
   }

	flatTrinaries tDeath;

	for(auto t : tPairs)
	{
		tDeath.insert({t.hash, t});
	}

	qVector warDogs;
	Quote	proMoney; //Listen I got bored at this point, 200k in two days tho, thats where we need to be
	tRefs	references;

	for(auto binary : bPairs)
	{
		proMoney.binary = binary;
		for(auto _t : tDeath)
		{
			for(int i = 0; i < 3; i++)
			{
				if(_t.second.pairs[i].hash == binary.hash)
				{
					// cout << "Found matching hash:\t" << _t.second.hash << " | " << _t.second.pairs[i].hash << " == " << binary.hash << " | B-" << i + 1 << endl; 
					ajak.push_back(&_t.second);
				}
			}
		}
		proMoney.trinaries = ajak;
		ajak.clear();
		warDogs.push_back(proMoney);
	}

	Quote * it = &(warDogs[0]);
	cout << "Hash:\t" << it->binary.hash << " | " << it->trinaries[0]->hash << endl; 

	

	return 0;
}