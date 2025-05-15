import { createPublicClient, http, Address, formatEther } from 'viem';
import { base } from 'viem/chains';
import { getOnchainCoinDetails } from '@zoralabs/coins-sdk';

interface ZoraBalanceResponse {
  balance: bigint;
  formattedBalance: string;
}

export class ZoraBalanceService {
  private publicClient;

  constructor() {
    const rpcUrl = process.env.BASE_RPC_URL;
    if (!rpcUrl) {
      throw new Error('BASE_RPC_URL is not set in environment variables');
    }

    // Initialize Viem client with RPC URL
    this.publicClient = createPublicClient({
      chain: base,
      transport: http(rpcUrl)
    });
  }

  /**
   * Fetches the balance of a specific Zora coin for a user
   * @param coinAddress The address of the Zora coin
   * @param userAddress The address of the user to check balance for
   * @returns Object containing raw balance and formatted balance in ETH
   */
  async getCoinBalance(coinAddress: Address, userAddress: Address): Promise<ZoraBalanceResponse> {
    try {
      console.log(`Fetching Zora coin balance for user ${userAddress} and coin ${coinAddress}`);
      
      const userCoinBalance = await getOnchainCoinDetails({
        coin: coinAddress,
        user: userAddress,
        publicClient: this.publicClient,
      });

      const response: ZoraBalanceResponse = {
        balance: userCoinBalance.balance,
        formattedBalance: formatEther(userCoinBalance.balance)
      };

      console.log('Zora balance response:', {
        userAddress,
        coinAddress,
        rawBalance: response.balance.toString(),
        formattedBalance: response.formattedBalance
      });

      return response;
    } catch (error) {
      console.error('Error fetching Zora coin balance:', {
        error,
        coinAddress,
        userAddress
      });
      throw error;
    }
  }

  /**
   * Fetches balances for multiple coins for a user
   * @param coinAddresses Array of Zora coin addresses
   * @param userAddress The address of the user to check balances for
   * @returns Array of balance responses for each coin
   */
  async getMultipleCoinBalances(
    coinAddresses: Address[],
    userAddress: Address
  ): Promise<ZoraBalanceResponse[]> {
    try {
      console.log(`Fetching multiple Zora coin balances for user ${userAddress}`);
      
      const balancePromises = coinAddresses.map(coinAddress => 
        this.getCoinBalance(coinAddress, userAddress)
      );

      const balances = await Promise.all(balancePromises);

      console.log('Multiple Zora balances response:', {
        userAddress,
        coinCount: balances.length,
        balances: balances.map(b => ({
          rawBalance: b.balance.toString(),
          formattedBalance: b.formattedBalance
        }))
      });

      return balances;
    } catch (error) {
      console.error('Error fetching multiple Zora coin balances:', {
        error,
        coinAddresses,
        userAddress
      });
      throw error;
    }
  }
} 