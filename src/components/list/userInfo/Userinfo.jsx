import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {auth} from '../../../lib/firebase'
import useClickOutside from "../../../hooks/useClickOutside"
const Userinfo = () => {

  const navigate = useNavigate();

  const { currentUser, updateUserBio } = useUserStore();
  // Edit bio
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
 
  // More menu: Logout, Settings, Delete Account
  const [showMenu, setShowMenu] = useState(false);
 
  // Get the ref of the menu and bio edit with useClickOutside hook
  const menuRef = useClickOutside(() => setShowMenu(false));
  const bioEditRef = useClickOutside(() => setIsEditing(false));

  const handleMoreClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = async () => {
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
          console.log(error)
        });
};


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    await updateUserBio(bio);
    setIsEditing(false);
  };



  return (
    <div className='userInfo relative'>
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt=""  onClick={handleMoreClick}/>
          {showMenu && (
            <div 
              ref={menuRef}
              className="absolute right-0 mt-2 w-48 bg-gray-700 bg-opacity-90 border border-gray-600 rounded-md shadow-lg z-20"
            >
              <ul>
                <li 
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                  onClick={handleLogout}
                >
                  Log out
                </li>
                <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white">
                  Settings
                </li>
              </ul>
            </div>
          )}
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