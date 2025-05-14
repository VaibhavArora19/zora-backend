import { SplitV2Client } from "@0xsplits/splits-sdk";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { UpdateSplitV2Config } from "@0xsplits/splits-sdk/types";
import { Address } from "viem";

export class SplitContractService {
  private publicClient;
  private walletClient;
  private splitsClient;

  constructor() {
    // Initialize clients
    this.publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    // Initialize wallet client with private key from environment
    const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
    this.walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(),
    });

    // Initialize splits client
    this.splitsClient = new SplitV2Client({
      chainId: base.id,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    });
  }

  async updateSplit(config: UpdateSplitV2Config) {
    try {
      const response = await this.splitsClient.updateSplit(config);
      return response;
    } catch (error) {
      console.error("Error updating split:", error);
      throw error;
    }
  }

  async distributeSplit({
    splitAddress,
    tokenAddress,
    distributorAddress,
  }: {
    splitAddress: Address;
    tokenAddress: Address;
    distributorAddress?: Address;
  }) {
    try {
      const response = await this.splitsClient.distribute({
        splitAddress,
        tokenAddress,
        distributorAddress,
      });
      return response;
    } catch (error) {
      console.error("Error distributing split:", error);
      throw error;
    }
  }
} 