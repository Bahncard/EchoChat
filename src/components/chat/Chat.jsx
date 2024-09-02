import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";

const Chat = () => {
  const [chat, setChat] = useState();
    const [isLoading, setIsLoading] = useState(true);
  //State of the emoji picker
  const [open, setOpen] = useState(false);
  //State of the text input
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, sharePhoto } =
    useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    if (chat?.messages?.length) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  useEffect(() => {
    setIsLoading(true);
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      if (doc.exists()) {
        setChat(doc.data());
      } else {
        // 如果聊天不存在，创建一个新的
        initializeChat();
      }
      setIsLoading(false);
    });

    
  const initializeChat = async () => {
    try {
      await setDoc(doc(db, "chats", chatId), { messages: [] });
      setChat({ messages: [] });
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };


    return () => unSub();
  }, [chatId]);
  /**
   * Concatenate the emoji to the text input once the user clicks on an emoji
   * Set the open state to false to close the emoji picker
   */

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "" && !img.file ) return;

    // let imgUrl = null;

    // try {
    //   if (img.file) {
    //     imgUrl = await upload(img.file);
    //   }
    //   //Send Image message

    //   await updateDoc(doc(db, "chats", chatId), {
    //     messages: arrayUnion({
    //       senderId: currentUser.id,
    //       text,
    //       createdAt: new Date(),
    //       ...(imgUrl && { img: imgUrl }),
    //     }),
    //   });

    //   // If the message contains an image, add it to the shared photos
    //   if (imgUrl) {
    //     await sharePhoto(imgUrl);
    //   }
       try {
      if (img.file) {
        const imgUrl = await upload(img.file);
        // Send Image message
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            img: imgUrl,
            createdAt: new Date(),
          }),
        });

        // Call sharePhoto function
        await sharePhoto(imgUrl);
      }

      if (text !== "") {
        // Send Text message
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text,
            createdAt: new Date(),
          }),
        });
      }

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally{
    setImg({
      file: null,
      url: "",
    });

    setText("");
    }
  };

  if (isLoading) {
    return <div>Loading chat...</div>;
  }

  if (!chat) {
    return <div>No chat data available. Please try again.</div>;
  }

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{user?.bio|| "No bio set"}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message?.createdAt.toMillis()}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>{format(message.createdAt.toDate())}</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      {/* Icons: File upload, camera...;  Text input  */}
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
