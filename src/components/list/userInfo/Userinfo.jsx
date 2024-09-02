import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore";
import { useState } from "react";

const Userinfo = () => {

  const { currentUser, updateUserBio } = useUserStore();
  // Edit bio
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    await updateUserBio(bio);
    setIsEditing(false);
  };


  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" onClick={handleEditClick} />
      </div>
      {isEditing && (
        <div className="bioEditPanel">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter your bio"
            maxLength={100}
          />
          <div className="bioEditButtons">
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Userinfo