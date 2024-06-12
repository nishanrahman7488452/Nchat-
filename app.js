// Function to handle login
function login() {
    // Placeholder for login logic
    showChatApp();
}

// Function to show chat app
function showChatApp() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("chat-app").style.display = "block";
    navigate('newsfeed'); // Initially navigate to the news feed section
}

// Function to navigate between sections
function navigate(section) {
    // Hide all sections
    const sections = ["newsfeed", "profile", "messages", "friends", "settings"];
    sections.forEach(s => {
        document.getElementById(s + "-section").style.display = "none";
    });

    // Show the selected section
    document.getElementById(section + "-section").style.display = "block";

    // Load content dynamically based on section
    switch (section) {
        case 'newsfeed':
            loadNewsFeed();
            break;
        case 'profile':
            loadProfile();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'friends':
            loadFriends();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Function to handle logout
function logout() {
    // Placeholder for logout logic
    location.reload(); // For now, let's just reload the page to simulate logout
}

// Function to show signup form
function showSignupForm() {
    // Placeholder for showing signup form
}

// Placeholder functions to load content for each section
function loadNewsFeed() {
    // Placeholder for loading news feed content
}

function loadProfile() {
    // Placeholder for loading profile content
}

function loadMessages() {
    // Placeholder for loading messages content
}

function loadFriends() {
    // Placeholder for loading friends content
}

function loadSettings() {
    // Placeholder for loading settings content
}

// Function to load chat with a friend
function loadChatWithFriend(friend) {
    document.getElementById("chat-username").textContent = friend.username;
    document.getElementById("chat-profile-pic").src = friend.profilePic;
    // Load chat messages between you and the friend
    // Populate the chat-messages div with chat history
}

// Function to send a message
function sendMessage() {
    const message = document.getElementById("chat-message").value;
    // Send the message to the friend
    // Update the chat-messages div with the sent message
    document.getElementById("chat-message").value = ""; // Clear the input field after sending
}

// Function to send a file
function sendFile() {
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];
    // Send the file to the friend
    // Update the chat-messages div with the sent file information
    fileInput.value = ""; // Clear the file input field after sending
}

// Function to search for friends
function searchFriends() {
    const searchQuery = document.getElementById("search-friends-input").value;
    // Perform a search for friends based on the search query
    // Update the friend-list div with search results
}
// Function to handle logout
function logout() {
    // Placeholder for logout logic
    // Here, you can clear any session data, redirect the user to the login page, etc.
    // For example:
    // Clear any stored user data
    localStorage.removeItem('user');
    // Redirect the user to the login page
    window.location.href = 'login.html';
}
