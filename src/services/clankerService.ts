import axios from 'axios';
import { createPublicClient, createWalletClient, http, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

interface ClankerTokenInfo {
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

interface ClankerRewardsResponse {
  lockerAddress: string;
  lpNftId: number;
  token1UncollectedRewards: string;
  token0UncollectedRewards: string;
  token0: ClankerTokenInfo;
  token1: ClankerTokenInfo;
}

// Clanker LP Locker ABI for the claimRewards function
const CLANKER_LP_LOCKER_ABI = [
  {
    name: "collectRewards",
    inputs: [
      { name: "tokenId", type: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
] as const;

export class ClankerService {
  private apiKey: string;
  private baseUrl: string;
  private publicClient;
  private walletClient;

  constructor() {
    this.apiKey = process.env.CLANKER_API_KEY as string;
    if (!this.apiKey) {
      throw new Error('CLANKER_API_KEY is not set in environment variables');
    }
    this.baseUrl = 'https://www.clanker.world/api';

    // Initialize Viem clients
    this.publicClient = createPublicClient({
      chain: base,
      transport: http()
    });

    // Initialize wallet client with private key from environment
    const privateKey = process.env.WALLET_PRIVATE_KEY as `0x${string}`;
    if (!privateKey) {
      throw new Error('WALLET_PRIVATE_KEY is not set in environment variables');
    }


    const account = privateKeyToAccount(privateKey);

    this.walletClient = createWalletClient({
      chain: base,
      transport: http(),
      account: account
    });
  }

  async getUncollectedFees(contractAddress: string): Promise<ClankerRewardsResponse> {
    try {
      console.log(`Fetching uncollected fees for contract: ${contractAddress}`);
      
      const response = await axios.get(
        `${this.baseUrl}/get-estimated-uncollected-fees/${contractAddress}`,
        {
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );

      const data = response.data as ClankerRewardsResponse;
      
      // Log the response for debugging
      console.log('Clanker API Response:', {
        lockerAddress: data.lockerAddress,
        lpNftId: data.lpNftId,
        token0Rewards: data.token0UncollectedRewards,
        token1Rewards: data.token1UncollectedRewards,
        token0Symbol: data.token0.symbol,
        token1Symbol: data.token1.symbol
      });

      // Validate the response
      if (!data.lockerAddress || !data.token0 || !data.token1) {
        throw new Error('Invalid response from Clanker API');
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Clanker API Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          contractAddress
        });
      } else {
        console.error('Error fetching Clanker rewards:', error);
      }
      throw error;
    }
  }

  // Function to collect rewards and send to split contract
  async collectAndSendToSplit(rewards: ClankerRewardsResponse): Promise<void> {
    try {

      console.log('Rewards:', rewards);
      
      console.log('Unclaimed rewards:', {
        token0: {
          symbol: rewards.token0.symbol,
          amount: rewards.token0UncollectedRewards
        },
        token1: {
          symbol: rewards.token1.symbol,
          amount: rewards.token1UncollectedRewards
        }
      });

      // Call claimRewards on the LP Locker contract
      const lpLockerAddress = rewards.lockerAddress as Address;
      const tokenId = BigInt(rewards.lpNftId);

      console.log(`Claiming rewards for token ID ${tokenId} from LP Locker ${lpLockerAddress}`);

      // // Prepare the transaction
      const { request } = await this.publicClient.simulateContract({
        address: lpLockerAddress,
        abi: CLANKER_LP_LOCKER_ABI,
        functionName: 'collectRewards',
        args: [tokenId],
        account: this.walletClient.account
      });

      console.log('Request:', request);

      // // Send the transaction
      const hash = await this.walletClient.writeContract(request);
      console.log('Claim rewards transaction sent:', hash);

      // // Wait for transaction to be mined
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      console.log('Claim rewards transaction confirmed:', receipt);

      //

      // Note: The rewards will be automatically distributed according to the contract's logic:
      // - 20% to Clanker
      // - 80% split between creator and interface
      // If the reward recipient is set to zero address, Clanker receives all fees
    } catch (error) {
      console.error('Error collecting and sending Clanker rewards:', error);
      throw error;
    }
  }
} 