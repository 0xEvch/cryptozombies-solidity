<template>
    <div>
      <button @click="toggleMenu()" className="wallet-connect-btn">
        {{ account ? formattedAccount : 'Connect Wallet' }}
      </button>
      
      <div v-if="menuVisible" className="wallet-menu">
        <button @click="disconnectWallet()" className="wallet-menu-item">Disconnect</button>
      </div>
      
      <p v-if="error" className="error">{{ error }}</p>
    </div>
</template>

<script>
    import Web3 from "web3";

    export default {
        name : "Wallet",
        data() {
            return {
                accounts: null,
                account: null,
                error : null,
                web3 : null,
                menuVisible: null,
                accountInterval: null,
            };
        },
        computed: {
            formattedAccount() {
            return this.account ? this.account.slice(0, 6) + '...' + this.account.slice(-4) : "";
            }
        },
        methods: {
            async connectWallet() {
                if (typeof window.ethereum !== "undefined") {
                    try {
                        await window.ethereum.request({ method: 'eth_requestAccounts' });

                        this.web3 = new Web3(window.ethereum); 

                        this.accounts = await window.ethereum.request({ method: 'eth_accounts' });
                        this.account = this.accounts[0] || null;

                        window.ethereum.on('accountsChanged', this.handleAccountsChanged);

                    } catch (error) {
                        if (error.code === 4001) {
                            this.error = "User denied account access";
                            setTimeout(() => {
                                 this.error = null;
                            }, 3000);
                        } else {
                            this.error = "Error connecting wallet";
                            console.error("Error connecting wallet", error);
                            setTimeout(() => {
                                 this.error = null;
                            }, 3000);
                        }
                    }
                } else {
                    this.error = "Ethereum provider not found. Please install MetaMask.";
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                }
            },
            handleAccountsChanged(accounts) {
                if (accounts.length === 0) {
                    this.disconnectWallet();
                } else {
                    this.account = accounts[0];
                    this.accounts = accounts;
                }
            },
            disconnectWallet() {
                this.account = null;
                this.accounts = null;
                this.menuVisible = false;
                this.web3 = null;

                if (window.ethereum) {
                    window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
                }
            },
            toggleMenu(){
                if(this.account){
                    this.menuVisible = !this.menuVisible;
                } else {
                    this.connectWallet();
                }
            },
        }
    };
</script>

<style scoped>
    .wallet-connect-btn {
    position: fixed; 
    top: 20px; 
    right: 20px; 
    background-color: #007bff; 
    color: white; 
    padding: 10px 40px; 
    border-radius: 8px;
    font-size: 16px; 
    border: none; 
    cursor: pointer; 
    transition: background-color 0.3s ease, transform 0.2s ease; 
    }

    .wallet-connect-btn:hover {
    background-color: #0056b3; 
    transform: translateY(-2px);
    }

    .wallet-connect-btn:focus {
    outline: none; 
    }

    .error {
    position: fixed;
    top: 65px;
    right: 20px;
    padding: 15px;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    max-width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: opacity 0.3s ease;
    background-color: #dc3545; 
    }
</style>