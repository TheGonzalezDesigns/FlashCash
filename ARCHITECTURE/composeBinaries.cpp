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
typedef string Tail;
typedef string Filename;
typedef string bSerial;

typedef vector<bSerial> bSerials;
typedef vector<Contract> Contracts;

typedef struct Binarys
{
	Contract front;
	Contract back;
	Hash hash;
} Binary;

typedef vector<Binary> Binaries;


Contracts getContracts(Filename input)
{
	fstream tokens;
	Contract contract;
	Contracts contracts;

	tokens.open(input, ios::in);

	if (tokens.is_open())
	{
		while (getline(tokens, contract, '\n'))
		{
			contracts.push_back(contract);

		}
		cout << "Retrieved contracts from:\t" << input << endl;
		tokens.close();
	}
	else
	{
		cout << "Attention: Could not retrieve contracts from:\t" << input << endl;
		exit(EXIT_FAILURE);
	}


	return contracts;
}

Tail getTail(Contract contract)
{
	int end = contract.length() - 1;
	int start = end - 2;
	Tail tail = contract.substr(start, end);

	return tail;
}

Hash getHash(Contract front, Contract back)
{
	Tail fTail = getTail(front);
	Tail bTail = getTail(back);
	Hash hash = fTail + bTail;
	return hash;
}

Binaries compose(Contracts contracts)
{
	Binary binary;
	Binaries binaries;

	for(auto front : contracts)
	{
		for(auto back : contracts)
		{
			if (front != back)
			{
				binary.front = front;
				binary.back = back;
				binary.hash = getHash(front, back);
				binaries.push_back(binary);
			}
		}
	}
	return binaries;
}

bSerial serialize(Binary binary)
{
	bSerial serial = "";
		serial += binary.hash;
		serial += " ";
		serial += binary.front;
		serial += " ";
		serial += binary.back;
		//serial += "\n";

	return serial;
}

bSerials getSerials(Binaries binaries)
{
	bSerials serials;
	bSerial serial;

	for(auto binary : binaries)
	{
		serial = serialize(binary);
		serials.push_back(serial);
	}
	return serials;
}

void print(Filename output, bSerials serials)
{
	fstream file;

	file.open(output, ios::out);

	if (file.is_open())
	{
		for(auto serial : serials)
		{
			file << serial << endl;
		}
		//file << endl;

		cout << "Composed binary serials to:\t" << output << endl;
		file.close();
	}
	else
	{
		cout << "Attention: Could not print binary serials to:\t" << output << endl;
		exit(EXIT_FAILURE);
	}

}

int main(int argc, char *argv[])
{
	Filename input = argv[1];
	Filename output = argv[2];

	bSerials serials = getSerials(compose(getContracts(input)));

	print(output, serials);	

	return 0;
}
