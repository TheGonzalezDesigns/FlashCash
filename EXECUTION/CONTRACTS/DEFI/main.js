const { ParaSwap } = require('paraswap');

let ps = new ParaSwap();

export const initiate(provider, network, account) 
{
	web3Provider = ... //add web 3 to deps and create a provider instance with the provider var as an adress
	ps = new ParaSwap().setWeb3Provider(web3Provider);
	ps.network = network;
	ps.account = account;
}

export const swap(from, to, amount, route) 
{
	const txHash = await paraSwap.approveToken(amount, ps.account, from);	
}
{
}
