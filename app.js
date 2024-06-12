// app.js
import { auth, db } from './firebase-config.js';

let currentUser = null;
let currentFriend = null;

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        loadProfile();
        loadFriends();
        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
    } else {
        currentUser = null;
        document.getElementById('login').style.display = 'block';
        document.getElementById('chat').style.display = 'none';
    }
});

function login() {
    const phoneNumber = document.getElementById('phone-number').value;
    const password = document.getElementById('password').value;

    const email = `${phoneNumber}@nchat.com`;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Logged in
        })
        .catch(error => {
            if (error.code === 'auth/user-not-found') {
                // Create new user
                auth.createUserWithEmailAndPassword(email, password)
                    .then(userCredential => {
                        // User created and logged in
                    })
                    .catch(error => {
                        console.error("Error creating user: ", error);
                    });
            } else {
                console.error("Error logging in: ", error);
            }
        });
}

function logout() {
    auth.signOut();
}

function addFriend() {
    const friendPhone = document.getElementById('friend-phone').value;
    if (friendPhone) {
        db.collection('users').doc(currentUser.uid).collection('friends').doc(friendPhone).set({
            phone: friendPhone
        }).then(() => {
            loadFriends();
        }).catch(error => {
            console.error("Error adding friend: ", error);
        });
    }
}

function loadFriends() {
    const friendList = document.getElementById('friend-list');
    friendList.innerHTML = '';
    db.collection('users').doc(currentUser.uid).collection('friends').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const friendPhone = doc.data().phone;
            const li = document.createElement('li');
            li.textContent = friendPhone;
            li.onclick = () => selectFriend(friendPhone);
            friendList.appendChild(li);
        });
    });
}

function selectFriend(friendPhone) {
    currentFriend = friendPhone;
    document.getElementById('chat-with').innerText = `Chat with: ${friendPhone}`;
    loadMessages();
}

function loadMessages() {
    const messages = document.getElementById('messages');
    messages.innerHTML = '';
    db.collection('chats').doc(currentUser.uid).collection(currentFriend).orderBy('timestamp').onSnapshot(querySnapshot => {
        messages.innerHTML = '';
        querySnapshot.forEach(doc => {
            const message = doc.data().message;
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messages.appendChild(messageElement);
        });
        messages.scrollTop = messages.scrollHeight;
    });
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message && currentFriend) {
        db.collection('chats').doc(currentUser.uid).collection(currentFriend).add({
            message: `${currentUser.phoneNumber}: ${message}`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        db.collection('chats').doc(currentFriend).collection(currentUser.uid).add({
            message: `${currentUser.phoneNumber}: ${message}`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = '';
    }
}

function sendFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file && currentFriend) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`files/${currentUser.uid}/${file.name}`);
        fileRef.put(file).then(() => {
            fileRef.getDownloadURL().then(url => {
                db.collection('chats').doc(currentUser.uid).collection(currentFriend).add({
                    message: `${currentUser.phoneNumber} sent a file: ${url}`,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                db.collection('chats').doc(currentFriend).collection(currentUser.uid).add({
                    message: `${currentUser.phoneNumber} sent a file: ${url}`,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        });
    }
}

function loadProfile() {
    document.getElementById('user-phone').innerText = currentUser.phoneNumber;
    db.collection('users').doc(currentUser.uid).get().then(doc => {
        if (doc.exists) {
            document.getElementById('user-name').innerText = doc.data().name;
        }
    });
}

function updateProfile() {
    const name = document.getElementById('profile-name').value;
    if (name) {
        db.collection('users').doc(currentUser.uid).set({
            name: name
        }, { merge: true }).then(() => {
            loadProfile();
        });
    }
}

function setProfilePicture() {
    const fileInput = document.getElementById('profile-pic');
    const file = fileInput.files[0];
    if (file) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`profile_pics/${currentUser.uid}/${file.name}`);
        fileRef.put(file).then(() => {
            fileRef.getDownloadURL().then(url => {
                db.collection('users').doc(currentUser.uid).set({
                    profilePic: url
                }, { merge: true }).then(() => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = 'Profile Picture';
                    document.getElementById('profile').appendChild(img);
                });
            });
        });
    }
}
