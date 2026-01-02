import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';

// Define Etherlink Mainnet
const etherlink = {
  id: 42793,
  name: 'Etherlink Mainnet',
  iconUrl: 'https://pbs.twimg.com/profile_images/1729555238202105856/8e0H-8dY_400x400.jpg',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Tezos', symbol: 'XTZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://node.etherlink.com'] },
  },
  blockExplorers: {
    default: { name: 'Etherlink Explorer', url: 'https://explorer.etherlink.com' },
  },
} as const;

// Define Etherlink Testnet
const etherlinkTestnet = {
  id: 128123,
  name: 'Etherlink Testnet',
  iconUrl: 'https://pbs.twimg.com/profile_images/1729555238202105856/8e0H-8dY_400x400.jpg',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Tezos', symbol: 'XTZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://node.etherlink.testnet.tez.ie'] },
  },
  blockExplorers: {
    default: { name: 'Etherlink Testnet Explorer', url: 'https://testnet-explorer.etherlink.com' },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: 'EtherLoop',
  // Using a public WalletConnect testing ID. 
  // IN PRODUCTION: Replace this with your own from https://cloud.walletconnect.com
  projectId: '3a8170812b534d0ff9d794f19a901d64', 
  chains: [etherlink, etherlinkTestnet],
  transports: {
    [etherlink.id]: http(),
    [etherlinkTestnet.id]: http(),
  },
  ssr: false, // Disable SSR since we are client-side only
});