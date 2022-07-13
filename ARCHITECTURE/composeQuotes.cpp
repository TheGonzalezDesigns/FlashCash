#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <stdlib.h>
#include <chrono>

using namespace std;

typedef string Hash;
typedef vector<Hash> Hashes;

char *extractQuote(string filename, const string dir)
{

    fstream newfile;
    string tp;

    filename = dir + filename;

    // cout << "File:\t" << filename << endl;

    newfile.open(filename, ios::in);
    getline(newfile, tp, '\n');
    // cout << tp << endl;
    // cout << "Aww hell yes. Let's get trading!" << endl;
    newfile.close(); // close the file object.

    // if (newfile.is_open())
    // {

    //     getline(newfile, tp, '\n');
    //     // cout << tp << endl;
    //     // cout << "Aww hell yes. Let's get trading!" << endl;
    //     newfile.close(); // close the file object.
    // }
    // else
    // {
    //     cout << "Aww hell nah. This file closed then a mothefucker." << endl;
    //     exit(EXIT_FAILURE);
    // }
}
int main(int argc, char *argv[])
{
    auto start = chrono::high_resolution_clock::now();
    auto stop = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);
    std::string s = argv[1];
    std::string delimiter = "\n";

    size_t pos = 0;
    std::string token;
    int i = 0;
    double avg = 0;
    while ((pos = s.find(delimiter)) != std::string::npos)
    {
        start = chrono::high_resolution_clock::now();
        token = s.substr(0, pos);
        extractQuote(token, argv[2]);
        s.erase(0, pos + delimiter.length());
        stop = chrono::high_resolution_clock::now();
        duration = chrono::duration_cast<chrono::microseconds>(stop - start);
        cout << duration.count() / 100 << endl;
        i++;
        avg += duration.count();
    }

    cout << "Took " << (avg / i) / 1000000 << " secs"
         << " and a total of " << (avg) / 1000000 << " secs" << endl;
    return 0;
}