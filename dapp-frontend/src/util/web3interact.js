// 获取env variable
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;


// 创建 web3 provider.
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
console.log("WEB3",web3);

// 创建 contract web3 instance.
//    1. contract abi
//····2. contract address， 去告诉web3.js 库 如何跟我们智能合约进行交互。
const contractABI = require("../assets/tintinToken-abi.json");
const contractAddress = "0x46b040ebadb248722165c96e82d73d35c020ff30";
export const TinTinTokenContract = new web3.eth.Contract(
	contractABI,
	contractAddress
);

// console.log("TinTinTokenContract",TinTinTokenContract);


// 从智能合约读取数据
export const loadTokenName = async () => {
	// console.log("Name Start")
	const tokenName = await TinTinTokenContract.methods.name().call();
	// console.log("TokenName", tokenName)
	return tokenName;
};

export const loadTokenAccountBalance = async (account) => {
	const balance = await TinTinTokenContract.methods.balanceOf(account).call();
	return +balance / 10 ** 18;
};

export const loadTokenTotalSupply = async() => {
	const totalSupply = await TinTinTokenContract.methods.totalSupply().call();
	return parseInt(totalSupply / 10 ** 18)
}



// 链接metamask 钱包
export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const obj = {
				status: "👆🏽 input the transfer to addresst in the text-field above.",
				address: addressArray[0],
			};
			return obj;
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};
// 获取链接钱包地址
export const getCurrentWalletConnected = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_accounts",
			});
			if (addressArray.length > 0) {
				return {
					address: addressArray[0],
					status: "👆🏽 input the transfer to addresst in the text-field above.",
				};
			} else {
				return {
					address: "",
					status: "🦊 Connect to Metamask using the top right button.",
				};
			}
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};

// 发起交易
export const transferToken = async (fromAddress, toAddress) => {
	let value = (10 ** 18).toFixed(0);
	console.log(value);
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	if (toAddress.trim() === "") {
		return {
			status: "❌ Your message cannot be an empty string.",
		};
	}

	//set up transaction parameters
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: TinTinTokenContract.methods.transfer(toAddress, value).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, the token balance
					will be updated automatically.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}
};
