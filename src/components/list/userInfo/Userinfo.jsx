import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore";
import { useState, useRef, useEffect } from "react";

const Userinfo = () => {

  const { currentUser, updateUserBio } = useUserStore();
  // Edit bio
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const bioEditRef = useRef(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    await updateUserBio(bio);
    setIsEditing(false);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (bioEditRef.current && !bioEditRef.current.contains(event.target)) {
      setIsEditing(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className='userInfo relative'>
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
        <div 
          ref={bioEditRef} 
          className="absolute left-0 right-0 top-full bg-gray-700 bg-opacity-90 border border-gray-600 p-3 shadow-lg z-10"
        >
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter your bio"
            maxLength={100}
            className="w-full min-h-[100px] p-2 bg-gray-800  bg-opacity-50 text-white border border-gray-600 rounded-md mb-2 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={handleSaveClick}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


export default Userinfo