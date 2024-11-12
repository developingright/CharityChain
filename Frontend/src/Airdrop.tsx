import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";

// @ts-ignore
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

window.Buffer = Buffer;

export default function Airdrop() {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    async function fetchBalance() {
      if (wallet.publicKey) {
        const res = await connection.getBalance(wallet.publicKey);
        setBalance(res);
      }
    }

    async function fetchTransactionHistory() {
        if (wallet.publicKey) {
          // Fetch the signatures for the address
          const signatures = await connection.getSignaturesForAddress(wallet.publicKey, { limit: 10 });
      
          // Fetch transaction details for each signature
          const transactions = await Promise.all(
            signatures.map(async (signatureInfo) => {
              // Get the full transaction details
              const transaction = await connection.getTransaction(signatureInfo.signature);
              
              if (transaction) {
                // Extract relevant data
                const fromAddresses = transaction.transaction.message.accountKeys.filter((_, index) => 
                  index !== 0 // Exclude the first account (which is usually the receiver's public key)
                );
      
                return {
                  fromAddresses: fromAddresses.map((key) => key.toBase58()), // Convert PublicKey objects to string
                  slot: signatureInfo.slot,
                  blockTime: transaction.blockTime,
                  sol: (transaction.meta?.postBalances[0] || 0) / LAMPORTS_PER_SOL, // Convert lamports to SOL
                };
              }
              return null; // Handle cases where the transaction is not found
            })
          );
      
          // Filter out null results
          const filteredTransactions = transactions.filter((tx) => tx !== null);
          
          setTransactionHistory(filteredTransactions);
        }
      }
      
      

    fetchBalance();
    fetchTransactionHistory();
  }, [wallet.publicKey, connection]);

  async function sendAirdropToUser() {
    const res = await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
    console.log(res);
    console.log(wallet.publicKey);
    alert("Airdrop SOL");
  }

  async function sendTokens() {
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey("9U8LXMfiaz6cHasPiSNmozNSC3SjfqEwchLAdYKeVteE"),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    await wallet.sendTransaction(transaction, connection);
    alert("Sent " + amount + " SOL to " + "9U8LXMfiaz6cHasPiSNmozNSC3SjfqEwchLAdYKeVteE");
  }

  return (
        <div>
          <h2>{wallet.publicKey?.toString()}</h2>
          <input type="text" placeholder="Amount" onChange={(e) => setAmount(Number(e.target.value))} />
          <button onClick={sendTokens}>Send Airdrop</button>
          <h3>Balance = {balance}</h3>
      
          <h3>Transaction History:</h3>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">From Address</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Block Time</TableHead>
                <TableHead className="text-right">Amount (SOL)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {transactionHistory.map((tx) => (
                <TableRow key={tx.slot}>
                  <TableCell className="font-medium">{tx.fromAddresses.join(', ')}</TableCell>
                  {/* <td>{tx.fromAddresses.join(', ')}</td> */}
                  <TableCell>{tx.slot}</TableCell>
                  <TableCell>{tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>{tx.sol.toFixed(4)} SOL</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <table>
            <thead>
              <tr>
                <th>From Address</th>
                <th>Slot</th>
                <th>Block Time</th>
                <th>Amount (SOL)</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((tx) => (
                <tr key={tx.slot}>
                  <td>{tx.fromAddresses.join(', ')}</td>
                  <td>{tx.slot}</td>
                  <td>{tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : 'N/A'}</td>
                  <td>{tx.sol.toFixed(4)} SOL</td> {/* Display SOL with 4 decimal places */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
      
}
