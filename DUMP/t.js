let flag = process.argv[2]

let t = (flag) =>
{
	if (flag == "1")
		throw new Error;
}
t(flag);
console.log(flag)
