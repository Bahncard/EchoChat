import { create } from "zustand";
import { useUserStore } from "./userStore";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase"; 
export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  sharedPhotos: [],
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // CHECK IF CURRENT USER IS BLOCKED
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // CHECK IF RECEIVER IS BLOCKED
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },

  // FETCH SHARED PHOTOS

  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
      sharedPhotos: [],
    });
  },


fetchSharedPhotos: async () => {
  const { user } = useChatStore.getState();
  const currentUser = useUserStore.getState().currentUser;
  console.log("Fetching shared photos for:", user, currentUser); // 添加日志
  if (!user || !currentUser) return;

  const q = query(
    collection(db, "sharedPhotos"),
    where("userId", "==", currentUser.id),
    where("sharedWith", "array-contains", user.id)
  );

  const querySnapshot = await getDocs(q);
  const photos = querySnapshot.docs.map(doc => doc.data());
  console.log("Fetched photos:", photos); // 添加日志
  set({ sharedPhotos: photos });
},

sharePhoto: async (photoUrl) => {
  const { user } = useChatStore.getState();
  const currentUser = useUserStore.getState().currentUser;
  console.log("Sharing photo:", photoUrl, user, currentUser); // 添加日志
  if (!user || !currentUser) return;

  try {
    await addDoc(collection(db, "sharedPhotos"), {
      userId: currentUser.id,
      photoUrl,
      sharedWith: [user.id],
      createdAt: new Date()
    });
    console.log("Photo shared successfully"); // 添加日志
    useChatStore.getState().fetchSharedPhotos();
  } catch (error) {
    console.error("Error sharing photo:", error); // 添加错误日志
  }
},
}));
