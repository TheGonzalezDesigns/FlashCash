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
typedef string Directory;
typedef string Port;

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

	if(hash[0] == '\"') {
		hash = hash.substr(1, hash.length() - 1);
	}

	quote.hash = hash;
	quote.block = stol(block);
	
	return quote;
}

Quotes getQuotes(Directory dir)
{
	Filename refined = dir + "/refined.srls"; 
	fstream load;
	
	Quotes quotes;
	Serial serial;

	load.open(refined, ios::in);

	if (load.is_open())
	{
		while (getline(load, serial, '\n'))
		{
			quotes.push_back(parse(serial));
			//cout << "Hash:\t " << parse(serial).hash << endl;
			//cout << "Serial:\t " << serial << endl;

		}
		cout << "Loaded refined serials from:\t" << refined << endl;
		load.close();

	}
	else
	{
		cout << "Attention: Could not load refined serials from:\t" << refined << endl;
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

auto assemble(Quotes quotes, Directory dir)
{
	size_t index = 0;
	size_t limit = quotes.size();
	string sig;
	string ledger = "[";
	string object = "";
	Filename parsed = dir + "/parsed/collection.json";
	//cout << "Limit:\t" << limit << endl;
	if (limit > 0)
	{
		sig = "[\n";
		for (auto quote : quotes)
		{
			ledger += "{\n\t\t\t\t\"hash\": \"" + quote.hash + "\",\n\t\t\t\t\"block\": " + to_string(quote.block) + "\n\t\t\t},"; 
			sig += "\t[\n";
			for(auto i = 0; i < limit; i++)
			{
				
				sig += "\t\t[\n\t\t\t{\n\t\t\t\t\"hash\": \"" + quote.hash + "\",\n\t\t\t\t\"block\": " + to_string(quote.block) + "\n\t\t\t}"; 
				for(auto x = 1; x < i; x++)
				{
					if (quote.hash != quotes[x].hash) 
					{
						sig += ",\n\t\t\t{\n\t\t\t\t\"hash\": \"" + quotes[x].hash + "\",\n\t\t\t\t\"block\": " + to_string(quotes[x].block) + "\n\t\t\t}";
					}	
				}
				sig += "\n\t\t],";
			}
			sig.pop_back();
			sig += "\n\t],";
			index++;
		}
		ledger.pop_back();
		ledger += "],";
		sig.pop_back();
		sig += "\n]";

		object += "{\"ledger\":" + ledger + "\"data\":" + sig + ",\"collection\":\"" + parsed + "\"}";
	}
	else 
	{
		ledger = "[],";
		sig = ledger;
		parsed = "[]";
		object = "{\"ledger\":" + ledger + "\"data\":" + sig + "\"collection\":" + parsed + "}";
	}
	

	return object;
}

int main(int argc, char *argv[])
{
	clock_t t;
	double time_taken;
	size_t o;
	string command;
	
	Directory directory = argv[1];
	uint tLimit = stoi(argv[2]);
	Port port = argv[3];
	
	//do {
		t = clock();
		command = "curl -H 'Content-Type: application/json' -d '" + assemble(sift(getQuotes(directory), tLimit), directory) + "' -X POST http://localhost:" + port + " -L";
	
		cout << command << endl;

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
	/*//} while(true);*/
	return 0;
}
