#include <iostream>
#include <string>
#include <vector>
#include <string.h>
#include "flat_hash_map.hpp"
#include <fstream>
#include <optional>
#include <sstream>

using namespace std;

typedef float				Amount;
typedef unsigned			Quantity;
typedef optional<unsigned short>	State;
typedef double 				Percentage;
typedef Percentage			Statistic;
typedef unsigned short			Count;
typedef long double			Precise;

enum					maybe{no=0, yes=1};
typedef State				Answer;
typedef optional<Answer>		Response;

typedef Precise				Price;
typedef double				QTime;
typedef State	 			Volat;
enum 					volatillity{low=0, high=1};
typedef Count 				Spread;
typedef Count	 			TLimit;

typedef struct 	profiles //start here
{
		Price 			price;
		QTime 			qTime;
		Volat 			volat;
		Spread			spread;
		TLimit			tLimit;
	
} 					Profile;

string extract(string source, string filename)
{
	
	fstream		file;
	string		path = source + "/" + filename;
	string		data;

	file.open(path, ios::in);

	if (file.is_open())
	{
		cout << "Extracting:\t" << path << endl;
		getline(file, data, '\n');
		file.close();

	} else cout << "Couldn't open:\t" << path << endl;
	
	return data;
}

Profile catalogue(string path)
{
	Profile		p;
	
	p.price		= stold(extract(path, "price"));
	p.qTime		= stod(extract(path, "time"));
	p.volat		= extract(path, "volatility") == "hi" ? high : low;
	p.spread	= stoi(extract(path, "spread"));
	p.tLimit	= stoi(extract(path, "trailLimit"));

	return p;
}

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

//Hint guess()

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

enum					moment{early=0, late=1};

typedef struct	timelines
{
		Blocks			blocks;
		Block			oldest;
		Block			newest;
		Age			age;			

}					Timeline;

Age getAge(Block newest, Block oldest)
{
	return static_cast<double>(newest - oldest) / static_cast<double>(oldest);
}

Timeline getTimeline(Blocks blocks)
{
	Timeline	tl;

	tl.blocks	= blocks;

	sort(tl.blocks.begin(), tl.blocks.end());

	tl.oldest	= tl.blocks.front();
	tl.newest	= tl.blocks.back();
	tl.age		= getAge(tl.newest, tl.oldest);

	return tl;
}

typedef struct	fiats
{
		Price			quote;
		Price			bid;
		Price			gas;

}					Fiat;

typedef struct	cryptos
{
		Price			quote;
		Price			bid;
		Price			gas;

}					Crypto;

typedef string	Hash;

typedef struct	quotes
{
		Hash			hash;
		Block			block;
		Fiat			fiat;
		Crypto			crypto;
		Statistic		profitability;
}					Quote;

typedef vector<quotes>			Snapshot;

string sanitize(string tok)
{	string		clean = tok;
	int		length = tok.length() - 1;
	
	if(tok.substr(0, 1) == "\"") clean = tok.substr(1, length);
	else if(tok.substr(length, length) == "\"") clean = tok.substr(0, length - 1);

	return clean;
}

Statistic getProfitability(Price q, Price b, Price g)
{
	return ((q - g) - b) / b;
}

Quote parseQuote(string data)
{
	Quote 			q;
	stringstream		ss(data);
	string			tok;
	vector<string>		store;

	while (ss >> tok)	store.push_back(tok);

	q.hash		=	store[0];
	q.block		=	stoi(store[1]);
	q.fiat.quote	=	stold(store[2]);
	q.fiat.bid	=	stold(store[3]);
	q.fiat.gas	=	stold(store[4]);
	q.crypto.quote	=	stold(store[5]);
	q.crypto.bid	=	stold(store[6]);
	q.crypto.gas	=	stold(store[7]);
	q.profitability =	getProfitability(q.fiat.quote, q.fiat.bid, q.fiat.gas);

	return q;
}

Snapshot capture(string path)
{
	fstream		file;
	string		tok;
	Snapshot	snap;
	Quote		quote;

	file.open(path, ios::in);

	if (file.is_open())
	{
		cout << "Capturing:\t" << path << endl;
		while (getline(file, tok, '|'))
		{
			tok = sanitize(tok);
			quote = parseQuote(tok);
			snap.push_back(quote);
		}
		file.close();

	} else cout << "Couldn't open:\t" << path << endl;

	return snap;
}

typedef Amount				Profit;
typedef Statistic 			Score;

typedef struct 	qscores 
{
		Count			quotes;
		Profit			average;
		Score			score;

}					QScore;

QScore getQScore(Snapshot snap)
{
	QScore		qs;
	Price		tQuote = 0;
	Price		tBid = 0;
	Price		tGas = 0;
	
	qs.quotes	= snap.size();

	for (auto quote : snap)
	{
		tQuote	+= quote.fiat.quote;
		tBid	+= quote.fiat.bid;
		tGas	+= quote.fiat.gas;
	}

	qs.score	= ((tQuote - tGas) - tBid) / static_cast<long double>(qs.quotes);

	return qs;
}

typedef struct	sets 
{
		QScore			qscore;
		Timeline		timeline;

}					Set; //Sets are converted to records by calculation

Set getSet(Snapshot snap)
{
	Set		set;
	Blocks		blocks;

	for (auto q : snap)
	{
		blocks.push_back(q.block);
	}
	
	set.qscore	= getQScore(snap);
	set.timeline	= getTimeline(blocks);

	return set;
}

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

Record log(string serials, string variables)
{
	Record r;
	Snapshot	snap;
	Set		set;
	Profile		profile;

	snap		= capture(serials);
	set		= getSet(snap);
	profile		= catalogue(variables);

	r.profile	= profile;
	r.timeline	= set.timeline;
	//r.rank		= getRank();
	r.qscore	= set.qscore.score;

	return r;
}

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

enum					reset{erase=0, keep=1};

typedef struct 	accounts
{
		Chronicle		chronicle;
		Recommendation		recommendation;
		Timeline		timeline;
		State			state;
		State			age;
}					Account;

enum					report{failure=0, success=1};

typedef struct 	optimzers
{
		Account			account;
		Wisdom			wisdom;
		State			state;
}					Optimizer;

Confidence howConfidentIsConfident()
{
	
	//Should be a generated constant but for now it'll be arbitraty value.
	//It will later be mananged by the network optimizer
	return .8; //Big number so it should be perpetual;
}

Response didIFail(Optimizer director)
{
	return director.account.recommendation.confidence > howConfidentIsConfident()  ? no : yes;
}	

Age howOldIsOld()
{
	//Should be a generated constant but for now it'll be arbitraty value.
	//It will later be mananged by the network optimizer
	return 100000; //Big number so it should be perpetual;
}

Response isTheAccountOld(Account account)
{
	return account.timeline.age > howOldIsOld() ? late : early;
}

Response isItTimeToQuit(Account account)
{
	return isTheAccountOld(account) == late ? yes : no;
}

Response isItOptimized(Optimizer director)
{
	return didIFail(director) && isItTimeToQuit(director.account) ? yes : no;
}

Response doIQuit(Optimizer optimizer)
{
	return isItOptimized(optimizer) == no ? yes : no;
}

void notifySuperior(Optimizer employee)
{
	doIQuit(employee);
	//SendReport();
	//Quit();
}

int main(int argc, char *argv[])
{
	Optimizer	Director;
	Record		record;

	record = log(argv[1], argv[2]);

	cout << record.timeline.age << endl;
	cout << record.qscore << endl;
	cout << record.profile.price << endl;

	notifySuperior(Director);

	return 0;
}

//VTLTY: Taming the market with relative decisions.
