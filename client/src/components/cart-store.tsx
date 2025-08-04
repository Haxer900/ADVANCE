import { create } from 'zustand';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  sessionId: string;
}

interface CartStore {
  sessionId: string;
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  sessionId: typeof window !== 'undefined' ? 
    (localStorage.getItem('zenthra_session_id') || generateSessionId()) : 
    generateSessionId(),
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  incrementCartCount: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  decrementCartCount: () => set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),
}));

function generateSessionId(): string {
  const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  if (typeof window !== 'undefined') {
    localStorage.setItem('zenthra_session_id', sessionId);
  }
  return sessionId;
}
