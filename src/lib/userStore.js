import { doc, getDoc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      return set({ currentUser: null, isLoading: false });
    }
  },


updateUserBio: async (bio) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, { bio });
      set((state) => ({ currentUser: { ...state.currentUser, bio } }));
    } catch (err) {
      console.log(err);
    }
  },
    
}));
