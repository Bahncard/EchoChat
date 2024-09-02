import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, collection, query, where, getDocs  } from "firebase/firestore";
import upload from "../../lib/upload";
 

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

const [loginLoading, setLoginLoading] = useState(false);
const [registerLoading, setRegisterLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setRegisterLoading(true);
  //   const formData = new FormData(e.target);

  //   const { username, email, password } = Object.fromEntries(formData);

  //   // VALIDATE INPUTS
  //   if (!username || !email || !password)
  //     return toast.warn("Please enter inputs!");
  //   if (!avatar.file) return toast.warn("Please upload an avatar!");

  //   // VALIDATE UNIQUE USERNAME
  //   const usersRef = collection(db, "users");
  //   const q = query(usersRef, where("username", "==", username));
  //   const querySnapshot = await getDocs(q);
  //   if (!querySnapshot.empty) {
  //     return toast.warn("Select another username");
  //   }

  //   try {
  //     const res = await createUserWithEmailAndPassword(auth, email, password);

  //     const imgUrl = await upload(avatar.file);

  //     await setDoc(doc(db, "users", res.user.uid), {
  //       username,
  //       email,
  //       avatar: imgUrl,
  //       id: res.user.uid,
  //       blocked: [],
  //     });

  //     await setDoc(doc(db, "userchats", res.user.uid), {
  //       chats: [],
  //     });

  //     toast.success("Account created! You can login now!");
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err.message);
  //   } finally {
  //     setRegisterLoading(false);
  //   }
  // };

  const handleRegister = async (e) => {
  e.preventDefault();
  setRegisterLoading(true);
  console.log("Registration process started");

  const formData = new FormData(e.target);
  const { username, email, password } = Object.fromEntries(formData);

  try {
    // VALIDATE INPUTS
    if (!username || !email || !password) {
      throw new Error("Please enter all inputs");
    }
    if (!avatar.file) {
      throw new Error("Please upload an avatar");
    }
    console.log("Input validation passed");

    // VALIDATE UNIQUE USERNAME
    console.log("Checking username uniqueness");
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("Username already exists");
    }
    console.log("Username is unique");

    // CREATE USER
    console.log("Creating user account");
    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User account created", res.user.uid);

    //UPLOAD AVATAR
    console.log("Uploading avatar");
    const imgUrl = await upload(avatar.file);
    console.log("Avatar uploaded", imgUrl);

    // STORE USER DATA
    console.log("Storing user data");
    await setDoc(doc(db, "users", res.user.uid), {
      username,
      email,
      avatar: imgUrl,
      id: res.user.uid,
      blocked: [],
    });
    console.log("User data stored");

    console.log("Creating user chats document");
    await setDoc(doc(db, "userchats", res.user.uid), {
      chats: [],
    });
    console.log("User chats document created");

    toast.success("Account created! You can login now!");
    console.log("Registration process completed successfully");
  } catch (err) {
    console.error("Registration error:", err);
    toast.error(err.message);
  } finally {
    setRegisterLoading(false);
    console.log("Registration process ended");
  }
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

  try {
    console.log("Attempting to sign in with email:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Sign in successful", userCredential.user);
    toast.success("Logged in successfully!");
    // 这里可以添加登录成功后的逻辑，比如重定向到主页
  } catch (err) {
    console.error("Login error:", err);
    toast.error(err.message || "Login failed");
  } finally {
    setLoginLoading(false);
  }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loginLoading}>{loginLoading ? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={registerLoading}>{registerLoading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
