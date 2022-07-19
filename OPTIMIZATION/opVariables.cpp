#include <iostream>
#include <string>
#include <vector>
#include <string.h>
#include "flat_hash_map.hpp"
#include <fstream>
#include <optional>

using namespace std;

typedef float				Amount;
typedef unsigned			Quantity;
typedef unsigned short			State;
typedef double 				Percentage;
typedef Percentage			Statistic;
typedef unsigned short			Count;

typedef Quantity 			Price;
typedef double				QTime;
typedef State	 			Volat;
enum 					volatillity{low=0, high=1};
typedef Count 				Spread;
typedef Count	 			TLimit;

typedef struct 	profiles
{
		Price 			price;
		QTime 			qTime;
		Volat 			volat;
		Spread			spread;
		TLimit			tLimit;
	
} 					Profile;

enum					pervalence{uncommon=0, common=1};
typedef	Statistic			Frequency;

typedef Statistic			Comprehensivity;

typedef struct 	hints
{
		optional<Price> 	price;
		optional<Frequency>	priceFreq;
		optional<QTime> 	qTime;
		optional<Frequency>	qTimeFreq;
		optional<Volat> 	volat;
		optional<Frequency>	volatFreq;
		optional<Spread>	spread;
		optional<Frequency>	spreadFreq;
		optional<TLimit>	tLimit;
		optional<Frequency>	tLimitFreq;
		Comprehensivity		comprehensivity;
	
} 					Hint;

typedef struct 	ideas
{
		optional<Price> 	price;
		optional<QTime> 	qTime;
		optional<Volat> 	volat;
		optional<Spread>	spread;
		optional<TLimit>	tLimit;
		Comprehensivity		clarity;
	
} 					Idea;
//typedef vector<profiles>		Archive; //Obsolete through History
typedef vector<hints>			Suggestions;

typedef Statistic			Confidence;

typedef struct	recommendations
{
		Suggestions		suggestions;
		Idea			idea;
		Confidence		confidence;

}					Recommendation;

typedef vector<recommendations>		Advice;

typedef struct	wisdom
{
		Advice			advice;
		Idea			idea;
		Confidence		confidence;

}					Wisdom;

typedef Percentage			Boundary;
typedef Percentage			Origin;

typedef struct	ranges 
{
		Boundary		positive;
		Boundary		negative;
		Percentage		depth;
		Origin			origin;

}					Range;

typedef unsigned			Block;
typedef vector<Block>			Blocks;
typedef Statistic			Age;

typedef struct	timelines
{
		Blocks			blocks;
		Block			oldest;
		Block			newest;
		Age			age;			

}					Timeline;

typedef struct	quotes
{
		Block			block;
		Price			quote;
		Price			bid;
		Price			gas;
		Statistic		profitability;
}					Quote;

typedef vector<quotes>			Snapshot;

typedef Amount				Profit;
typedef Statistic 			Score;

typedef struct 	qscores 
{
		Count			quotes;
		Profit			average;
		Score			score;

}					QScore;

typedef struct	sets 
{
		QScore			qscore;
		Timeline		timeline;
		Snapshot		snapshot;

}					Set; //Sets are converted to records by calculation

typedef Statistic 			Superiority;
typedef Statistic 			Inferiority;
enum					stature{inferior=0, superior=1};
typedef	State				Status;
typedef Superiority 			Lead;

typedef struct	ranks 
{
		optional<Superiority>	superiority;
		optional<Inferiority>	inferiority;
		Status			status;

} 					Rank;

typedef struct	records
{
		Profile 		profile;
		Timeline		timeline;
		Rank			rank;
		Score			qscore;

} 					Record;

typedef vector<records> 		History;

typedef struct 	optima
{
		Profile			profile;
		Lead			lead;

}					Optimum;

typedef struct synopses 
{
		History 		history;
		Hint			hint;
		Timeline		timeline;
		optional<Optimum>	optimum;

} 					Synopsis;

typedef vector<Synopsis>		Chronicle;

enum					reset{erase=0,keep=1};

typedef struct 	accounts
{
		Chronicle		chronicle;
		Recommendation		recommendation;
		Timeline		timeline;
		optional<State>		state;
}					Account;

enum					report{failure=0,success=1};

typedef struct 	optimzers
{
		Account			account;
		Widsom			Wisdom;
		optional<State>		state;
}					Optimizer;

int main(int argc, char *argv[])
{
	Optimizer Director;
	
	return 0;
}

//VTLTY: Taming the market with relative decisions.
