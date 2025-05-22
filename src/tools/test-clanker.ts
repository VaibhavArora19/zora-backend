import { ClankerService } from '../services/clankerService';
import dotenv from 'dotenv';

dotenv.config();

async function testClankerAPI() {
  try {
    const clankerService = new ClankerService();
    
    // Test with a sample contract address
    const contractAddress = '0x054E4121a946da752a5Cab371BE52B2E6A897ba8'; // Replace with actual contract address
    const splitAddress = '0x618A9840691334eE8d24445a4AdA4284Bf42417D'; // Replace with actual split address
    
    console.log('Testing Clanker API...');
    
    // Test getUncollectedFees
    const fees = await clankerService.getUncollectedFees(contractAddress);
    console.log('Uncollected fees:', fees);
    
    // Test collectAndSendToSplit
    await clankerService.collectAndSendToSplit(fees);
    
    console.log('Tests completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testClankerAPI(); 
