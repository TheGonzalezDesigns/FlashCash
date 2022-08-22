#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <stdlib.h>
#include <time.h>

using namespace std;

typedef string Hash;
typedef long   Block;
typedef string Serial;
typedef string Filename;
typedef string Head;
typedef string Tail;

typedef struct _quotes
{
	Hash hash;
	Block block;
} Quote;

typedef vector<Serial> Serials;
typedef vector<Quote> Quotes;
typedef vector<Quotes> Route;
typedef vector<Route> Routes;

Quote parse(Serial serial)
{
	Quote quote;

	size_t found = serial.find_first_of(" ");
	size_t end = serial.length() - 1;
	string hash = serial.substr(0, found);
	string block = serial.substr(found + 1, end);
	end = block.find_first_of(" ");
	block = block.substr(0, end);

	quote.hash = hash;
	quote.block = stol(block);
	
	return quote;
}

Quotes getQuotes(Filename input)
{
	fstream load;

	Quotes quotes;
	Serial serial;

	load.open(input, ios::in);

	if (load.is_open())
	{
		while (getline(load, serial, '\n'))
		{
			quotes.push_back(parse(serial));

		}
		cout << "Loaded refined serials from:\t" << input << endl;
		load.close();
	}
	else
	{
		cout << "Attention: Could not load refined serials from:\t" << input << endl;
		exit(EXIT_FAILURE);
	}


	return quotes;
}

Quotes sift(Quotes quotes, uint tLimit) 
{
	Quotes sifted;

	sort(quotes.begin(), quotes.end(), [](const auto& lhs, const auto& rhs)
	{
		return lhs.block > rhs.block;
	});

	Block newest = quotes[0].block;
	unsigned long int limit = newest - tLimit;

	for (auto quote : quotes) if (limit <= quote.block) sifted.push_back(quote);
	
	return sifted;
}

auto assemble(Quotes quotes)
{
	size_t index = 0;
	size_t limit = quotes.size();
	string sig;

	sig = "[\n";
	for (auto quote : quotes)
	{
		sig += "\t[\n";
		for(auto i = 0; i < limit; i++)
		{
				
			sig += "\t\t[\n\t\t\t{\n\t\t\t\t\\\"hash\\\": \\\"" + quote.hash + "\\\",\n\t\t\t\t\\\"block\\\": " + to_string(quote.block) + "\n\t\t\t}"; 
			for(auto x = 1; x < i; x++)
			{
				if (quote.hash != quotes[x].hash) 
				{
					sig += ",\n\t\t\t{\n\t\t\t\t\\\"hash\\\": \\\"" + quotes[x].hash + "\\\",\n\t\t\t\t\\\"block\\\": " + to_string(quotes[x].block) + "\n\t\t\t}";
				}	
			}
			sig += "\n\t\t],";
		}
		sig.pop_back();
		sig += "\n\t],";
		index++;
	}
	sig.pop_back();
	sig += "\n]";

	return sig;
}

int main(int argc, char *argv[])
{
	clock_t t;
	double time_taken;
	size_t o;
	string sig;
	string command;
	t = clock();
	
	Filename input = argv[1];
	uint tLimit = stoi(argv[2]);
	command = "curl -H 'Content-Type: application/json' -d '";
	sig = assemble(sift(getQuotes(input), tLimit));

	command += sig + "' -X POST \"http://localhost:3000\"";
	
	o = system(command.c_str());

	t = clock() - t;
   	time_taken = ((double)t) / CLOCKS_PER_SEC;

	printf("\n__________________________________________________________\n");
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
