
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function getBlogs() {
  return JSON.parse(localStorage.getItem("blogs")) || [];
}

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

// Change pages
function showPage(pageName) {
  let pages = document.querySelectorAll(".page");

  pages.forEach(function(page) {
    page.classList.add("hidden");
  });

  document.getElementById(pageName).classList.remove("hidden");

  if (pageName === "home") {
    displayBlogs();
  }

  if (pageName === "dashboard") {
    displayMyBlogs();
  }
}

// Register
function register(event) {
  event.preventDefault();

  let name = document.getElementById("registerName").value;
  let email = document.getElementById("registerEmail").value;
  let password = document.getElementById("registerPassword").value;

  let users = getUsers();

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      document.getElementById("registerMessage").textContent =
        "Email already registered!";
      return;
    }
  }

  let user = {
    name: name,
    email: email,
    password: password
  };

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("registerMessage").textContent =
    "Registration successful! Please login.";

  event.target.reset();
}

// Login
function login(event) {
  event.preventDefault();

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let users = getUsers();
  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email &&
        users[i].password === password) {
      foundUser = users[i];
      break;
    }
  }

  if (foundUser) {
    localStorage.setItem("currentUser", email);

    document.getElementById("loginMessage").textContent =
      "Login successful!";

    event.target.reset();
    showPage("dashboard");
  } else {
    document.getElementById("loginMessage").textContent =
      "Invalid email or password!";
  }
}

// Create a blog
function createBlog(event) {
  event.preventDefault();

  let email = getCurrentUser();

  if (!email) {
    document.getElementById("blogMessage").textContent =
      "Please login before creating a blog.";
    return;
  }

  let title = document.getElementById("blogTitle").value;
  let content = document.getElementById("blogContent").value;

  let users = getUsers();
  let author = "";

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      author = users[i].name;
    }
  }

  let blog = {
    title: title,
    content: content,
    author: author,
    email: email
  };

  let blogs = getBlogs();
  blogs.unshift(blog);

  localStorage.setItem("blogs", JSON.stringify(blogs));

  document.getElementById("blogMessage").textContent =
    "Blog published successfully!";

  event.target.reset();
  displayBlogs();
}

// Show all blogs on Home
function displayBlogs() {
  let blogs = getBlogs();
  let blogList = document.getElementById("blogList");

  blogList.innerHTML = "";

  if (blogs.length === 0) {
    blogList.textContent = "No blogs yet. Be the first to publish!";
    return;
  }

  blogs.forEach(function(blog) {
    let card = document.createElement("div");
    card.className = "blog-card";

    let title = document.createElement("h3");
    title.textContent = blog.title;

    let content = document.createElement("p");
    content.textContent = blog.content;

    let author = document.createElement("small");
    author.textContent = "Written by " + blog.author;

    card.appendChild(title);
    card.appendChild(content);
    card.appendChild(author);

    blogList.appendChild(card);
  });
}

// Show logged-in user's blogs
function displayMyBlogs() {
  let email = getCurrentUser();
  let users = getUsers();
  let blogs = getBlogs();

  let welcome = document.getElementById("welcomeMessage");
  let myBlogs = document.getElementById("myBlogs");

  myBlogs.innerHTML = "";

  if (!email) {
    welcome.textContent = "Please login first.";
    return;
  }

  let name = "User";

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      name = users[i].name;
    }
  }

  welcome.textContent = "Welcome, " + name + "!";

  let found = false;

  blogs.forEach(function(blog) {
    if (blog.email === email) {
      found = true;

      let card = document.createElement("div");
      card.className = "blog-card";

      let title = document.createElement("h3");
      title.textContent = blog.title;

      let content = document.createElement("p");
      content.textContent = blog.content;

      card.appendChild(title);
      card.appendChild(content);
      myBlogs.appendChild(card);
    }
  });

  if (!found) {
    myBlogs.textContent = "You have not created any blogs yet.";
  }
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");

  document.getElementById("loginMessage").textContent = "";
  document.getElementById("blogMessage").textContent = "";

  showPage("home");
}

// Show Home when the application opens
showPage("home");
