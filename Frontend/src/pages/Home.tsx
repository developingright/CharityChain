
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Heart, Shield, Zap } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Link } from 'react-router-dom'


export default function Component() {


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 items-center justify-center">
        <section className="w-full flex py-12 md:py-24 lg:py-32 xl:py-48 justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center justify-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Donate with Solana, Change Lives
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Make instant, secure donations to charities worldwide using Solana blockchain technology.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="#features">Get started</Link>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Donate Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Donate with Solana?</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Solana's high-speed blockchain ensures your donations reach charities in seconds, not days.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Secure & Transparent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Every transaction is recorded on the blockchain, ensuring full transparency and security.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Coins className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Low Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Minimal transaction fees mean more of your donation goes directly to the cause you care about.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I donate using Solana?</AccordionTrigger>
                <AccordionContent>
                  To donate using Solana, you'll need a Solana wallet with SOL tokens. Connect your wallet to our platform, enter the amount you wish to donate, and confirm the transaction. The donation will be processed instantly on the Solana blockchain, ensuring fast and secure transfer to the charity of your choice.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
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