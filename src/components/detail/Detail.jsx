import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";

const Detail = () => {
  const [isPhotosExpanded, setIsPhotosExpanded] = useState(false);
  const [isSettingExpanded, setIsSettingExpaned] = useState(false);
  const togglePhotos = () => {
    setIsPhotosExpanded(!isPhotosExpanded);
  };
  const toggleSetting =() => {
    setIsSettingExpaned(!isSettingExpanded);
  }

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat, sharedPhotos,fetchSharedPhotos } =
    useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (user) {
      console.log("Fetching shared photos for user:", user); // 添加日志
      fetchSharedPhotos();
    }
  }, [user, fetchSharedPhotos]);
  
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat()
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img 
            src={isSettingExpanded ? "./arrowUp.png" : "./arrowDown.png"} 
            alt=""
            onClick={toggleSetting} />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
          <img 
            src={isPhotosExpanded ? "./arrowUp.png" : "./arrowDown.png"} 
            alt={isPhotosExpanded ? "Collapse" : "Expand"} 
             onClick={togglePhotos}
          />
          </div>
          {isPhotosExpanded && (
          <div className="photos">
            {/* <div className="photoItem">
              <div className="photoDetail">
                <img
                  src=""
                  alt=""
                />
                <span>photo.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div> */}
              {sharedPhotos.map((photo, index) => (
                <div className="photoItem" key={index}>
                  <div className="photoDetail">
                    <img
                      src={photo.photoUrl}
                      alt=""
                    />
                    <span>{`Photo ${index + 1}`}</span>
                  </div>
                  <img src="./download.png" alt="" className="icon" />
                </div>
              ))}
          </div>
          )}
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
