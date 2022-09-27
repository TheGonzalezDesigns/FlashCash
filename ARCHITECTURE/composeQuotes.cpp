#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <sstream>
#include <stdlib.h>
#include <chrono>
#include <cstdio>

using namespace std;

typedef string Hash;

string sanitize(string data)
{
	string s = "";
	istringstream stream(data);

	stream >> s;

	return s;
} //unused

string extractQuote(string dir, string hash)
{
	string filename = dir + hash;
	
	ifstream iQuote;
	//ofstream oQuote;

	iQuote.open(filename);
	//oQuote.open(filename);
	
	if (iQuote.is_open())
	{
		stringstream strStream;
		
		strStream << iQuote.rdbuf();
		iQuote.close();
		
		string file_contents = strStream.str();

		if (file_contents[0] != '-')
		{
			//sanitize(file_contents);
			file_contents += ",";
			//oQuote << "---";
			//oQuote.close();
			return file_contents;
		}
	}
	iQuote.close();
	//oQuote.close();
	return "";
}

void composeQuotes(string catalog, int quantity, string dir)
{
	string filename = "dispatch.json";
	string file = dir + filename;
	
	ofstream dispatch;
	dispatch.open(file);
	string output = "";
	
	if (dispatch.is_open())
	{
		stringstream strStream;
		strStream << dispatch.rdbuf();
		string file_contents = strStream.str();

		if (!quantity)
		{
			cout << "No quotes to compose at:\t"
			     << dir
			     << "\n";
				dispatch << "[]";
		} else
		{
			string quote = "";
				
			cout << "\nComposing " 
		     << quantity
			     << " quotes to:\t"
			     << file
			     << "\n";
			
			output += "[";
			istringstream files(catalog);
			string hash;
				while (files >> hash)
			{
				//cout << "Extacting: " << hash << endl;
				quote = extractQuote(dir, hash);
				if (quote.length() > 1)
					output += quote;
			}
		}
		output = output.substr(0, output.length()-2); // to remove ,
		output += "]";
		dispatch << output;
	}
	dispatch.close();
}

int main(int argc, char *argv[])
{
    auto start = chrono::high_resolution_clock::now();
    
    string catalog = argv[1];
    int quantity = stoi(argv[2]);
    string dir = argv[3];

    composeQuotes(catalog, quantity, dir);

    auto stop = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::milliseconds>(stop - start).count();

    cout << "__________________________________________________________\n"
	 << "Composing all available quotes took "
	 << duration << " milliseconds\n";

    return 0;
}
