// ==================== Firebase 설정 ====================
const firebaseConfig = {
  apiKey: "여기에_너의_apiKey_입력",
  authDomain: "my-free-chat01.firebaseapp.com",
  projectId: "my-free-chat01",
  storageBucket: "my-free-chat01.appspot.com",
  messagingSenderId: "xxxxxxxxxx",
  appId: "1:xxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 익명 로그인
auth.signInAnonymously().catch(err => console.error("로그인 오류:", err));

// 실시간 채팅 표시
const messagesRef = db.collection("messages").orderBy("timestamp");

messagesRef.onSnapshot(snapshot => {
  const messagesDiv = document.getElementById("chat-messages");
  messagesDiv.innerHTML = "";
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const isMe = data.uid === auth.currentUser?.uid;
    
    const div = document.createElement("div");
    div.className = `message ${isMe ? 'me' : 'other'}`;
    div.innerHTML = `
      <strong>${isMe ? '나' : '누군가'}:</strong> ${data.text}<br>
      <small>${new Date(data.timestamp?.toDate()).toLocaleTimeString('ko-KR')}</small>
    `;
    messagesDiv.appendChild(div);
  });
  
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// 메시지 보내기
document.getElementById("message-form").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("message-input");
  
  if (!input.value.trim()) return;
  
  db.collection("messages").add({
    text: input.value.trim(),
    uid: auth.currentUser.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    input.value = "";
  });
});
