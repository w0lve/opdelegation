import { serveStatic } from '@hono/node-server/serve-static';
import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';

const optimismChainId = 'eip155:10'; // Chain ID for Optimism
const delegateContractAddress = '0x4200000000000000000000000000000000000042'; // Delegate contract address

// Contract ABI for the delegate function
const delegateabi = [{
  inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
  name: 'delegate',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
}];

export const app = new Frog({ title: 'Frog Frame' });

app.frame('/', (c) => {
    return c.res({
        action: '/finish',
        image: (
            <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
                Perform a transaction
            </div>
        ),
        intents: [
            <TextInput placeholder="Amount to Delegate (OP)" />, // TextInput to get the amount
            <Button.Transaction target="/delegate">Delegate OP</Button.Transaction>,
        ]
    });
});

app.frame('/finish', (c) => {
    const { transactionId, inputText } = c; // Capture inputText for displaying amount
    return c.res({
        image: (
            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', fontSize: 60 }}>
                Transaction ID: {transactionId}
                <div>Amount Delegated: {inputText || '0'} OP</div> {/* Use a default value */}
            </div>
        )
    });
});

// Delegate transaction logic
app.transaction('/delegate', (c) => {
    const { address } = c; // Get user's connected address and inputText
    const delegateeAddress = address; // Use user's connected address as delegatee

    // Contract transaction response for delegate
    return c.contract({
        abi: delegateabi,
        chainId: optimismChainId,
        functionName: 'delegate',
        args: [delegateeAddress],
        to: delegateContractAddress
    });
});

devtools(app, { serveStatic });
