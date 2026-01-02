import { Song, Fragment, User } from '../types';

// Mock Data
const MOCK_USER: User = {
  id: 'user_1',
  address: '0x71C...9A23',
  username: 'crypto_audiophile.base',
  avatarUrl: 'https://picsum.photos/seed/user1/50/50',
  isArtist: false,
};

const MOCK_ARTIST: User = {
  id: 'artist_1',
  address: '0x123...456',
  username: 'dj_ether',
  avatarUrl: 'https://picsum.photos/seed/artist1/50/50',
  isArtist: true,
};

// Initial State Simulation
let MOCK_SONG: Song = {
  id: 'song_1',
  title: 'Neon Nights (Etherlink Mix)',
  artist: MOCK_ARTIST,
  audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3', // Free stock audio
  duration: 30, // seconds
  totalFragments: 8,
  mintedFragments: 2,
  coverArt: 'https://picsum.photos/seed/album1/400/400',
  fragments: [],
};

// Initialize fragments
const fragmentDuration = MOCK_SONG.duration / MOCK_SONG.totalFragments;
for (let i = 0; i < MOCK_SONG.totalFragments; i++) {
  MOCK_SONG.fragments.push({
    id: `frag_${i}`,
    index: i,
    startTime: i * fragmentDuration,
    endTime: (i + 1) * fragmentDuration,
    price: 0.05,
    ownerId: i < 2 ? 'early_adopter' : null, // First 2 are minted
    isRevealed: i < 2,
  });
}

// Simulates a smart contract call
export const fetchSongData = async (songId: string): Promise<Song> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...MOCK_SONG }), 800);
  });
};

// Simulates the Blind Mint function
export const mintFragment = async (songId: string, user: User): Promise<{ success: boolean; fragment?: Fragment }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find unminted fragments
      const unminted = MOCK_SONG.fragments.filter(f => f.ownerId === null);
      
      if (unminted.length === 0) {
        resolve({ success: false });
        return;
      }

      // Random selection (Blind Mint logic)
      const randomIndex = Math.floor(Math.random() * unminted.length);
      const selectedFragment = unminted[randomIndex];

      // Update State (Simulating Blockchain State Change)
      selectedFragment.ownerId = user.id;
      selectedFragment.isRevealed = true;
      MOCK_SONG.mintedFragments += 1;

      resolve({ success: true, fragment: selectedFragment });
    }, 2000); // Simulate network delay
  });
};

export const getCurrentUser = (): User => MOCK_USER;