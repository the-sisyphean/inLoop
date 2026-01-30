import { fs, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const modal = document.getElementById("postModal");
const addPostBtn = document.getElementById("addPostBtn");
const cancelPost = document.getElementById("cancelPost");
const publishPost = document.getElementById("publishPost");

const titleInput = document.getElementById("postTitle");
const contentInput = document.getElementById("postContent");

// open modal
addPostBtn.onclick = () => modal.classList.remove("hidden");


// close modal
cancelPost.onclick = () => modal.classList.add("hidden");

// publish post
publishPost.onclick = async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Title and content required");
    return;
  }

  await addDoc(
    collection(fs, "clubs", "coding-club", "posts"),
    {
      title,
      content,
      createdAt: serverTimestamp()
    }
  );

  modal.classList.add("hidden");
  titleInput.value = "";
  contentInput.value = "";

  loadPosts(); // 🔥 refresh feed
};


