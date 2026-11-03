// =================================
// 1. Smart Contract Configuration
// =================================

const contractAddress = "0xcfaf63e6409dc2c8b3e9d08419c1fcb8721c5690";

const contractABI = [
    "function deposit() public payable",
    "function withdraw(uint256 amount) public",
    "function checkBlance() public view returns (uint256)",
    "event Deposit(address indexed owner, uint amount)",
    "event Withdraw(address indexed owner, uint amount)"
];

let provider;
let signer;
let contract;


// =================================
// 2. Connect MetaMask
// =================================

async function connectWallet() {
    try {

        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);

        signer = await provider.getSigner();

        const address = await signer.getAddress();

        contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );

        document.getElementById("walletAddress").innerText =
            address;

        document.getElementById("status").innerText =
            "Wallet connected successfully!";

        await checkBalance();

    } catch (error) {
        console.error(error);

        document.getElementById("status").innerText =
            error.shortMessage || error.message;
    }
}


// =================================
// 3. Deposit ETH
// =================================

async function deposit() {
    try {

        if (!contract) {
            alert("Please connect MetaMask first!");
            return;
        }

        const amount = document.getElementById(
            "depositAmount"
        ).value;

        if (!amount || !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0) {
            alert("Please enter a valid ETH amount!");
            return;
        }

        const tx = await contract.deposit({
            value: ethers.parseEther(amount)
        });

        document.getElementById("status").innerText =
            "Deposit transaction pending...";

        await tx.wait();

        document.getElementById("status").innerText =
            "Deposit successful!";

        document.getElementById("depositAmount").value = "";

        await checkBalance();

    } catch (error) {
        console.error(error);

        document.getElementById("status").innerText =
            error.shortMessage || error.message;
    }
}


// =================================
// 4. Withdraw ETH
// =================================

async function withdraw() {
    try {

        if (!contract) {
            alert("Please connect MetaMask first!");
            return;
        }

        const amount = document.getElementById(
            "withdrawAmount"
        ).value;

        if (!amount || !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0) {
            alert("Please enter a valid ETH amount!");
            return;
        }

        const withdrawAmount = ethers.parseEther(amount);

        const tx = await contract.withdraw(withdrawAmount);

        document.getElementById("status").innerText =
            "Withdraw transaction pending...";

        await tx.wait();

        document.getElementById("status").innerText =
            "Withdraw successful!";

        document.getElementById("withdrawAmount").value = "";

        await checkBalance();

    } catch (error) {
        console.error(error);

        document.getElementById("status").innerText =
            error.shortMessage || error.message;
    }
}


// =================================
// 5. Check Balance
// =================================

async function checkBalance() {
    try {

        if (!contract) {
            alert("Please connect MetaMask first!");
            return;
        }

        const balance = await contract.checkBlance();

        const ethBalance = ethers.formatEther(balance);

        document.getElementById("balance").innerText =
            Number(ethBalance).toFixed(4) + " ETH";

        document.getElementById("status").innerText =
            "Balance updated successfully!";

    } catch (error) {
        console.error(error);

        document.getElementById("status").innerText =
            error.shortMessage || error.message;
    }
}


// =================================
// 6. Handle Wallet Account Changes
// =================================

if (window.ethereum) {

    window.ethereum.on("accountsChanged", () => {
        location.reload();
    });

    window.ethereum.on("chainChanged", () => {
        location.reload();
    });

}