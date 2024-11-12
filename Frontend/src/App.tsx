import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import Airdrop from './Airdrop';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useAuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import Toaster from 'react-hot-toast'
import Campaign from './pages/Campaign';

function App() {
    const location = useLocation();
    const showWalletButtons = location.pathname === '/donate';
    const {authUser} = useAuthContext();
    console.log(authUser);
    return (
        <ConnectionProvider endpoint={"https://sparkling-greatest-moon.solana-devnet.quiknode.pro/822e139603cadc06e2018500558d3e7ca2ef73a4"}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    {/* {showWalletButtons && (
                        <>
                            <WalletMultiButton />
                            <WalletDisconnectButton />
                        </>
                    )} */}
                    <Navbar/>
                    <Routes>
                        <Route path="/donate" element={<Airdrop />} />
                        <Route path='/dashboard' element={ authUser ? <Dashboard/> : <Navigate to="/login"/> } />
                        {/* Additional routes can go here */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={authUser ? <Navigate to="/"/> : <Login/>}/>
                        <Route path="/signup" element={ authUser ? <Navigate to="/"/>:<SignUp/>}/>
                        <Route path="/create" element={authUser ? <Campaign/> : <Navigate to="/login"/> } />
                    </Routes>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
