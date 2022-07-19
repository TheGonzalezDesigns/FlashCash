#include <iostream>
#include <string>
#include <vector>
#include <string.h>
#include "flat_hash_map.hpp"
#include <fstream>
#include <optional>

using namespace std;

typedef unsigned int 			Price;
typedef double				QTime;
typedef unsigned int 			Volat;
enum 					volatillity{low=0, high=1};
typedef unsigned short int 		Spread;
typedef unsigned short int 		TLimit;

typedef struct 	profiles
{
		Price 			price;
		QTime 			qTime;
		Volat 			volat;
		Spread			spread;
		TLimit			tLimit;
	
} 					Profile;

typedef struct 	hints
{
		optional<Price> 	price;
		optional<QTime> 	qTime;
		optional<Volat> 	volat;
		optional<Spread>	spread;
		optional<TLimit>	tLimit;
	
} 					Hint;

typedef vector<profiles>		Archive;
typedef vector<hints>			Suggestions;

typedef double 				Percentage;
typedef double 				Boundary;
typedef double 				Origin;

typedef struct	ranges 
{
		Boundary		positive;
		Boundary		negative;
		Percentage		depth;
		Origin			origin;

}					Range;

typedef Percentage 			Superiority;
typedef Percentage 			Inferiority;
enum					stature{inferior=0, superior=1}
typedef	unsigned short int		Status;
typedef Percentage 			Lead;

typedef struct	ranks 
{
		optional<Superiority>	superiority;
		optional<Inferiority>	inferiority;
		optional<Lead>		lead;
		Status			status;
} 					Rank;

typedef struct	records
{
		Profile 		profile;
		Rank			rank;

} 					Record;

typedef vector<records> 		History;

struct synopses 
{
	Percentage food;
} 					Synopsis;

int main(int argc, char *argv[])
{

    return 0;
}

//VTLTY: Taming the market with relative desisions.
