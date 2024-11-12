import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import toast from 'react-hot-toast'
import {Link} from "react-router-dom"
import useGetCampaigns from '../hooks/useGetCampaigns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

window.Buffer = Buffer;

const makeDonation = async (campaignId: string, amount: number) => {
  console.log(`Donating ${amount} SOL to campaign ${campaignId}...`)
  return { success: true, txId: "DummyTxId456" }
}

// Mock data for campaigns
// const campaigns = [
//   {
//     id: "1",
//     title: "Clean Water Initiative",
//     description: "Provide clean water to communities in need.",
//     currentAmount: 150,
//     goalAmount: 500,
//   },
//   {
//     id: "2",
//     title: "Education for All",
//     description: "Support education in underprivileged areas.",
//     currentAmount: 300,
//     goalAmount: 1000,
//   },
//   {
//     id: "3",
//     title: "Reforestation Project",
//     description: "Plant trees to combat deforestation and climate change.",
//     currentAmount: 75,
//     goalAmount: 200,
//   },
//   {
//     id: "4",
//     title: "Healthcare Access",
//     description: "Improve healthcare access in remote regions.",
//     currentAmount: 450,
//     goalAmount: 800,
//   },
// ]

export default function DonationCampaigns() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [campaigns,setCampaigns] = useState([]);
  const [donationAmounts, setDonationAmounts] = useState<{ [key: string]: string }>({})
  const {getCampaigns} = useGetCampaigns();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [transactionHistory, setTransactionHistory] = useState([]);
  useEffect(()=>{
    const setData = async()=>{
      const data = await getCampaigns();
      setCampaigns(data);
    }
    setData();
  },[]);

  const handleDonation = async (campaignId: String,public_key: string) => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet first!");
      return
    }
    try {
      const amount = parseFloat(donationAmounts[campaignId] || "0");
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid donation amount.");
        return
      }
      const success = await sendTokens(amount,public_key);
      if (success) {
        toast.success("Donation successful!");
        setDonationAmounts(prev => ({ ...prev, [campaignId]: "" }));
        setCampaigns(prevCampaigns =>
          prevCampaigns.map(campaign =>
            campaign._id === campaignId
              ? { ...campaign, donation_amt: campaign.donation_amt + amount }
              : campaign
          )
        );
        const ans = await fetch(`/api/campaign/update/${campaignId}`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({donation_amt: amount})
        })
        const res = await ans.json();
        console.log(res);
      } else {
        toast.error("Donation Failed");
      }
    } catch (error) {
      console.error("Donation error:", error)
      toast.error("Donation Error")
    }
  }

  async function sendTokens(amount:Number,toPubKey : String) {
    try {
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(toPubKey),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
  
      await wallet.sendTransaction(transaction, connection);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function fetchTransactionHistory(public_key) {
    const publicKey = new PublicKey(public_key);
    
    if (publicKey) {
      // Fetch the signatures for the address
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
  
      // Fetch transaction details for each signature
      const transactions = await Promise.all(
        signatures.map(async (signatureInfo) => {
          // Get the full transaction details
          const transaction = await connection.getTransaction(signatureInfo.signature);
          
          if (transaction && transaction.meta) {
            const accountKeys = transaction.transaction.message.accountKeys;
            const preBalances = transaction.meta.preBalances;
            const postBalances = transaction.meta.postBalances;
            const receiverIndex = accountKeys.findIndex((key) => key.equals(publicKey));
  
            // If this transaction is for the provided public key
            if (receiverIndex !== -1) {
              const fromIndex = receiverIndex === 0 ? 1 : 0;  // Assuming the sender is at index 0 or 1
              const fromAddress = accountKeys[fromIndex].toBase58();
              
              // Calculate transferred amount
              const solTransferred = (preBalances[fromIndex] - postBalances[fromIndex]) / LAMPORTS_PER_SOL;
  
              return {
                fromAddress: fromAddress,
                toAddress: public_key,
                slot: signatureInfo.slot,
                blockTime: transaction.blockTime,
                sol: solTransferred.toFixed(4), // Format SOL amount for readability
              };
            }
          }
          return null; // Handle cases where the transaction is not found or has no relevant data
        })
      );
  
      // Filter out null results
      const filteredTransactions = transactions.filter((tx) => tx !== null);
  
      setTransactionHistory(filteredTransactions);
    }
  }
  
  const handleViewTransactionHistory = (publicKey: string) => {
    fetchTransactionHistory(publicKey); // Fetch the transaction history for the specific public key
  };
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex py-12 items-center justify-center">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8 text-center">
            Active Donation Campaigns
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns?.map((campaign: any) => (
              <Card key={campaign._id} className="flex flex-col" >
                <CardHeader>
                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{(campaign.donation_amt / campaign.target * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={campaign.donation_amt / campaign.target * 100} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      {campaign.donation_amt} SOL raised of {campaign.target} SOL goal
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="flex space-x-2 w-full">
                    <Input
                      type="number"
                      placeholder="Amount in SOL"
                      value={donationAmounts[campaign._id] || ""}
                      onChange={(e) => setDonationAmounts(prev => ({ ...prev, [campaign._id]: e.target.value }))}
                      className="flex-1"
                    />
                    <Button onClick={() => handleDonation(campaign._id,campaign.public_key)}>Donate</Button>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleViewTransactionHistory(campaign.public_key)}>View Transaction History</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] bg-white">
                      <DialogHeader>
                        <DialogTitle>Transaction History</DialogTitle>
                      </DialogHeader>
                      <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Slot</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Amount (SOL)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactionHistory.map((tx, index) => (
                          <TableRow key={index}>
                            <TableCell>{tx.fromAddress}</TableCell> {/* Display sender's address */}
                            <TableCell>{tx.toAddress}</TableCell> {/* Display recipient's address (public key provided) */}
                            <TableCell>{tx.slot}</TableCell>
                            <TableCell>{new Date(tx.blockTime * 1000).toLocaleString()}</TableCell> {/* Format blockTime to a readable format */}
                            <TableCell>{tx.sol}</TableCell> {/* Display the amount in SOL */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 SolanaCharity. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}