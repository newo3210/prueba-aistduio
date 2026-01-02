import React from 'react';
import { User } from '../types';
import { Menu } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface NavbarProps {
    currentUser: User | null;
    currentView: 'marketplace' | 'studio';
    setCurrentView: (view: 'marketplace' | 'studio') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, currentView, setCurrentView }) => {
    
    return (
        <nav className="border-b border-slate-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('marketplace')}>
                        <div className="w-8 h-8 bg-gradient-to-tr from-ether-500 to-neon-blue rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-xl">E</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tighter text-white">
                            Ether<span className="text-ether-400">Loop</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <button 
                            onClick={() => setCurrentView('marketplace')}
                            className={`text-sm font-medium transition-colors ${currentView === 'marketplace' ? 'text-ether-400' : 'text-slate-400 hover:text-white'}`}
                        >
                            Marketplace
                        </button>
                        <button 
                            onClick={() => setCurrentView('studio')}
                            className={`text-sm font-medium transition-colors ${currentView === 'studio' ? 'text-ether-400' : 'text-slate-400 hover:text-white'}`}
                        >
                            Artist Studio
                        </button>
                        <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Docs
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <ConnectButton 
                            accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'full',
                            }}
                            showBalance={{
                                smallScreen: false,
                                largeScreen: true,
                            }}
                        />
                        <button className="md:hidden text-white">
                            <Menu />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;