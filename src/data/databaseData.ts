export interface CodeFile {
  filename: string;
  language: 'javascript' | 'dart' | 'html' | 'css' | 'json' | 'shell' | 'yaml' | 'c' | 'cpp' | 'python' | 'java';
  code: string;
  description?: string;
}

export interface Experiment {
  id: string;
  subject: 'fsd' | 'flutter' | 'cn' | 'dwdm' | 'custom' | 'temporary';
  subjectTitle: string;
  labNumber: string;
  title: string;
  category: string;
  description: string;
  objectives?: string[];
  steps?: string[];
  commands?: string[];
  files: CodeFile[];
  outputDescription?: string;
  voiceExplanation?: string;
  references?: string[];
  // Temporary database fields
  isTemporary?: boolean;
  expiresAt?: number; // Unix timestamp in milliseconds when this item will automatically disappear
  createdAt?: number; // Creation timestamp
}

export const LAB_SUBJECTS = [
  { id: 'all', name: 'All Database Files', count: 66 },
  { id: 'temporary', name: '⏳ Temporary Database', count: 0 },
  { id: 'dwdm', name: 'Data Mining & Warehousing (DWDM)', count: 14 },
  { id: 'cn', name: 'Computer Networks (CN)', count: 10 },
  { id: 'fsd', name: 'Full Stack Development 2 (MERN)', count: 24 },
  { id: 'flutter', name: 'UI Design using Flutter & Dart', count: 18 },
  { id: 'custom', name: 'Custom Uploads', count: 0 },
];

export const INITIAL_EXPERIMENTS: Experiment[] = [
  // ==================== FSD-2 EXPERIMENTS ====================
  {
    id: 'fsd-1a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 1.a',
    category: 'Express JS',
    title: 'Express JS – Routing, Route Parameters, Query Parameters & URL Building',
    description: 'Defines Express HTTP routes with basic GET endpoints, dynamic route parameters (:bookId), query parameters (?title=&author=), and dynamic redirection.',
    objectives: [
      'Define basic Express routes',
      'Extract dynamic route parameters using req.params',
      'Process query parameters using req.query',
      'Demonstrate res.redirect for dynamic URL generation'
    ],
    commands: [
      'npm init -y',
      'npm i express',
      'node app.js'
    ],
    steps: [
      'Initialize Node project using npm init',
      'Install Express framework via npm i express',
      'Create app.js and configure route handlers',
      'Start the server with node app.js and test in browser or Postman'
    ],
    files: [
      {
        filename: 'app.js',
        language: 'javascript',
        code: `const express = require('express');
const app = express();
const port = 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Book API!');
});

// Route with route parameters
app.get('/books/:bookId', (req, res) => {
  console.log(req.params);
  const bookId = req.params.bookId;
  res.send(\`You requested details for book ID: \${bookId}\`);
});

// Route with query parameters
app.get('/search', (req, res) => {
  console.log(req.query);
  const { title, author } = req.query;
  res.send(
    \`Searching for books\${title ? \` with title: \${title}\` : ''}\${
      author ? \` by author: \${author}\` : ''
    }\`
  );
});

// Route that builds a dynamic URL
app.get('/redirect-to-book/:bookId', (req, res) => {
  const bookId = req.params.bookId;
  const url = \`/books/\${bookId}\`;
  console.log(url);
  res.redirect(url);
});

app.listen(port, () => {
  console.log(\`Server listening at http://localhost:\${port}\`);
});`
      }
    ],
    outputDescription: 'GET http://localhost:3000/ returns "Welcome to the Book API!". /books/42 returns "You requested details for book ID: 42". /search?title=Node returns searched results.',
    voiceExplanation: 'This experiment demonstrates fundamental routing in Express JS. It covers standard GET routes, extracting route parameters with req.params.bookId, handling query strings via req.query, and dynamic redirection using res.redirect.'
  },
  {
    id: 'fsd-1b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 1.b',
    category: 'Express JS',
    title: 'Express JS – CRUD Operations with HTTP Methods (GET, POST, DELETE)',
    description: 'Implement an in-memory REST API to accept data (POST), retrieve all and single records (GET), and delete a specified resource (DELETE) using standard HTTP methods.',
    commands: [
      'npm init -y',
      'npm i express',
      'node crud.js'
    ],
    files: [
      {
        filename: 'crud.js',
        language: 'javascript',
        code: `const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let data = [
  {
    userId: 1,
    firstName: "vamsi",
    lastName: "Korrapolu",
    phoneNo: 7123123872,
    email: "vamsi@gmail.com"
  },
  {
    userId: 2,
    firstName: "kishore",
    lastName: "Raj",
    phoneNo: 8787128311,
    email: "kishore@gmail.com"
  },
  {
    userId: 3,
    firstName: "Ram",
    lastName: "Nandhan",
    phoneNo: 8734128311,
    email: "ram@gmail.com"
  }
];

// Read all users
app.get("/users", (req, res) => {
  res.status(200).json(data);
});

// Read single user by ID
app.get("/users/:userid", (req, res) => {
  const userId = Number(req.params.userid);
  const user = data.find((item) => item.userId === userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json(user);
});

const isAlreadyPresent = (id) => {
  const index = data.findIndex((item) => item.userId === id);
  return index !== -1;
};

// Create a new user
app.post("/users/addUser", (req, res) => {
  const body = req.body;
  if (isAlreadyPresent(body.userId)) {
    return res.status(400).json({ error: "User already exists" });
  }
  data.push(body);
  res.status(201).json({ message: "Created successfully." });
});

// Delete a user
app.delete("/users/deleteUser/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  if (isAlreadyPresent(userId)) {
    data = data.filter((item) => item.userId !== userId);
    return res.status(200).json({ message: "User deleted" });
  }
  return res.status(404).json({ message: "Unable to delete user due to not found." });
});

app.listen(port, () => {
  console.log(\`Server listening at http://localhost:\${port}\`);
});`
      }
    ],
    outputDescription: 'Returns JSON array of users on GET /users, single user on GET /users/1, 201 Created on POST /users/addUser, and 200 OK on DELETE /users/deleteUser/2.',
    voiceExplanation: 'This experiment implements basic CRUD operations using Express. It shows how to retrieve data with GET, insert with POST and validation, and remove with DELETE using express.json middleware.'
  },
  {
    id: 'fsd-1c',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 1.c',
    category: 'Express JS',
    title: 'Express JS – Middleware Interception & Token Authentication',
    description: 'Demonstrates middleware functionality in Express by intercepting client requests, verifying headers for a secret key, and protecting private endpoints.',
    commands: [
      'npm init -y',
      'npm i express',
      'node middleware.js'
    ],
    files: [
      {
        filename: 'middleware.js',
        language: 'javascript',
        code: `const express = require('express');
const app = express();

// Simple authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['secret'];
  if (authHeader === 'mysecretkey') {
    next(); // Token is valid, proceed to the route handler
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Protected Route (requires authentication middleware)
app.get('/secure', authenticate, (req, res) => {
  res.send('You have access to the secure route!');
});

// Public Route (accessible by anyone)
app.get('/', (req, res) => {
  res.send('Welcome to the public route!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`
      }
    ],
    outputDescription: 'GET /secure without secret header yields 401 Unauthorized. With header "secret: mysecretkey", it returns "You have access to the secure route!".',
    voiceExplanation: 'Middleware functions act as an intermediary layer. They can inspect headers, log requests, or enforce security before the final route handler executes.'
  },
  {
    id: 'fsd-2a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 2.a',
    category: 'Express JS',
    title: 'Express JS – Templating Engine using EJS',
    description: 'Configures EJS (Embedded JavaScript) templating engine in Express to dynamically inject server-side user data into HTML views.',
    commands: [
      'npm init -y',
      'npm i express ejs',
      'node template.js'
    ],
    files: [
      {
        filename: 'template.js',
        language: 'javascript',
        code: `const express = require('express');
const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define a route
app.get('/', (req, res) => {
  const user = {
    name: "Iswarya",
    course: "Computer Science",
    college: "ABC University"
  };

  // Render index.ejs with user data
  res.render('index', { user: user });
});

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});`
      },
      {
        filename: 'views/index.ejs',
        language: 'html',
        code: `<!DOCTYPE html>
<html>
<head>
  <title>Welcome Page</title>
</head>
<body>
  <h1>Welcome <%= user.name %>!</h1>
  <p>You are studying <strong><%= user.course %></strong> at <strong><%= user.college %></strong>.</p>
</body>
</html>`
      }
    ],
    outputDescription: 'Browser shows dynamically generated HTML greeting: "Welcome Iswarya! You are studying Computer Science at ABC University."',
    voiceExplanation: 'EJS allows combining static HTML markup with dynamic JavaScript variables using <%= variable %> tags rendered on the server.'
  },
  {
    id: 'fsd-2b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 2.b',
    category: 'Express JS',
    title: 'Express JS – HTML Form Data Handling with Body Parser',
    description: 'Processes HTML form submissions using body-parser urlencoded middleware and renders result views via EJS templating.',
    commands: [
      'npm init -y',
      'npm i express ejs body-parser',
      'node twoB.js'
    ],
    files: [
      {
        filename: 'twoB.js',
        language: 'javascript',
        code: `const express = require('express');
const bodyParser = require("body-parser");
const twoB = express();

twoB.set('view engine', 'ejs');
twoB.use(bodyParser.urlencoded({ extended: true }));

// Display Form
twoB.get('/', (req, res) => {
  res.render('forms');
});

// Process Form Submission
twoB.post('/submit', (req, res) => {
  const { name, email } = req.body;
  res.render('success', { name, email });
});

twoB.listen(4000, (err) => {
  if (err) console.log(err);
  console.log('Server running on http://localhost:4000');
});`
      },
      {
        filename: 'views/forms.ejs',
        language: 'html',
        code: `<!DOCTYPE html>
<html>
<head>
  <title>Form Page</title>
</head>
<body>
  <h1>Submit Your Info</h1>
  <form action="/submit" method="POST">
    <label>Name: <input type="text" name="name" required></label><br><br>
    <label>Email: <input type="email" name="email" required></label><br><br>
    <button type="submit">Submit</button>
  </form>
</body>
</html>`
      },
      {
        filename: 'views/success.ejs',
        language: 'html',
        code: `<!DOCTYPE html>
<html>
<head>
  <title>Success</title>
</head>
<body>
  <h2>Thanks, <%= name %>!</h2>
  <p>We've received your email: <%= email %></p>
</body>
</html>`
      }
    ],
    outputDescription: 'Form allows entering Name and Email. Upon submitting POST /submit, renders the success page with personalized confirmation.',
    voiceExplanation: 'Form data handling requires body-parser urlencoded middleware to populate req.body from HTML form fields.'
  },
  {
    id: 'fsd-3a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 3.a',
    category: 'Express JS',
    title: 'Express JS – Session Management using Express-Session & Cookies',
    description: 'Manages user sessions on the server side using express-session and client-side session cookie tracking.',
    commands: [
      'npm init -y',
      'npm i express express-session',
      'node app.js'
    ],
    files: [
      {
        filename: 'app.js',
        language: 'javascript',
        code: `const express = require('express');
const sessionrouter = require('./routes/sessionroutes');

const app = express();
app.use(express.json());
app.use('/', [sessionrouter]);

app.listen(3020, function () {
  console.log('Server is up and running on port 3020...');
});

module.exports = app;`
      },
      {
        filename: 'routes/sessionroutes.js',
        language: 'javascript',
        code: `const express = require('express');
const session = require('express-session');
const sessionrouterapp = express.Router();

// Setup session middleware
sessionrouterapp.use(session({
  secret: 'your-secret-key', // Used to sign the session ID cookie
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 15, // Lifespan: 15 mins
    httpOnly: true,
    secure: false
  }
}));

// Route to create session
sessionrouterapp.post('/login', (req, res) => {
  const username = req.body.username;
  if (username) {
    req.session.username = username;
    res.send(\`Session started for \${username}\`);
  } else {
    res.status(400).send('Username required');
  }
});

// Route to access session
sessionrouterapp.get('/dashboard', (req, res) => {
  if (req.session.username) {
    res.send(\`Welcome back, \${req.session.username}\`);
  } else {
    res.status(401).send('Please log in');
  }
});

// Route to destroy session (logout)
sessionrouterapp.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout error');
    res.clearCookie('connect.sid');
    res.send('Logged out successfully');
  });
});

module.exports = sessionrouterapp;`
      }
    ],
    outputDescription: 'POST /login sets session cookie connect.sid. GET /dashboard returns user greeting. POST /logout deletes session and clears cookie.',
    voiceExplanation: 'Sessions keep user state on the server while the browser stores a signed unique cookie identifier called connect.sid.'
  },
  {
    id: 'fsd-3b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 3.b',
    category: 'Express JS',
    title: 'Express JS – User Authentication with Bcrypt Password Hashing',
    description: 'Secure registration, bcrypt password hashing, login credential verification, and route protection using express-session.',
    commands: [
      'npm init -y',
      'npm i express express-session bcrypt',
      'node app.js'
    ],
    files: [
      {
        filename: 'app.js',
        language: 'javascript',
        code: `const express = require('express');
const sessionrouter = require('./routes/sessionroutes');
const authrouter = require('./authrouter');

const app = express();
app.use(express.json());
app.use('/', [sessionrouter, authrouter]);

app.listen(3020, function () {
  console.log('Server is up and running on port 3020...');
});

module.exports = app;`
      },
      {
        filename: 'authrouter.js',
        language: 'javascript',
        code: `const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const authrouter = express.Router();

authrouter.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 } // 30 minutes
}));

const users = [];

// Registration
authrouter.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.send('User registered');
});

// Login
authrouter.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).send('User not found');
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).send('Invalid credentials');
  req.session.user = user.username;
  res.send('Login successful');
});

// Protected route
authrouter.get('/auth/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  res.send(\`Welcome, \${req.session.user}\`);
});

// Logout
authrouter.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error logging out');
    res.clearCookie('connect.sid');
    res.send('Logged out');
  });
});

module.exports = authrouter;`
      }
    ],
    outputDescription: 'Passwords hashed with salt rounds. Matching passwords authenticate into session and grant access to /auth/dashboard.',
    voiceExplanation: 'Bcrypt hashes user passwords before saving, and compares hashes on login without storing plaintext credentials.'
  },
  {
    id: 'fsd-4a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 4.a',
    category: 'MongoDB & Mongoose',
    title: 'Express JS & MongoDB – Database Connection with Mongoose & Schema Modeling',
    description: 'Connects Express to MongoDB database using Mongoose ODM, defines schema and models, and queries all documents.',
    commands: [
      'npm init -y',
      'npm i express mongoose dotenv',
      'node app.js'
    ],
    files: [
      {
        filename: 'app.js',
        language: 'javascript',
        code: `const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL || "mongodb://localhost:27017/dbconnect";

mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Database is connected successfully.");
  app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
  });
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

// Create Mongoose Model
const UserModel = mongoose.model("users", userSchema);

// Define route to get all users
app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});`
      },
      {
        filename: '.env',
        language: 'shell',
        code: `PORT=8000
MONGO_URL="mongodb://localhost:27017/dbconnect"`
      }
    ],
    outputDescription: 'Outputs "Database is connected successfully. Server is running on port 8000". GET /getUsers returns MongoDB documents.',
    voiceExplanation: 'Mongoose provides schema-based modeling for MongoDB with type checking, built-in validation, and query promises.'
  },
  {
    id: 'fsd-4b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 4.b',
    category: 'Full Stack MERN',
    title: 'Single Page Application (SPA) using Express REST API & React Frontend',
    description: 'Full stack student roster application connecting an Express backend API with CORS to a Vite React frontend table using Axios and useEffect.',
    commands: [
      '# Backend Terminal:',
      'npm i express cors',
      'node app.js',
      '# Frontend Terminal:',
      'npm create vite@latest vite-project -- --template react',
      'cd vite-project',
      'npm install axios',
      'npm run dev'
    ],
    files: [
      {
        filename: 'backend/app.js',
        language: 'javascript',
        code: `const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const data = [
  { id: 1, name: "John Doe", age: 20, grade: "A" },
  { id: 2, name: "Jane Smith", age: 21, grade: "B" },
  { id: 3, name: "Bob Johnson", age: 19, grade: "A" },
  { id: 4, name: "Alice Brown", age: 22, grade: "C" },
  { id: 5, name: "Mike Davis", age: 20, grade: "B" },
  { id: 6, name: "Emily Taylor", age: 21, grade: "A" }
];

app.use(cors());

app.get('/getStudentData', (req, res) => {
  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(\`Backend API listening on port \${port}\`);
});`
      },
      {
        filename: 'frontend/src/App.jsx',
        language: 'javascript',
        code: `import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  const getData = () => {
    axios.get("http://localhost:3000/getStudentData")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container">
      <h2>Student Roster (SPA)</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;`
      }
    ],
    outputDescription: 'React frontend dynamically fetches student records via REST API on load and displays them in a neat responsive table.',
    voiceExplanation: 'This demonstrates client-server separation where an Express REST endpoint delivers JSON data consumed asynchronously by React.'
  },
  {
    id: 'fsd-5a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 5.a',
    category: 'React JS',
    title: 'React JS – Rendering HTML into Web Page',
    description: 'Fundamental React application setup in Vite rendering JSX structure and styled layout components to the root DOM.',
    commands: [
      'npm create vite@latest reactjs -- --template react',
      'cd reactjs',
      'npm install',
      'npm run dev'
    ],
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <header className="heading">INTRODUCTION TO REACTJS</header>
      <br />
      <p>First Program</p>
      <div>
        Write a program to render HTML to a web page.
      </div>
    </div>
  );
}

export default App;`
      },
      {
        filename: 'src/App.css',
        language: 'css',
        code: `.container {
  background-color: #795548;
  padding: 24px;
  border-radius: 8px;
  color: #fff;
  font-family: sans-serif;
}
.heading {
  color: bisque;
  font-size: 24px;
  font-weight: bold;
}`
      }
    ],
    outputDescription: 'Renders a styled container with header "INTRODUCTION TO REACTJS" and content text.',
    voiceExplanation: 'React mounts the App component tree into the index.html root element using ReactDOM createRoot.'
  },
  {
    id: 'fsd-5b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 5.b',
    category: 'React JS',
    title: 'React JS – Writing Markup with JSX and Dynamic Expressions',
    description: 'Embeds dynamic JavaScript expressions, objects, mapping over arrays, and inline styling within JSX templates.',
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React from 'react';
import './App.css';

function App() {
  const user = {
    name: 'Vamsi',
    role: 'Backend Architect',
    interests: ['Streaming', 'Benchmarking', 'Design Patterns']
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Hello, {user.name} 👋</h1>
        <hr />
        <p>Your role: <strong>{user.role}</strong></p>
        <h2>Interests</h2>
        <ul>
          {user.interests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
        <footer style={{ marginTop: '12px', fontSize: '0.9em', color: '#555' }}>
          <p>Built with ❤️ using JSX</p>
        </footer>
      </div>
    </div>
  );
}

export default App;`
      },
      {
        filename: 'src/App.css',
        language: 'css',
        code: `.container {
  width: 100%;
  min-height: 250px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  width: 320px;
  background-color: #f1f5f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  color: #1e293b;
}`
      }
    ],
    outputDescription: 'Card shows "Hello, Vamsi 👋", role, and a bulleted list of interests mapped dynamically from the user object.',
    voiceExplanation: 'JSX allows embedding JavaScript expressions inside curly braces {} to render variables, map arrays, and compute values.'
  },
  {
    id: 'fsd-5c',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 5.c',
    category: 'React JS',
    title: 'React JS – Creating and Nesting Modular Components',
    description: 'Component architecture composing Header, Sidebar, Search, and Card components into a responsive dashboard layout.',
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Card from './components/Card';
import './App.css';

const App = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="container">
      <Header />
      <div className="wrapper">
        <Sidebar />
        <section className="main">
          {arr.map((item, index) => (
            <Card key={index} id={item} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default App;`
      },
      {
        filename: 'src/components/Header.jsx',
        language: 'javascript',
        code: `import React from 'react';
import Search from './Search';

const Header = () => {
  return (
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#2e7d32', color: '#fff' }}>
      <div>YouTube Clone</div>
      <Search />
      <div>Profile</div>
    </div>
  );
};

export default Header;`
      },
      {
        filename: 'src/components/Card.jsx',
        language: 'javascript',
        code: `import React from 'react';

const Card = ({ id }) => {
  return (
    <div style={{ backgroundColor: '#e2e8f0', padding: 20, margin: 10, borderRadius: 8, color: '#1e293b' }}>
      Card #{id}
    </div>
  );
};

export default Card;`
      }
    ],
    outputDescription: 'A multi-component layout displaying Header with Search bar, Sidebar navigation, and grid of reusable Card components.',
    voiceExplanation: 'React components let you split the UI into independent, reusable pieces, and think about each piece in isolation.'
  },
  {
    id: 'fsd-6a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 6.a',
    category: 'React JS',
    title: 'React JS – Working with Props and States (Mood Switcher App)',
    description: 'Interactive Mood Switcher displaying how parent state updates trigger child prop changes and dynamic re-renders.',
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React, { useState } from 'react';
import MoodDisplay from './MoodDisplay';

const moods = {
  happy: { emoji: '😊', label: 'Happy' },
  sad: { emoji: '😢', label: 'Sad' },
  excited: { emoji: '🤩', label: 'Excited' }
};

function App() {
  const [currentMood, setCurrentMood] = useState('happy');

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Mood Switcher App</h1>
      <MoodDisplay mood={moods[currentMood]} />
      <div style={{ marginTop: '20px' }}>
        {Object.keys(moods).map((moodKey) => (
          <button
            key={moodKey}
            onClick={() => setCurrentMood(moodKey)}
            style={{
              margin: '8px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
          >
            {moods[moodKey].label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;`
      },
      {
        filename: 'src/MoodDisplay.jsx',
        language: 'javascript',
        code: `import React from 'react';

function MoodDisplay({ mood }) {
  return (
    <div>
      <h2>Current Mood: {mood.label}</h2>
      <div style={{ fontSize: '80px' }}>{mood.emoji}</div>
    </div>
  );
}

export default MoodDisplay;`
      }
    ],
    outputDescription: 'Clicking Happy, Sad, or Excited buttons updates currentMood state, re-rendering MoodDisplay with corresponding emoji.',
    voiceExplanation: 'State is local to a component and mutable via its updater function, whereas props are read-only inputs passed from parent to child.'
  },
  {
    id: 'fsd-6b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 6.b',
    category: 'React JS',
    title: 'React JS – Styling with CSS & Sass (SCSS) Color Adjustments',
    description: 'Demonstrates modular stylesheet integration using standard CSS and Sass color adjustment functions.',
    commands: [
      'npm i sass',
      'npm run dev'
    ],
    files: [
      {
        filename: 'src/MyStyle.scss',
        language: 'css',
        code: `@use 'sass:color';
$myColor: #e11d48;

h1 {
  color: $myColor;
}

h2 {
  color: color.adjust($myColor, $lightness: -20%);
}

h3 {
  color: color.adjust($myColor, $lightness: 20%);
}`
      },
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React from 'react';
import './MyStyle.scss';

function App() {
  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>My Header 1 (Base Color)</h1>
      <h2>My Header 2 (Darkened by 20%)</h2>
      <h3>My Header 3 (Lightened by 20%)</h3>
    </div>
  );
}

export default App;`
      }
    ],
    outputDescription: 'Headings are styled with progressively shaded variations of the primary Sass variable using color.adjust.',
    voiceExplanation: 'Sass extends standard CSS with variables, nesting, and mathematical functions like color.adjust for harmonious color schemes.'
  },
  {
    id: 'fsd-6c',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 6.c',
    category: 'React JS',
    title: 'React JS – Responding to Events (Input Change & Button Click)',
    description: 'Captures synthetic input events with onChange and click events with onClick to track text values and click counters.',
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React, { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [clickCount, setClickCount] = useState(0);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>React Event Handling Example</h2>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Type something:{" "}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            style={{ padding: '6px 12px', marginLeft: '8px' }}
          />
        </label>
        <p style={{ marginTop: '8px' }}>You typed: <strong>{inputValue}</strong></p>
      </div>

      <div>
        <button 
          onClick={handleButtonClick}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Click Me! ({clickCount} times)
        </button>
      </div>
    </div>
  );
}

export default App;`
      }
    ],
    outputDescription: 'Typing instantly mirrors into paragraph text, and clicking the button updates the interactive click counter.',
    voiceExplanation: 'React passes synthetic cross-browser event wrappers like onClick and onChange to handle DOM interactions predictably.'
  },
  {
    id: 'fsd-7a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 7.a',
    category: 'React JS',
    title: 'React JS – Conditional Rendering (Follow / Unfollow Toggle)',
    description: 'Implements conditional UI rendering toggling button text, styles, and action states based on boolean condition.',
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React, { useState } from 'react';

const FollowButton = ({ isInitiallyFollowing = false }) => {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
    console.log(isFollowing ? 'Unfollowed' : 'Followed');
  };

  return (
    <div style={{ padding: '24px' }}>
      <h3>Conditional Rendering Example</h3>
      <button 
        onClick={handleClick}
        style={{
          padding: '8px 18px',
          fontWeight: 600,
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: isFollowing ? '#f1f5f9' : '#2563eb',
          color: isFollowing ? '#1e293b' : '#ffffff',
          border: '1px solid #cbd5e1'
        }}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
};

export default FollowButton;`
      }
    ],
    outputDescription: 'Button toggles between blue "Follow" and subtle "Unfollow" with state-driven styling.',
    voiceExplanation: 'Ternary operators and short-circuit evaluation enable conditional rendering of JSX elements based on component state.'
  },
  {
    id: 'fsd-7b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 7.b',
    category: 'React JS',
    title: 'React JS – Rendering Lists with Array.map & Keys',
    description: 'Renders dynamic tabular data by iterating over an array of student objects using Array.prototype.map with unique keys.',
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React from 'react';

const students = [
  { id: 1, name: 'Aarav', age: 16, grade: 'A' },
  { id: 2, name: 'Diya', age: 17, grade: 'B+' },
  { id: 3, name: 'Rohan', age: 15, grade: 'A-' }
];

const StudentTable = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Student Records</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;`
      }
    ],
    outputDescription: 'Generates a table of students from array data, giving each row a distinct key property for React DOM reconciliation.',
    voiceExplanation: 'When rendering lists, keys give elements a stable identity so React can determine which items changed, were added, or were removed.'
  },
  {
    id: 'fsd-7c',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 7.c',
    category: 'React JS',
    title: 'React JS – Controlled React Forms with Multi-Field State',
    description: 'Manages controlled form inputs with a single state object, computed property names, and submit event handling.',
    files: [
      {
        filename: 'src/SimpleForm.jsx',
        language: 'javascript',
        code: `import React, { useState } from 'react';

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form submitted:', formData);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '16px' }}>
      <h2>Controlled React Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Name:</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>

      {submitted && (
        <div style={{ marginTop: '20px', padding: '12px', background: '#e0f2fe' }}>
          <h3>Submitted Data:</h3>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleForm;`
      }
    ],
    outputDescription: 'Inputs bind to formData state. On submission, displays submitted name and email in confirmation box.',
    voiceExplanation: 'Controlled components keep form state in React rather than the DOM, making validation and submission handling simple.'
  },
  {
    id: 'fsd-8a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 8.a',
    category: 'React Router',
    title: 'React JS – Routing to Different Pages using React Router DOM',
    description: 'Client-side routing setup with BrowserRouter, Routes, Route, and Link to navigate between Home, About, and Contact pages.',
    commands: [
      'npm i react-router-dom',
      'npm run dev'
    ],
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h2 style={{ color: '#2563eb' }}>Welcome to Home Page</h2>;
}

function About() {
  return <h2 style={{ color: '#16a34a' }}>This is the About Page</h2>;
}

function Contact() {
  return <h2 style={{ color: '#dc2626' }}>Contact us at contact@example.com</h2>;
}

export default function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}`
      }
    ],
    outputDescription: 'Clicking navigation links updates the URL without a full page refresh and mounts the designated route component.',
    voiceExplanation: 'React Router enables single-page navigation without reloading the browser window, maintaining seamless client state.'
  },
  {
    id: 'fsd-8b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 8.b',
    category: 'React Hooks',
    title: 'React JS – Updating the Screen with Timers & useEffect Cleanup',
    description: 'Shows how to continuously update the screen with an interval timer and perform proper cleanup on component unmount.',
    files: [
      {
        filename: 'src/App.jsx',
        language: 'javascript',
        code: `import React, { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Update count every 1 second
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Screen Updating Example</h1>
      <h2>Count: {count}</h2>
      <p style={{ color: '#64748b' }}>Increments every second using useEffect</p>
    </div>
  );
}`
      }
    ],
    outputDescription: 'A live numerical counter that ticks upward every 1000 milliseconds automatically.',
    voiceExplanation: 'The useEffect hook runs side effects like timer intervals and returns a cleanup callback to prevent memory leaks.'
  },
  {
    id: 'fsd-9a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 9.a',
    category: 'React Hooks',
    title: 'React JS – Understanding the Importance of Hooks (useState & useEffect)',
    description: 'Demonstrates functional component state and lifecycle observation with dependency arrays in useEffect.',
    files: [
      {
        filename: 'src/CounterWithHooks.jsx',
        language: 'javascript',
        code: `import React, { useState, useEffect } from 'react';

function CounterWithHooks() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(\`Count updated to: \${count}\`);
  }, [count]); // This runs only when count changes

  return (
    <div style={{ padding: '20px' }}>
      <h2>Counter using Hooks</h2>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        Increment
      </button>
    </div>
  );
}

export default CounterWithHooks;`
      }
    ],
    outputDescription: 'Incrementing the counter triggers the dependency-bound useEffect, logging each update to the console.',
    voiceExplanation: 'Hooks allow functional components to maintain state and tap into lifecycle events without writing class components.'
  },
  {
    id: 'fsd-9b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 9.b',
    category: 'React Props',
    title: 'React JS – Sharing Data Between Sibling Components via Parent',
    description: 'Shares state between sibling components (ComponentA and ComponentB) by lifting state up to their common Parent component.',
    files: [
      {
        filename: 'src/Parent.jsx',
        language: 'javascript',
        code: `import React, { useState } from 'react';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';

const Parent = () => {
  const [sharedData, setSharedData] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h2>React Data Sharing Example</h2>
      <ComponentA onDataChange={setSharedData} />
      <hr style={{ margin: '16px 0' }} />
      <ComponentB data={sharedData} />
    </div>
  );
};

export default Parent;`
      },
      {
        filename: 'src/ComponentA.jsx',
        language: 'javascript',
        code: `import React from 'react';

const ComponentA = ({ onDataChange }) => {
  const handleInputChange = (e) => {
    onDataChange(e.target.value);
  };

  return (
    <div>
      <h3>Component A (Sender)</h3>
      <input
        type="text"
        placeholder="Type something..."
        onChange={handleInputChange}
        style={{ padding: '8px', width: '250px' }}
      />
    </div>
  );
};

export default ComponentA;`
      },
      {
        filename: 'src/ComponentB.jsx',
        language: 'javascript',
        code: `import React from 'react';

const ComponentB = ({ data }) => {
  return (
    <div>
      <h3>Component B (Receiver)</h3>
      <p>Received Data: <strong style={{ color: '#0284c7' }}>{data || '(Waiting for input...)'}</strong></p>
    </div>
  );
};

export default ComponentB;`
      }
    ],
    outputDescription: 'Typing in Component A immediately displays the text inside Component B through parent state synchronization.',
    voiceExplanation: 'Lifting state up allows two sibling components to communicate by storing the state in their closest common ancestor.'
  },
  {
    id: 'fsd-10b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 10.b',
    category: 'MongoDB',
    title: 'MongoDB – CRUD Operations on Documents (insertMany, find, update, remove)',
    description: 'Executes MongoDB Shell / Compass commands for inserting single and multiple documents, querying with filters, updating records, and deletion.',
    commands: [
      'mongosh',
      'use dbconnect'
    ],
    files: [
      {
        filename: 'mongo_crud.js',
        language: 'javascript',
        code: `// Supporting variables
var today = new Date();
var year = today.getFullYear();
var month = today.getMonth();
var day = today.getDate();

// 1. Insert multiple documents
db.Solarheaterallocation.insertMany([
  {
    solarHeaterId: 2001,
    distributorName: 'Suntek',
    purchaseDate: new Date(year, month + 2, day).toLocaleDateString(),
    installationDate: new Date(year, month + 2, day + 3).toLocaleDateString(),
    customerId: 1002
  },
  {
    solarHeaterId: 2002,
    distributorName: 'A4solar',
    purchaseDate: new Date(year, month + 3, day).toLocaleDateString(),
    installationDate: new Date(year, month + 3, day + 7).toLocaleDateString(),
    customerId: 1001
  },
  {
    solarHeaterId: 2003,
    distributorName: 'Supremesolar',
    purchaseDate: new Date(year, month + 1, day).toLocaleDateString(),
    installationDate: new Date(year, month + 1, day + 3).toLocaleDateString(),
    customerId: 1003
  }
]);

// 2. Insert single document
db.Solarheaterallocation.insertOne({
  solarHeaterId: 2005,
  distributorName: 'A4solar',
  purchaseDate: new Date(year, month + 3, day + 9).toLocaleDateString(),
  installationDate: new Date(year, month + 3, day + 12).toLocaleDateString(),
  customerId: 1005
});

// 3. Find queries
db["Solarheaterallocation"].find().pretty();
db["Solarheaterallocation"].findOne({ distributorName: 'A4solar' });

// 4. Update queries
db["Solarheaterallocation"].updateOne(
  { distributorName: 'A4solar' },
  { $set: { customerId: 10 } }
);

db["Solarheaterallocation"].updateMany(
  { distributorName: 'A4solar' },
  { $set: { customerId: 10010 } }
);

// 5. Delete queries
db["Solarheaterallocation"].deleteOne({ distributorName: 'Suntek' });
// db["Solarheaterallocation"].deleteMany({});`
      }
    ],
    outputDescription: 'Shows document insertion confirmations, formatted JSON retrieval with pretty(), and modifiedCount metrics.',
    voiceExplanation: 'MongoDB provides insertOne, insertMany, find, updateOne, updateMany, and delete methods for document operations.'
  },
  {
    id: 'fsd-11b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 11.b',
    category: 'MongoDB',
    title: 'MongoDB – Advanced Queries, Sorting, Indexes & Aggregation Pipelines',
    description: 'MongoDB queries with limit(), sort(), createIndex(), and aggregate pipelines for grouping, summing, and project projections.',
    files: [
      {
        filename: 'mongo_advanced.js',
        language: 'javascript',
        code: `// Limit & Sorting
db.Solarheaterallocation.find().limit(2);
db.Solarheaterallocation.find().sort({ customerId: 1 }); // Ascending
db.Solarheaterallocation.find().sort({ customerId: -1 }); // Descending

// Indexes
db.Solarheaterallocation.createIndex({ customerId: 1 });
db.Solarheaterallocation.createIndex({ solarHeaterId: 1 }, { unique: true });
db.Solarheaterallocation.createIndex({ distributorName: "text" });

// Aggregations: Count number of solar heaters allocated per distributor
db.Solarheaterallocation.aggregate([
  {
    $group: {
      _id: "$distributorName",
      totalHeaters: { $sum: 1 }
    }
  }
]);

// Average customerId per distributor
db.Solarheaterallocation.aggregate([
  {
    $group: {
      _id: "$distributorName",
      avgCustomerId: { $avg: "$customerId" }
    }
  }
]);

// Find earliest installation per distributor
db.Solarheaterallocation.aggregate([
  {
    $group: {
      _id: "$distributorName",
      earliestInstall: { $min: "$installationDate" }
    }
  }
]);`
      }
    ],
    outputDescription: 'Aggregates return grouped metrics, count sums, sorted document streams, and query execution plan stats.',
    voiceExplanation: 'Indexes speed up document lookups significantly, while the aggregation pipeline allows multi-stage data transformations.'
  },
  {
    id: 'fsd-12a',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 12.a',
    category: 'Project Application',
    title: 'Full Stack To-Do List Application using Node.js, Express & EJS',
    description: 'Complete server-rendered to-do list application with task addition, task deletion, and custom gradient CSS styling.',
    commands: [
      'npm init -y',
      'npm install express ejs body-parser',
      'node app.js'
    ],
    files: [
      {
        filename: 'app.js',
        language: 'javascript',
        code: `const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let tasks = [];

app.get("/", (req, res) => {
  res.render("index", { tasks });
});

app.post("/add", (req, res) => {
  const newTask = req.body.task;
  if (newTask) tasks.push(newTask);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const index = parseInt(req.body.index, 10);
  if (!isNaN(index) && index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
});`
      },
      {
        filename: 'views/index.ejs',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>To-Do List App</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="container">
    <h1>📝 My To-Do List</h1>
    <form action="/add" method="POST" class="task-form">
      <input type="text" name="task" placeholder="Enter a new task" required>
      <button type="submit">Add</button>
    </form>
    <ul class="task-list">
      <% if (tasks.length === 0) { %>
        <p>No tasks yet! Add one above.</p>
      <% } %>
      <% tasks.forEach((task, index) => { %>
        <li>
          <span><%= task %></span>
          <form action="/delete" method="POST" style="margin: 0;">
            <input type="hidden" name="index" value="<%= index %>">
            <button type="submit" class="delete-btn">❌</button>
          </form>
        </li>
      <% }) %>
    </ul>
  </div>
</body>
</html>`
      },
      {
        filename: 'public/style.css',
        language: 'css',
        code: `body {
  background: linear-gradient(135deg, #74ebd5, #acb6e5);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
}
.container {
  background: white;
  width: 400px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.task-form {
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
}
input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 2px solid #74ebd5;
  border-radius: 8px;
}
button {
  background-color: #74ebd5;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
.delete-btn {
  background-color: #ff6b6b;
  padding: 4px 8px;
}`
      }
    ],
    outputDescription: 'Interactive web application allowing users to input tasks into a list and delete completed items.',
    voiceExplanation: 'This application integrates Express routing, URL-encoded body parsing, in-memory array data, and dynamic EJS list rendering.'
  },
  {
    id: 'fsd-12b',
    subject: 'fsd',
    subjectTitle: 'Full Stack Development 2',
    labNumber: 'Exp 12.b',
    category: 'Project Application',
    title: 'Interactive Quiz Application using ReactJS',
    description: 'Interactive multiple-choice trivia quiz app with question progression, score tracking, answer validation, and restart capability.',
    files: [
      {
        filename: 'src/Quiz.jsx',
        language: 'javascript',
        code: `import React, { useState } from "react";

const Quiz = () => {
  const questions = [
    {
      questionText: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
    },
    {
      questionText: "Which language runs in a web browser?",
      options: ["Python", "C++", "Java", "JavaScript"],
      correctAnswer: "JavaScript",
    },
    {
      questionText: "What does CSS stand for?",
      options: [
        "Central Style Sheets",
        "Cascading Style Sheets",
        "Computer Style System",
        "Colorful Style Sheets",
      ],
      correctAnswer: "Cascading Style Sheets",
    },
    {
      questionText: "Which HTML tag is used to define an internal style sheet?",
      options: ["<script>", "<style>", "<css>", "<link>"],
      correctAnswer: "<style>",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerClick = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '24px', background: '#f8fafc', borderRadius: '12px' }}>
      {showScore ? (
        <div style={{ textAlign: 'center' }}>
          <h2>You scored {score} out of {questions.length}</h2>
          <button 
            onClick={restartQuiz}
            style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <div>
          <h3>Question {currentQuestion + 1} of {questions.length}</h3>
          <p style={{ fontSize: '18px', fontWeight: '500' }}>{questions[currentQuestion].questionText}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                style={{ padding: '12px', textAlign: 'left', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff' }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;`
      }
    ],
    outputDescription: 'Interactive quiz prompts the user with questions sequentially and displays final score upon completion.',
    voiceExplanation: 'State variables control active question index, tally correct answers, and conditionally present the score summary card.'
  },

  // ==================== FLUTTER LAB EXPERIMENTS ====================
  {
    id: 'flutter-1b',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 1.b',
    category: 'Dart Basics',
    title: 'Dart Language Basics – Variables, Types, Loops, Lists & Maps',
    description: 'Introduction to Dart syntax covering integer, double, String, boolean, arithmetic operations, if-else, for loops, Lists, and Maps.',
    commands: [
      'dart run main.dart'
    ],
    files: [
      {
        filename: 'main.dart',
        language: 'dart',
        code: `// Entry point of a Dart program
void main() {
  // Variables and data types
  int myNumber = 10;
  double myDouble = 3.14;
  String myString = 'Hello World';
  bool myBool = true;

  // Printing variables
  print('My number is: $myNumber');
  print('My double is: $myDouble');
  print('My string is: $myString');
  print('My boolean is: $myBool');

  // Basic arithmetic operations
  int result = myNumber + 5;
  print('Result of addition: $result');

  // Conditional statements
  if (myBool) {
    print('myBool is true');
  } else {
    print('myBool is false');
  }

  // Loops
  for (int i = 0; i < 5; i++) {
    print('Iteration $i');
  }

  // Lists
  List<int> numbers = [1, 2, 3, 4, 5];
  print('First element of the list: \${numbers[0]}');
  print('Length of the list: \${numbers.length}');

  // Maps
  Map<String, int> ages = {'Kiran': 30, 'Raj': 25, 'Alekya': 35};
  print("Kiran's age: \${ages['Kiran']}");
}`
      }
    ],
    outputDescription: 'Terminal prints output for all data types, loop iterations 0 to 4, list elements, and map lookups.',
    voiceExplanation: 'Dart is an object-oriented, strongly typed language optimized for client applications with sound null safety.'
  },
  {
    id: 'flutter-2b',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 2.b',
    category: 'Layout Widgets',
    title: 'Flutter Layout Structures – Row, Column, and Stack Widgets',
    description: 'Implements primary Flutter spatial layout widgets: Row (horizontal), Column (vertical), and Stack (layered overlapping widgets).',
    files: [
      {
        filename: 'row_layout.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Row Layout'), backgroundColor: Colors.blue),
        body: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: <Widget>[
            Container(color: Colors.red, width: 100, height: 100),
            Container(color: Colors.green, width: 100, height: 100),
            Container(color: Colors.blue, width: 100, height: 100),
          ],
        ),
      ),
    );
  }
}`
      },
      {
        filename: 'column_layout.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Column Layout'), backgroundColor: Colors.blue),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: <Widget>[
            Container(color: Colors.red, width: 100, height: 100),
            Container(color: Colors.green, width: 100, height: 100),
            Container(color: Colors.blue, width: 100, height: 100),
          ],
        ),
      ),
    );
  }
}`
      },
      {
        filename: 'stack_layout.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Stack Layout')),
        body: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            Container(color: Colors.red, width: 200, height: 200),
            Container(color: Colors.green, width: 150, height: 150),
            Container(color: Colors.blue, width: 100, height: 100),
          ],
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'Renders red, green, and blue containers aligned horizontally in Row, vertically in Column, and layered atop one another in Stack.',
    voiceExplanation: 'Row aligns widgets along the horizontal axis, Column along the vertical axis, and Stack positions widgets on top of each other.'
  },
  {
    id: 'flutter-3a',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 3.a',
    category: 'Responsive UI',
    title: 'Responsive UI Design with LayoutBuilder (Narrow vs Wide Layouts)',
    description: 'Builds adaptive screens using LayoutBuilder inspecting constraints.maxWidth to switch between mobile portrait and desktop landscape views.',
    files: [
      {
        filename: 'responsive_layout_builder.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Responsive UI Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: ResponsiveHomePage(),
    );
  }
}

class ResponsiveHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Responsive UI Demo')),
      body: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          if (constraints.maxWidth < 600) {
            return _buildNarrowLayout();
          } else {
            return _buildWideLayout();
          }
        },
      ),
    );
  }

  Widget _buildNarrowLayout() {
    return Container(
      color: Colors.amberAccent,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            FlutterLogo(size: 100),
            SizedBox(height: 20),
            Text('Narrow Layout', style: TextStyle(fontSize: 28)),
            SizedBox(height: 20),
            ElevatedButton(onPressed: () {}, child: Text('Button')),
          ],
        ),
      ),
    );
  }

  Widget _buildWideLayout() {
    return Container(
      color: Colors.lightGreenAccent,
      child: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            FlutterLogo(size: 100),
            SizedBox(width: 20),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text('Wide Layout', style: TextStyle(fontSize: 28)),
                SizedBox(height: 20),
                ElevatedButton(onPressed: () {}, child: Text('Button')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'On screens < 600px width, shows amber column layout; on wider screens, dynamically switches to light green row layout.',
    voiceExplanation: 'LayoutBuilder provides parent constraints at build time, allowing the application to render different widget hierarchies responsively.'
  },
  {
    id: 'flutter-3b',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 3.b',
    category: 'Responsive UI',
    title: 'MediaQuery Breakpoints (Mobile, Tablet, Desktop)',
    description: 'Implements screen adaptation using MediaQuery.of(context).size.width with 600px and 1024px responsive thresholds.',
    files: [
      {
        filename: 'media_query_demo.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MediaQuery Demo',
      theme: ThemeData(primarySwatch: Colors.teal),
      home: ResponsivePage(),
    );
  }
}

class ResponsivePage extends StatelessWidget {
  final double mobileBreakpoint = 600;
  final double tabletBreakpoint = 1024;

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    if (screenWidth < mobileBreakpoint) {
      return _buildLayout(context, '📱 Mobile Layout', Colors.blue);
    } else if (screenWidth < tabletBreakpoint) {
      return _buildLayout(context, '📲 Tablet Layout', Colors.green);
    } else {
      return _buildLayout(context, '💻 Desktop Layout', Colors.red);
    }
  }

  Widget _buildLayout(BuildContext context, String label, Color color) {
    return Scaffold(
      appBar: AppBar(title: Text('Responsive Layout')),
      body: Container(
        color: color,
        child: Center(
          child: Text(
            label,
            style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold, color: Colors.white),
          ),
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'Displays blue Mobile view (<600px), green Tablet view (600-1024px), or red Desktop view (>1024px).',
    voiceExplanation: 'MediaQuery provides the current device screen size, orientation, and padding for responsive design.'
  },
  {
    id: 'flutter-4a',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 4.a',
    category: 'Navigation',
    title: 'Screen Navigation using Navigator (push & pop)',
    description: 'Navigates between screens using MaterialPageRoute with Navigator.push to enter and Navigator.pop to return.',
    files: [
      {
        filename: 'navigation_push_pop.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Navigation Example',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: FirstScreen(),
    );
  }
}

class FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('First Screen'), backgroundColor: Colors.blue),
      body: Center(
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.green,
            foregroundColor: Colors.white,
          ),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => SecondScreen()),
            );
          },
          child: Text('Go to Second Screen'),
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Second Screen'), backgroundColor: Colors.blue),
      body: Center(
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.yellow,
            foregroundColor: Colors.blue,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
          child: Text('Go back to First Screen'),
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'First screen displays green button that pushes SecondScreen; second screen button pops back to FirstScreen.',
    voiceExplanation: 'Navigator maintains a route stack where Navigator.push places a new route on top and Navigator.pop removes it.'
  },
  {
    id: 'flutter-4b',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 4.b',
    category: 'Navigation',
    title: 'Navigation with Named Routes & Route Maps',
    description: 'Configures MaterialApp routes dictionary with initialRoute, navigating via pushNamed and popUntil.',
    files: [
      {
        filename: 'named_routes_demo.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Named Routes Demo',
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),
        '/second': (context) => SecondScreen(),
        '/third': (context) => ThirdScreen(),
      },
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Home Screen')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.pushNamed(context, '/second'),
          child: Text('Go to Second Screen'),
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Second Screen')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.pushNamed(context, '/third'),
          child: Text('Go to Third Screen'),
        ),
      ),
    );
  }
}

class ThirdScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Third Screen')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.popUntil(context, ModalRoute.withName('/')),
          child: Text('Go Back to Home'),
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'Navigates sequentially through named string paths / to /second to /third, then pops back directly to home route /.',
    voiceExplanation: 'Named routes define clean string identifiers for screens in a central route table, simplifying complex deep navigation.'
  },
  {
    id: 'flutter-5a',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 5.a',
    category: 'Widget Architecture',
    title: 'Stateful vs Stateless Widgets in Flutter',
    description: 'Compares immutable StatelessWidget (CardList) with dynamic StatefulWidget (CounterScreen) using setState to rebuild UI.',
    files: [
      {
        filename: 'stateless_and_stateful.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Stateless & Stateful Example',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: FirstScreen(),
    );
  }
}

// FirstScreen is Stateless because it only displays static UI
class FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Stateless Widget")),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => CounterScreen()),
            );
          },
          child: Text("Go to Counter Screen"),
        ),
      ),
    );
  }
}

// CounterScreen is Stateful because the counter value changes
class CounterScreen extends StatefulWidget {
  @override
  _CounterScreenState createState() => _CounterScreenState();
}

class _CounterScreenState extends State<CounterScreen> {
  int counter = 0;

  void _incrementCounter() {
    setState(() {
      counter++; // Updates the UI when counter changes
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Stateful Widget")),
      body: Center(
        child: Text(
          "Counter: $counter",
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        child: Icon(Icons.add),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'First screen is static; navigating to CounterScreen allows pressing the FloatingActionButton to increment counter state in real time.',
    voiceExplanation: 'Stateless widgets are immutable once created. Stateful widgets store mutable state in a State class and rebuild via setState.'
  },
  {
    id: 'flutter-5b',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 5.b',
    category: 'State Management',
    title: 'State Management using Provider (Shopping Cart App)',
    description: 'Centralized state management with ChangeNotifier, ChangeNotifierProvider, and Provider.of across ProductList and Cart screens.',
    files: [
      {
        filename: 'pubspec.yaml',
        language: 'yaml',
        code: `name: provider_cart_example
description: A simple cart example using Provider
version: 1.0.0+1
environment:
  sdk: ">=2.12.0 <3.0.0"
dependencies:
  flutter:
    sdk: flutter
  provider: ^5.0.0
  cupertino_icons: ^1.0.8`
      },
      {
        filename: 'lib/cart_provider.dart',
        language: 'dart',
        code: `import 'package:flutter/foundation.dart';

class CartProvider with ChangeNotifier {
  int _itemCount = 0;
  int get itemCount => _itemCount;

  void addItem() {
    _itemCount++;
    notifyListeners(); // Refreshes listening widgets
  }

  void removeItem() {
    if (_itemCount > 0) {
      _itemCount--;
      notifyListeners();
    }
  }

  void clearCart() {
    _itemCount = 0;
    notifyListeners();
  }
}`
      },
      {
        filename: 'lib/main.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'cart_provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => CartProvider(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Cart Example',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: ProductListScreen(),
    );
  }
}

class ProductListScreen extends StatelessWidget {
  final List<String> products = [
    "Laptop",
    "Smartphone",
    "Headphones",
    "Keyboard",
    "Mouse"
  ];

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    return Scaffold(
      appBar: AppBar(
        title: Text("Products"),
        actions: [
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: Icon(Icons.shopping_cart),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => CartScreen()),
                  );
                },
              ),
              Positioned(
                right: 6,
                top: 6,
                child: Container(
                  padding: EdgeInsets.all(5),
                  decoration: BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                  child: Text(
                    "\${cart.itemCount}",
                    style: TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
              )
            ],
          )
        ],
      ),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (_, index) {
          return ListTile(
            title: Text(products[index]),
            trailing: ElevatedButton(
              child: Text("Add to Cart"),
              onPressed: () => cart.addItem(),
            ),
          );
        },
      ),
    );
  }
}

class CartScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    return Scaffold(
      appBar: AppBar(title: Text("Your Cart")),
      body: Center(
        child: Text(
          "Items in cart: \${cart.itemCount}",
          style: TextStyle(fontSize: 22),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.all(10),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(padding: EdgeInsets.all(15)),
          onPressed: cart.clearCart,
          child: Text("Clear Cart"),
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'Adding products increments the global cart badge in the AppBar; CartScreen displays total and can clear cart.',
    voiceExplanation: 'Provider avoids passing variables down widget trees by providing centralized state notification via notifyListeners.'
  },
  {
    id: 'flutter-6a',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 6.a',
    category: 'Custom Widgets',
    title: 'Custom Reusable Widgets (CustomTextField & CustomButton)',
    description: 'Encapsulates reusable UI elements by creating CustomButton and CustomTextField components with parameterized callbacks.',
    files: [
      {
        filename: 'custom_widgets.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Custom Widget Example')),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: CustomTextField(
                hintText: 'Enter your name',
                onChanged: (value) => print('Name changed: $value'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: CustomTextField(
                hintText: 'Enter Email',
                onChanged: (value) => print('Email changed: $value'),
              ),
            ),
            SizedBox(height: 16),
            CustomButton(
              text: 'Press Me',
              onPressed: () => print('Button pressed!'),
            ),
          ],
        ),
      ),
    );
  }
}

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const CustomButton({Key? key, required this.text, required this.onPressed})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      child: Text(text),
    );
  }
}

class CustomTextField extends StatelessWidget {
  final String hintText;
  final ValueChanged<String> onChanged;

  const CustomTextField({Key? key, required this.hintText, required this.onChanged})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextField(
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: hintText,
        border: OutlineInputBorder(),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'Renders multiple custom outlined text fields and elevated button with unified styling and callback bindings.',
    voiceExplanation: 'Custom widgets abstract repetitive layout code into modular, maintainable classes with clean constructor parameters.'
  },
  {
    id: 'flutter-7a',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 7.a',
    category: 'Forms & Inputs',
    title: 'Flutter Form Design with Text, Checkbox, Radio & Dropdown',
    description: 'Implements Form with TextFormField validation, Checkbox for newsletter, RadioListTile for gender, and DropdownButton for country.',
    files: [
      {
        filename: 'form_example.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Form Example',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue),
      home: FormPage(),
    );
  }
}

class FormPage extends StatefulWidget {
  @override
  _FormPageState createState() => _FormPageState();
}

class _FormPageState extends State<FormPage> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  String _email = '';
  bool _subscribeToNewsletter = false;
  String _selectedCountry = 'India';
  String _gender = 'Male';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Form Example')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              TextFormField(
                decoration: InputDecoration(labelText: 'Name'),
                validator: (value) => (value == null || value.trim().isEmpty) ? 'Please enter your name' : null,
                onSaved: (value) => _name = value?.trim() ?? '',
              ),
              SizedBox(height: 16),
              TextFormField(
                decoration: InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Please enter your email';
                  if (!value.contains('@')) return 'Please enter a valid email';
                  return null;
                },
                onSaved: (value) => _email = value?.trim() ?? '',
              ),
              SizedBox(height: 16),
              Row(
                children: <Widget>[
                  Checkbox(
                    value: _subscribeToNewsletter,
                    onChanged: (value) => setState(() => _subscribeToNewsletter = value ?? false),
                  ),
                  Text('Subscribe to Newsletter'),
                ],
              ),
              SizedBox(height: 16),
              Text('Gender:', style: TextStyle(fontWeight: FontWeight.w600)),
              Row(
                children: <Widget>[
                  Expanded(
                    child: RadioListTile<String>(
                      title: Text('Male'),
                      value: 'Male',
                      groupValue: _gender,
                      onChanged: (v) => setState(() => _gender = v ?? 'Male'),
                    ),
                  ),
                  Expanded(
                    child: RadioListTile<String>(
                      title: Text('Female'),
                      value: 'Female',
                      groupValue: _gender,
                      onChanged: (v) => setState(() => _gender = v ?? 'Female'),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              Row(
                children: [
                  Text('Country: '),
                  SizedBox(width: 20),
                  DropdownButton<String>(
                    value: _selectedCountry,
                    onChanged: (v) => setState(() => _selectedCountry = v ?? _selectedCountry),
                    items: ['India', 'USA', 'Canada', 'UK', 'Australia']
                        .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                  )
                ],
              ),
              SizedBox(height: 24),
              Center(
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState?.validate() ?? false) {
                      _formKey.currentState?.save();
                      showDialog(
                        context: context,
                        builder: (_) => AlertDialog(
                          title: Text('Form Submitted'),
                          content: Text('Name: $_name\\nEmail: $_email\\nSubscribed: $_subscribeToNewsletter\\nGender: $_gender\\nCountry: $_selectedCountry'),
                          actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text('OK'))],
                        ),
                      );
                    }
                  },
                  child: Text('Submit'),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'Submitting validates input fields and presents an alert dialog summarizing all completed values.',
    voiceExplanation: 'GlobalKey<FormState> connects the form tree, enabling aggregate validation and saving across all child input fields.'
  },
  {
    id: 'flutter-8a',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 8.a',
    category: 'Animations',
    title: 'Flutter Animation Framework (AnimationController & Tweens)',
    description: 'Implements explicit animation with AnimationController, SingleTickerProviderStateMixin, and Tween<double> to animate FlutterLogo dimensions.',
    files: [
      {
        filename: 'animation_controller_example.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(title: Text('Animation Example')),
        body: AnimationWidget(),
      ),
    );
  }
}

class AnimationWidget extends StatefulWidget {
  @override
  _AnimationWidgetState createState() => _AnimationWidgetState();
}

class _AnimationWidgetState extends State<AnimationWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 1),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0, end: 300).animate(_controller)
      ..addListener(() {
        setState(() {});
      });
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Container(
            width: _animation.value,
            height: _animation.value,
            color: Colors.blue,
            child: FlutterLogo(size: 100),
          ),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              if (_controller.status == AnimationStatus.completed) {
                _controller.reverse();
              } else {
                _controller.forward();
              }
            },
            child: Text(
              _controller.status == AnimationStatus.completed
                  ? 'Reverse Animation'
                  : 'Start Animation',
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}`
      }
    ],
    outputDescription: 'Pressing "Start Animation" expands the blue box from 0 to 300px; pressing again smoothly reverses the animation.',
    voiceExplanation: 'AnimationController generates tick values over a duration, which are mapped to physical dimensions through a Tween.'
  },
  {
    id: 'flutter-8b',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 8.b',
    category: 'Animations',
    title: 'Different Animation Types – Fade, Slide, and Scale Transitions',
    description: 'Examples of FadeTransition with opacity Tween, SlideTransition with Offset Tween, and ScaleTransition.',
    files: [
      {
        filename: 'fade_animation.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

class FadeAnimation extends StatefulWidget {
  @override
  _FadeAnimationState createState() => _FadeAnimationState();
}

class _FadeAnimationState extends State<FadeAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: Duration(seconds: 2));
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(_controller);
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FadeTransition(
        opacity: _animation,
        child: Container(width: 200, height: 200, color: Colors.blue),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}`
      },
      {
        filename: 'slide_animation.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

class SlideAnimation extends StatefulWidget {
  @override
  _SlideAnimationState createState() => _SlideAnimationState();
}

class _SlideAnimationState extends State<SlideAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: Duration(seconds: 2));
    _animation = Tween<Offset>(begin: Offset(-1.0, 0.0), end: Offset(0.0, 0.0)).animate(_controller);
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SlideTransition(
        position: _animation,
        child: Container(width: 200, height: 200, color: Colors.blue),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}`
      }
    ],
    outputDescription: 'Shows smooth opacity fades from invisible to full, and slides containers in from off-screen offsets.',
    voiceExplanation: 'Transition widgets like FadeTransition and SlideTransition bind directly to an Animation object for high 60fps performance.'
  },
  {
    id: 'flutter-9a',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 9.a & 9.b',
    category: 'REST API & Network',
    title: 'Fetching Data from REST API and Displaying in Structured PostCards',
    description: 'Queries remote JSONPlaceholder API via http.get, decodes JSON, handles loading spinners, and renders cards.',
    files: [
      {
        filename: 'api_data_example.dart',
        language: 'dart',
        code: `import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<dynamic> _data = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchDataFromApi();
  }

  Future<void> _fetchDataFromApi() async {
    setState(() => _isLoading = true);
    try {
      final response = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts'));
      if (response.statusCode == 200) {
        setState(() {
          _data = json.decode(response.body);
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('API Data Example')),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _data.length,
              itemBuilder: (context, index) {
                return PostCard(
                  title: _data[index]['title'],
                  body: _data[index]['body'],
                );
              },
            ),
    );
  }
}

class PostCard extends StatelessWidget {
  final String title;
  final String body;

  const PostCard({Key? key, required this.title, required this.body}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text(body, style: TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'Fetches real network data from JSONPlaceholder and displays each blog post in an elevated card.',
    voiceExplanation: 'Async HTTP calls run concurrently with the UI thread; setState schedules a re-render once response data is parsed.'
  },
  {
    id: 'flutter-10a',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 10.a',
    category: 'Unit Testing',
    title: 'Writing Unit Tests & Widget Tests for UI Components',
    description: 'Performs isolated widget testing using testWidgets, WidgetTester pumpWidget, and text finders to verify component rendering.',
    files: [
      {
        filename: 'test/post_card_test.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

// PostCard widget to test
class PostCard extends StatelessWidget {
  final String title;
  final String body;

  const PostCard({Key? key, required this.title, required this.body}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(body, style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}

void main() {
  testWidgets('PostCard displays title and body text', (WidgetTester tester) async {
    // Build the widget inside a MaterialApp scaffold
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: PostCard(title: 'Test Title', body: 'Test Body'),
        ),
      ),
    );

    // Verify that title and body are found on screen
    expect(find.text('Test Title'), findsOneWidget);
    expect(find.text('Test Body'), findsOneWidget);
  });

  testWidgets('PostCard has correct text font sizes', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: PostCard(title: 'Styled Title', body: 'Styled Body'),
        ),
      ),
    );

    final titleText = tester.widget<Text>(find.text('Styled Title'));
    expect(titleText.style?.fontSize, 18);
    expect(titleText.style?.fontWeight, FontWeight.bold);

    final bodyText = tester.widget<Text>(find.text('Styled Body'));
    expect(bodyText.style?.fontSize, 16);
  });
}`
      }
    ],
    outputDescription: 'Widget tests execute headlessly in milliseconds, checking widget presence, text content, and styling expectations.',
    voiceExplanation: 'Widget tests verify UI element rendering and behavior in isolation without requiring a physical simulator or device.'
  },
  {
    id: 'flutter-10b',
    subject: 'flutter',
    subjectTitle: 'UI Design using Flutter',
    labNumber: 'Lab 10.b',
    category: 'Debugging',
    title: 'Flutter Debugging Tools & Identifying Logical Bugs in Login Workflow',
    description: 'Step-by-step demonstration of locating and resolving conditional logic bugs (admin check != vs ==) using console debugging.',
    files: [
      {
        filename: 'login_debug_example.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(home: LoginPage()));
}

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  void login() {
    String username = usernameController.text;
    String password = passwordController.text;

    // DEBUGGING WORKFLOW:
    // Bug was: if (username != 'admin' && password == '1234') -> Always failed for 'admin'
    // Corrected logic:
    if (username == 'admin' && password == '1234') {
      print('Login Successful');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ Login Successful!'), backgroundColor: Colors.green),
      );
    } else {
      print('Login Failed');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ Login Failed'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login Page Debug Example')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: usernameController,
              decoration: InputDecoration(labelText: 'Username (admin)'),
            ),
            TextField(
              controller: passwordController,
              decoration: InputDecoration(labelText: 'Password (1234)'),
              obscureText: true,
            ),
            SizedBox(height: 20),
            ElevatedButton(onPressed: login, child: Text('Login')),
          ],
        ),
      ),
    );
  }
}`
      }
    ],
    outputDescription: 'Entering username "admin" and password "1234" successfully triggers the green confirmation snackbar.',
    voiceExplanation: 'Console print logs and debugger breakpoints help inspect variables at runtime and pinpoint logical discrepancies.'
  },

  // ==================== COMPUTER NETWORKS (CN) EXPERIMENTS ====================
  {
    id: 'cn-exp3',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 3',
    category: 'Framing & Error Detection',
    title: 'Data Link Layer Framing Method – Checksum (Sender & Receiver Operations)',
    description: "Write a program to implement the Data Link Layer framing method using Checksum (1's complement arithmetic) to demonstrate both sender and receiver operations.",
    objectives: [
      'Understand Data Link Layer framing principles',
      "Implement 1's complement checksum generation at the sender",
      'Simulate transmission frame including checksum',
      'Verify received frame integrity and detect transmission errors'
    ],
    commands: [
      'gcc checksum.c -o checksum',
      './checksum'
    ],
    steps: [
      'Sender inputs n data items and sums them',
      "Generate checksum using 1's complement negation",
      'Append checksum to data word and transmit',
      'Receiver sums data items and received checksum',
      'If total sum equals zero, accept frame without error; otherwise reject'
    ],
    files: [
      {
        filename: 'checksum.c',
        language: 'c',
        code: `#include <stdio.h>

int main() {
    int data[20], n, i;
    int checksum = 0, received_checksum, total = 0;

    printf("Enter the number of data items: ");
    scanf("%d", &n);

    printf("Enter the data items:\\n");
    for (i = 0; i < n; i++) {
        scanf("%d", &data[i]);
        checksum += data[i];
    }

    // Sender side 1's complement representation
    checksum = -checksum;

    printf("\\n--- Sender Side ---\\n");
    printf("Checksum generated: %d\\n", checksum);
    printf("Transmitted frame: ");
    for (i = 0; i < n; i++) {
        printf("%d ", data[i]);
    }
    printf("%d\\n", checksum);

    printf("\\n--- Receiver Side ---\\n");
    printf("Enter the received checksum: ");
    scanf("%d", &received_checksum);

    for (i = 0; i < n; i++) {
        total += data[i];
    }
    total += received_checksum;

    if (total == 0) {
        printf("No Error Detected: Data Accepted\\n");
    } else {
        printf("Error Detected: Data Rejected\\n");
    }

    return 0;
}`
      }
    ],
    outputDescription: 'Outputs generated checksum at sender. If receiver checksum matches, prints "No Error Detected: Data Accepted". If modified, outputs "Error Detected: Data Rejected".',
    voiceExplanation: "This experiment demonstrates checksum computation using 1's complement arithmetic. The sender sums data items, negates the sum to generate the checksum, and transmits both. The receiver sums all received data plus the checksum; a zero sum confirms error-free reception."
  },
  {
    id: 'cn-exp4',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 4',
    category: 'Error Detection & Correction',
    title: 'Hamming Code Generation, Error Detection, and Correction',
    description: 'Write a program to generate Hamming Code for single-bit error detection and error correction at the receiver side.',
    objectives: [
      'Calculate required parity bits using 2^p >= n + p + 1',
      'Construct codeword placing parity bits at powers of 2 (1, 2, 4, 8, ...)',
      'Calculate even parity for respective bit positions',
      'Locate corrupted bit position at receiver and perform single-bit correction'
    ],
    commands: [
      'gcc hamming.c -lm -o hamming',
      './hamming'
    ],
    files: [
      {
        filename: 'hamming.c',
        language: 'c',
        code: `#include <stdio.h>
#include <math.h>

int input[32];
int code[32];

int ham_calc(int position, int total_len);

int main() {
    int n, p_n = 0, c_l, i, j, k;
    int error_pos = 0;

    printf("Please enter the length of the Data word: ");
    scanf("%d", &n);

    printf("Please enter the Data word (bit by bit):\\n");
    for (i = 0; i < n; i++) {
        scanf("%d", &input[i]);
    }

    // Calculate number of parity bits required: 2^p_n >= n + p_n + 1
    while ((int)pow(2, p_n) < (n + p_n + 1)) {
        p_n++;
    }

    c_l = p_n + n;
    j = 0;
    k = 0;

    // Initialize code word (mark parity positions with 0)
    for (i = 1; i <= c_l; i++) {
        if (i == (int)pow(2, k)) {
            code[i - 1] = 0;
            k++;
        } else {
            code[i - 1] = input[j];
            j++;
        }
    }

    // Calculate parity bits
    for (i = 0; i < p_n; i++) {
        int position = (int)pow(2, i);
        int value = ham_calc(position, c_l);
        code[position - 1] = value;
    }

    printf("\\nThe Calculated Code word is: ");
    for (i = 0; i < c_l; i++) {
        printf("%d ", code[i]);
    }
    printf("\\n");

    printf("Please enter the received Code word:\\n");
    for (i = 0; i < c_l; i++) {
        scanf("%d", &code[i]);
    }

    // Check for errors at the receiver side
    for (i = 0; i < p_n; i++) {
        int position = (int)pow(2, i);
        int value = ham_calc(position, c_l);
        if (value != 0) {
            error_pos += position;
        }
    }

    if (error_pos == 0) {
        printf("The received Code word is Correct\\n");
    } else {
        printf("Error at bit position: %d\\n", error_pos);
    }

    return 0;
}

int ham_calc(int position, int total_len) {
    int count = 0, i, j;
    i = position - 1;

    while (i < total_len) {
        for (j = i; j < i + position && j < total_len; j++) {
            if (code[j] == 1) {
                count++;
            }
        }
        i = i + 2 * position;
    }

    if (count % 2 == 0)
        return 0;
    else
        return 1;
}`
      }
    ],
    outputDescription: 'Computes parity bits and shows calculated codeword. At receiver, verifies codeword and identifies exact error bit position if corrupted.',
    voiceExplanation: 'Hamming code adds redundant parity bits at positions that are powers of 2. At the receiver, recalculating parity syndromes pinpoint the exact erroneous bit position for single-bit correction.'
  },
  {
    id: 'cn-exp5',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 5',
    category: 'Error Detection & Correction',
    title: 'Cyclic Redundancy Check (CRC-12, CRC-16, CRC-CCITT)',
    description: 'Write a program to implement CRC computation over standard polynomials (CRC-12, CRC-16, CRC-CCITT) or arbitrary user polynomials.',
    commands: [
      'gcc crc.c -o crc',
      './crc'
    ],
    files: [
      {
        filename: 'crc.c',
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int i, j, keylen, msglen, ch;
char input[100], key[30], temp[30], quot[30], rem[30], key1[30];

void crc();

int main() {
    do {
        printf("\\n--- MENU ---");
        printf("\\n1. CRC-12\\n2. CRC-16\\n3. Any Polynomial\\n4. Exit\\nEnter your option: ");
        scanf("%d", &ch);

        switch (ch) {
            case 1:
                printf("\\nPolynomial data for CRC-12: ");
                strcpy(input, "110000000111");
                printf("%s\\n", input);
                crc();
                break;
            case 2:
                printf("\\nPolynomial data for CRC-16: ");
                strcpy(input, "11000000000000101");
                printf("%s\\n", input);
                crc();
                break;
            case 3:
                printf("\\nEnter any polynomial data for CRC: ");
                scanf("%s", input);
                printf("%s\\n", input);
                crc();
                break;
            case 4:
                exit(0);
        }
    } while (1);

    return 0;
}

void crc() {
    printf("Enter the value of key (Divisor polynomial): ");
    scanf("%s", key);

    keylen = strlen(key);
    msglen = strlen(input);

    printf("Length of key: %d, Length of message: %d\\n", keylen, msglen);
    printf("Appending initial redundancy bits (zeros) based on the divisor length...\\n");

    for (i = 0; i < keylen - 1; i++) {
        input[msglen + i] = '0';
    }
    input[msglen + keylen - 1] = '\\0';

    for (i = 0; i < keylen; i++) {
        temp[i] = input[i];
    }
    temp[keylen] = '\\0';
    strcpy(key1, key);

    for (i = 0; i < msglen; i++) {
        quot[i] = temp[0];
        if (quot[i] == '0') {
            for (j = 0; j < keylen; j++)
                key[j] = '0';
        } else {
            for (j = 0; j < keylen; j++)
                key[j] = key1[j];
        }

        for (j = keylen - 1; j > 0; j--) {
            if (temp[j] == key[j])
                rem[j - 1] = '0';
            else
                rem[j - 1] = '1';
        }
        rem[keylen - 1] = input[i + keylen];
        strcpy(temp, rem);
    }

    quot[msglen] = '\\0';
    rem[keylen - 1] = '\\0';

    printf("\\nQuotient is: %s", quot);
    printf("\\nRemainder is: %s", rem);
    printf("\\nFinal data (Transmitted Frame) is: ");
    for (i = 0; i < msglen; i++)
        printf("%c", input[i]);
    for (i = 0; i < keylen - 1; i++)
        printf("%c", rem[i]);
    printf("\\n");
}`
      }
    ],
    outputDescription: 'Prompts menu for CRC-12, CRC-16, or user polynomial. Appends zeros, performs modulo-2 division, and displays quotient, remainder, and transmitted frame.',
    voiceExplanation: 'Cyclic Redundancy Check treats bit strings as polynomials and performs modulo-2 binary division using XOR operations to generate an error-detecting FCS remainder.'
  },
  {
    id: 'cn-exp6',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 6',
    category: 'Flow Control Protocols',
    title: 'Sliding Window Protocol – Go-Back-N (GBN)',
    description: 'Write a program to implement the Go-Back-N sliding window flow control protocol with cumulative acknowledgement and window retransmission.',
    commands: [
      'gcc go_back_n.c -o go_back_n',
      './go_back_n'
    ],
    files: [
      {
        filename: 'go_back_n.c',
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    int no_of_frames = 3, N = 2;
    int count = 0;
    int i = 1, j;

    srand(time(NULL));

    while (i <= no_of_frames) {
        int x = 0;

        // Transmit current window frames
        for (j = i; j < i + N && j <= no_of_frames; j++) {
            printf("\\nSending frame %d", j);
            count++;
        }

        // Process ACKs
        for (j = i; j < i + N && j <= no_of_frames; j++) {
            int flag = rand() % 2;
            if (flag) {
                printf("\\nAcknowledgement for window frame %d received", j);
                x++;
            } else {
                printf("\\nCumulative acknowledgement not received whose first packet is %d", j);
                printf("\\nRetransmitting the same window...\\n");
                break;
            }
        }
        i += x;
    }

    printf("\\n\\nTotal number of transmissions: %d\\n", count);
    return 0;
}`
      }
    ],
    outputDescription: 'Simulates transmitting frames within sender window N=2. If an acknowledgment is dropped, the entire window is retransmitted from the unacknowledged frame.',
    voiceExplanation: 'In Go-Back-N, the sender can transmit multiple frames within window N before receiving an ACK. If a frame or ACK is lost, the sender retransmits all frames starting from the lost frame.'
  },
  {
    id: 'cn-exp7',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 7',
    category: 'Flow Control Protocols',
    title: 'Sliding Window Protocol – Selective Repeat',
    description: 'Write a program to implement the Selective Repeat sliding window protocol with individual frame acknowledgement and selective retransmission.',
    commands: [
      'gcc selective_repeat.c -o selective_repeat',
      './selective_repeat'
    ],
    files: [
      {
        filename: 'selective_repeat.c',
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int receiver(int);
int simulate(int);
int negack(int);

int main() {
    int windowsize = 4, noofpacket, morepacket;
    int tmp1, tmp2, tmp3, tmp4, tmp5;
    int i;

    srand(time(NULL));
    noofpacket = rand() % 10 + 1;
    printf("Number of frames is %d\\n", noofpacket);
    morepacket = noofpacket;

    while (morepacket > 0) {
        tmp1 = simulate(windowsize);
        tmp4 = tmp1;
        if (tmp4 > noofpacket)
            tmp4 = noofpacket;

        for (i = noofpacket - morepacket; i < tmp4; i++) {
            printf("\\nSending frame %d", i + 1);
        }

        tmp2 = receiver(tmp1);
        tmp3 = tmp2;
        if (tmp3 > noofpacket)
            tmp3 = noofpacket;

        tmp2 = negack(tmp1);
        tmp5 = tmp2;

        if (tmp5 != 0) {
            printf("\\nNo acknowledgement for the frame %d", tmp5);
            printf("\\nRetransmitting frame %d", tmp5);
        }

        morepacket -= tmp1;
    }

    printf("\\n\\nSelective Repeat protocol ends. All packets are successfully transmitted.\\n");
    return 0;
}

int receiver(int tmp1) {
    return (rand() % tmp1) + 1;
}

int negack(int tmp1) {
    return (rand() % tmp1) + 1;
}

int simulate(int windowsize) {
    int tmp1 = rand() % (windowsize + 1);
    if (tmp1 == 0)
        return windowsize;
    return tmp1;
}`
      }
    ],
    outputDescription: 'Simulates Selective Repeat sliding window. Sender transmits window frames and selectively retransmits only corrupted/lost frames indicated by negative acknowledgements.',
    voiceExplanation: 'Unlike Go-Back-N, Selective Repeat only retransmits the specific frames that were lost or received with errors, buffering out-of-order packets at the receiver.'
  },
  {
    id: 'cn-exp8',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 8',
    category: 'Flow Control Protocols',
    title: 'Stop-and-Wait Protocol with Packet & Acknowledgement Loss Simulation',
    description: 'Write a program to implement the Stop-and-Wait protocol with simulated packet drop and acknowledgement loss handling.',
    commands: [
      'gcc stop_and_wait.c -o stop_and_wait',
      './stop_and_wait'
    ],
    files: [
      {
        filename: 'stop_and_wait.c',
        language: 'c',
        code: `#include <stdio.h>

struct Sender {
    int packetNo;
    int sent;
    int acknowledged;
} S[10];

struct Receiver {
    int AcknowledgementNo;
    int received;
    int AcknowledgementsSent;
} R[10];

int main() {
    int i = 0;
    int check4 = 0;
    int check6 = 0;

    for (i = 0; i < 6; i++) {
        S[i].sent = 0;
        S[i].acknowledged = 0;
        S[i].packetNo = i + 1;
    }

    for (i = 0; i < 6; i++) {
        R[i].AcknowledgementsSent = 0;
        R[i].received = 0;
        R[i].AcknowledgementNo = i + 1;
    }

    for (i = 0; i < 6; i++) {
        printf("\\n\\nNext Frame:");
        printf("\\nSending packet %d from Sender", i + 1);
        S[i].sent = 1;
        printf("\\nPropagation Delay...");

        // Simulate lost packet at i == 3
        if (i == 3 && check4 == 0) {
            R[i].received = 0;
            check4 = 1;
            printf("\\nData packet No %d not received.", i + 1);
            i--; // Retransmit
            continue;
        } else {
            R[i].received = 1;
            R[i].AcknowledgementsSent = 1;
            printf("\\nSending Acknowledgement No %d to sender", i + 1);
            printf("\\nPropagation Delay...");

            // Simulate lost acknowledgement at i == 4
            if (i == 4 && check6 == 0) {
                S[i].acknowledged = 0;
                check6 = 1;
                printf("\\nAcknowledgement for Data Packet No %d not received", i + 1);
                i--; // Retransmit
                continue;
            } else {
                S[i].acknowledged = 1;
                printf("\\nAcknowledgement for packet No %d Received", i + 1);
            }
        }
    }

    return 0;
}`
      }
    ],
    outputDescription: 'Simulates transmitting 6 frames in Stop-and-Wait fashion. Demonstrates packet retransmission when packet 4 is dropped and when ACK 5 is lost in transit.',
    voiceExplanation: 'Stop-and-Wait protocol requires the sender to wait for an acknowledgment after each individual frame before transmitting the next. Timeouts trigger retransmissions if packets or ACKs are lost.'
  },
  {
    id: 'cn-exp9',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 9',
    category: 'Congestion Control',
    title: 'Congestion Control using Leaky Bucket Algorithm',
    description: 'Write a program to implement traffic shaping and congestion control using the Leaky Bucket algorithm with fixed output rate and buffer overflow handling.',
    commands: [
      'gcc leaky_bucket.c -o leaky_bucket',
      './leaky_bucket'
    ],
    files: [
      {
        filename: 'leaky_bucket.c',
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define bucketSize 512

void bktInput(int a, int b) {
    if (a > bucketSize) {
        printf("\\n\\tBucket overflow! Packet dropped.");
    } else {
        sleep(1);
        while (a > b) {
            printf("\\n\\t%d bytes outputted", b);
            a -= b;
            sleep(1);
        }
        if (a > 0) {
            printf("\\n\\tLast %d bytes sent", a);
        }
        printf("\\n\\tBucket output successful.\\n");
    }
}

int main() {
    int op, pktsize;

    printf("Enter output rate: ");
    scanf("%d", &op);

    for (int i = 1; i <= 5; i++) {
        sleep((rand() % 2) + 1);
        pktsize = rand() % 1000;
        printf("\\nPacket no: %d, Packet size: %d", i, pktsize);
        bktInput(pktsize, op);
    }

    return 0;
}`
      }
    ],
    outputDescription: 'Takes constant output leak rate, simulates arrival of random-sized bursty packets, drains at steady rate, and drops packets exceeding bucket size 512 bytes.',
    voiceExplanation: 'The Leaky Bucket algorithm shapes bursty network traffic into a smooth, steady stream by storing incoming packets in a finite buffer and releasing them at a constant rate.'
  },
  {
    id: 'cn-exp10',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 10',
    category: 'Routing Algorithms',
    title: "Shortest Path Routing using Dijkstra's Algorithm",
    description: "Write a program to find shortest paths from a single source to all vertices in a weighted graph using Dijkstra's algorithm.",
    commands: [
      'gcc dijkstra.c -o dijkstra',
      './dijkstra'
    ],
    files: [
      {
        filename: 'dijkstra.c',
        language: 'c',
        code: `#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

#define V 9

int minDistance(int dist[], bool sptSet[]) {
    int min = INT_MAX, min_index = -1;

    for (int v = 0; v < V; v++) {
        if (!sptSet[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void printSolution(int dist[], int n) {
    printf("Vertex \\t Distance from Source\\n");
    for (int i = 0; i < V; i++) {
        printf("%d \\t %d\\n", i, dist[i]);
    }
}

void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool sptSet[V];

    for (int i = 0; i < V; i++) {
        dist[i] = INT_MAX;
        sptSet[i] = false;
    }

    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, sptSet);
        sptSet[u] = true;

        for (int v = 0; v < V; v++) {
            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX
                && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    printSolution(dist, V);
}

int main() {
    int graph[V][V] = {
        {0, 4, 0, 0, 0, 0, 0, 8, 0},
        {4, 0, 8, 0, 0, 0, 0, 11, 0},
        {0, 8, 0, 7, 0, 4, 0, 0, 2},
        {0, 0, 7, 0, 9, 14, 0, 0, 0},
        {0, 0, 0, 9, 0, 10, 0, 0, 0},
        {0, 0, 4, 14, 10, 0, 2, 0, 0},
        {0, 0, 0, 0, 0, 2, 0, 1, 6},
        {8, 11, 0, 0, 0, 0, 1, 0, 7},
        {0, 0, 2, 0, 0, 0, 6, 7, 0}
    };

    dijkstra(graph, 0);

    return 0;
}`
      }
    ],
    outputDescription: 'Computes the shortest path from vertex 0 to all 9 vertices in the network graph and outputs the distance table.',
    voiceExplanation: "Dijkstra's greedy algorithm finds the shortest path tree from a single source node to all other nodes in a network with non-negative edge costs."
  },
  {
    id: 'cn-exp11',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 11',
    category: 'Routing Algorithms',
    title: 'Distance Vector Routing (Floyd-Warshall / All-Pairs Shortest Path)',
    description: 'Write a program to implement routing table calculation using the Distance Vector routing algorithm based on dynamic programming.',
    commands: [
      'gcc distance_vector.c -o distance_vector',
      './distance_vector'
    ],
    files: [
      {
        filename: 'distance_vector.c',
        language: 'c',
        code: `#include <stdio.h>

#define INF 999
#define N 6

void printTable(int dist[N][N], int nodes) {
    printf("\\nRouting Table:\\n");
    printf("Node | ");
    for (int i = 0; i < nodes; i++) {
        printf("%c\\t", 'A' + i);
    }
    printf("\\n--------------------------------------------------\\n");

    for (int i = 0; i < nodes; i++) {
        printf("%c    | ", 'A' + i);
        for (int j = 0; j < nodes; j++) {
            if (dist[i][j] == INF)
                printf("INF\\t");
            else
                printf("%d\\t", dist[i][j]);
        }
        printf("\\n");
    }
}

int main() {
    int graph[N][N] = {
        {0,   1,   INF, INF, INF, INF},
        {1,   0,   2,   INF, 1,   INF},
        {INF, 2,   0,   3,   INF, INF},
        {INF, INF, 3,   0,   2,   INF},
        {INF, 1,   INF, 2,   0,   3  },
        {INF, INF, INF, INF, 3,   0  }
    };

    int dist[N][N];
    int nodes = N;

    for (int i = 0; i < nodes; i++) {
        for (int j = 0; j < nodes; j++) {
            dist[i][j] = graph[i][j];
        }
    }

    // Dynamic programming (Distance Vector update)
    for (int k = 0; k < nodes; k++) {
        for (int i = 0; i < nodes; i++) {
            for (int j = 0; j < nodes; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    printTable(dist, nodes);
    return 0;
}`
      }
    ],
    outputDescription: 'Computes and prints dynamic routing matrix across all 6 nodes (A through F), updating lowest costs iteratively.',
    voiceExplanation: 'Distance Vector routing allows each router to exchange cost vectors with neighbors, applying the Bellman-Ford principle to compute lowest cost paths across the entire subnet.'
  },
  {
    id: 'cn-exp12',
    subject: 'cn',
    subjectTitle: 'Computer Networks',
    labNumber: 'Exp 12',
    category: 'Network Spanning Trees',
    title: "Broadcast Tree Construction using Prim's Minimum Spanning Tree (MST)",
    description: "Write a program to compute and display a Broadcast Tree from a designated source node using a Minimum Spanning Tree (MST) approach.",
    commands: [
      'gcc broadcast_tree.c -o broadcast_tree',
      './broadcast_tree'
    ],
    files: [
      {
        filename: 'broadcast_tree.c',
        language: 'c',
        code: `#include <stdio.h>
#include <limits.h>

#define N 5
#define INF INT_MAX

int minDistance(int dist[], int visited[]) {
    int min = INF, min_index = -1;

    for (int v = 0; v < N; v++) {
        if (visited[v] == 0 && dist[v] < min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void printBroadcastTree(int parent[], int graph[N][N]) {
    printf("Edge \\tWeight\\n");
    for (int i = 1; i < N; i++) {
        printf("%c - %c \\t%d\\n", 'A' + parent[i], 'A' + i, graph[i][parent[i]]);
    }
}

void broadcastTree(int graph[N][N], int src) {
    int dist[N];
    int parent[N];
    int visited[N];

    for (int i = 0; i < N; i++) {
        dist[i] = INF;
        visited[i] = 0;
    }

    dist[src] = 0;
    parent[src] = -1;

    for (int count = 0; count < N - 1; count++) {
        int u = minDistance(dist, visited);
        visited[u] = 1;

        for (int v = 0; v < N; v++) {
            if (graph[u][v] && visited[v] == 0 && graph[u][v] < dist[v]) {
                parent[v] = u;
                dist[v] = graph[u][v];
            }
        }
    }

    printBroadcastTree(parent, graph);
}

int main() {
    int graph[N][N] = {
        {0, 2, 0, 6, 0},
        {2, 0, 3, 8, 5},
        {0, 3, 0, 0, 7},
        {6, 8, 0, 0, 9},
        {0, 5, 7, 9, 0}
    };

    int source = 0;
    printf("Broadcast Tree from Source node '%c':\\n", 'A' + source);
    broadcastTree(graph, source);

    return 0;
}`
      }
    ],
    outputDescription: "Constructs a broadcast tree starting from Source node 'A', computing minimum spanning tree edges (e.g., A-B, B-C, B-E, A-D) without creating routing loops.",
    voiceExplanation: "Broadcast tree construction using Prim's algorithm forms a loop-free minimum spanning tree connecting all nodes from a source router, ensuring broadcast packets reach every host with minimum link overhead."
  },

  // ==================== DATA WAREHOUSING & DATA MINING (DWDM) EXPERIMENTS ====================
  {
    id: 'dwdm-exp2',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 2',
    category: 'WEKA Toolkit',
    title: 'Explore WEKA Data Mining / Machine Learning Toolkit & ARFF Format',
    description: 'Explore the features of the WEKA toolkit (Explorer, Knowledge Flow, Experimenter, SimpleCLI), inspect dataset attributes, types, histograms, and understand the ARFF file format.',
    objectives: [
      'Download and run WEKA GUI Chooser',
      'Understand Explorer, Experimenter, Knowledge Flow, and SimpleCLI interfaces',
      'Learn ARFF file format structure (@RELATION, @ATTRIBUTE, @DATA)',
      'Load Iris.arff, analyze attributes, histograms, class distribution, and 2D visualization'
    ],
    commands: [
      'java -jar weka.jar',
      '# Or launch Weka GUI Chooser from applications menu'
    ],
    steps: [
      'Launch Weka GUI Chooser and click on Explorer',
      'In Preprocess tab, click Open file... and navigate to weka/data/iris.arff',
      'Observe 5 attributes (sepallength, sepalwidth, petallength, petalwidth, class)',
      'Inspect class attribute labels: Iris-setosa (50), Iris-versicolor (50), Iris-virginica (50)',
      'Click Visualize All to view feature distributions and scatter plots'
    ],
    files: [
      {
        filename: 'iris_sample.arff',
        language: 'shell',
        code: `% 1. Title: Iris Plants Database
% 2. Sources: R.A. Fisher
%
@RELATION iris

@ATTRIBUTE sepallength  NUMERIC
@ATTRIBUTE sepalwidth   NUMERIC
@ATTRIBUTE petallength  NUMERIC
@ATTRIBUTE petalwidth   NUMERIC
@ATTRIBUTE class        {Iris-setosa,Iris-versicolor,Iris-virginica}

@DATA
5.1,3.5,1.4,0.2,Iris-setosa
4.9,3.0,1.4,0.2,Iris-setosa
4.7,3.2,1.3,0.2,Iris-setosa
4.6,3.1,1.5,0.2,Iris-setosa
5.0,3.6,1.4,0.2,Iris-setosa
7.0,3.2,4.7,1.4,Iris-versicolor
6.4,3.2,4.5,1.5,Iris-versicolor
6.9,3.1,4.9,1.5,Iris-versicolor
5.5,2.3,4.0,1.3,Iris-versicolor
6.5,2.8,4.6,1.5,Iris-versicolor
6.3,3.3,6.0,2.5,Iris-virginica
5.8,2.7,5.1,1.9,Iris-virginica
7.1,3.0,5.9,2.1,Iris-virginica
6.3,2.9,5.6,1.8,Iris-virginica
6.5,3.0,5.8,2.2,Iris-virginica`
      }
    ],
    outputDescription: 'Loads IRIS.arff into WEKA Explorer: 150 instances, 5 attributes, 3 classes with 50 instances each. 2D visualization displays feature separation.',
    voiceExplanation: 'WEKA is a suite of machine learning software developed at the University of Waikato. An ARFF file consists of a header declaring relation name and attributes followed by the comma-separated @DATA section.'
  },
  {
    id: 'dwdm-exp3',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 3',
    category: 'Data Preprocessing',
    title: 'Data Preprocessing (Resample, Discretize) & Association Rule Mining using Apriori',
    description: 'Perform data preprocessing tasks using Resample and Discretize filters, and demonstrate Association Rule Mining with Apriori algorithm on Breast-Cancer and Iris datasets.',
    objectives: [
      'Clean and prepare raw datasets for machine learning',
      'Apply Resample filter to create randomized subsets or remove bias',
      'Apply Discretize filter to convert continuous values into categorical bins',
      'Run Apriori algorithm to discover frequent itemsets and association rules with support and confidence metrics'
    ],
    commands: [
      '# In WEKA Explorer:',
      'Preprocess > Filters > unsupervised.instance.Resample',
      'Preprocess > Filters > unsupervised.attribute.Discretize',
      'Associate > Choose > Apriori > Start'
    ],
    steps: [
      'Load Breast-Cancer.arff or Iris.arff in Preprocess tab',
      'Select unsupervised > attribute > Discretize and apply to numeric columns',
      'Navigate to Associate tab, select Apriori algorithm',
      'Configure minimum support (e.g., minSupport=0.2) and confidence threshold',
      'Click Start and analyze the generated IF-THEN association rules'
    ],
    files: [
      {
        filename: 'apriori_rules_summary.txt',
        language: 'shell',
        code: `=== Run information ===
Scheme:       weka.associations.Apriori -N 10 -T 0 -C 0.9 -D 0.05 -U 1.0 -M 0.1 -S -1.0 -c -1
Relation:     breast-cancer
Instances:    286
Attributes:   10

=== Association Rules using Apriori ===

Support = (Transactions containing A and B) / (Total Transactions)
Confidence = (Transactions containing A and B) / (Transactions containing A)

Best rules found:
1. node-caps=no deg-malig=2 130 ==> menopause=ge40 102    <conf:(0.78)> lift:(1.44) lev:(0.11) conv:(2.09)
2. node-caps=no irradiat=no 209 ==> deg-malig=2 108       <conf:(0.52)> lift:(1.15) lev:(0.05) conv:(1.14)
3. tumor-size=large deg-malig=3 ==> Class=recurrence-events <conf:(0.85)> lift:(2.12)
4. age=40-49 node-caps=no ==> Class=no-recurrence-events  <conf:(0.80)> lift:(1.13)

Discretization Effect:
- Continuous attributes partitioned into distinct bins
- Significantly increases item co-occurrence frequencies
- Yields cleaner, highly interpretable association rules`
      }
    ],
    outputDescription: 'Generates association rules with Support and Confidence scores. Discretization groups continuous numbers into categorical intervals for clearer rule mining.',
    voiceExplanation: 'Association Rule Mining discovers interesting relationships between variables in databases. Support measures how frequently items occur together, while Confidence measures how often the rule is found to be true.'
  },
  {
    id: 'dwdm-exp4',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 4',
    category: 'Classification',
    title: 'Classification on Datasets (ID3, J48, Naïve Bayes, k-NN & ROC Curves)',
    description: 'Execute ID3 and J48 decision trees, Naïve Bayes, and k-NN (IBk) classifiers on Contact-Lenses and Iris datasets. Evaluate accuracy, confusion matrix, and plot ROC curves.',
    objectives: [
      'Run ID3 and J48 (C4.5) decision tree classification algorithms',
      'Perform Naive Bayes probabilistic classification and Lazy k-NN (IBk)',
      'Extract IF-THEN rules from decision tree models',
      'Analyze Confusion Matrix, Precision, Recall, F-measure, and ROC curves',
      'Compare 10-fold vs 20-fold Cross-Validation test modes'
    ],
    commands: [
      '# In WEKA Classify Tab:',
      'Classifier > trees > Id3 / J48',
      'Classifier > bayes > NaiveBayes',
      'Classifier > lazy > IBk (k=1, 3, 5)',
      'Right click result > Visualize Threshold Curve > Class (ROC)'
    ],
    files: [
      {
        filename: 'contact_lenses_sample.arff',
        language: 'shell',
        code: `@relation contact-lenses

@attribute age 			{young, pre-presbyopic, presbyopic}
@attribute spectacle-presc	{myope, hypermetrope}
@attribute astigmatic		{no, yes}
@attribute tear-prod-rate	{reduced, normal}
@attribute contact-lenses	{soft, hard, none}

@data
young,myope,no,reduced,none
young,myope,no,normal,soft
young,myope,yes,reduced,none
young,myope,yes,normal,hard
young,hypermetrope,no,reduced,none
young,hypermetrope,no,normal,soft
young,hypermetrope,yes,reduced,none
young,hypermetrope,yes,normal,hard
pre-presbyopic,myope,no,reduced,none
pre-presbyopic,myope,no,normal,soft
pre-presbyopic,myope,yes,reduced,none
pre-presbyopic,myope,yes,normal,hard
presbyopic,myope,no,reduced,none
presbyopic,myope,no,normal,none
presbyopic,myope,yes,reduced,none
presbyopic,myope,yes,normal,hard`
      },
      {
        filename: 'classification_results.txt',
        language: 'shell',
        code: `=== Classifier Evaluation Summary ===

1. J48 Decision Tree:
tear-prod-rate = reduced: none (12.0)
tear-prod-rate = normal
|   astigmatic = no
|   |   age = young: soft (2.0)
|   |   age = pre-presbyopic: soft (2.0)
|   |   age = presbyopic
|   |   |   spectacle-presc = myope: none (1.0)
|   |   |   spectacle-presc = hypermetrope: soft (1.0)
|   astigmatic = yes
|   |   spectacle-presc = myope: hard (3.0)
|   |   spectacle-presc = hypermetrope
|   |   |   age = young: hard (1.0)
|   |   |   age = pre-presbyopic: none (1.0)
|   |   |   age = presbyopic: none (1.0)

=== Detailed Accuracy by Class ===
TP Rate  FP Rate  Precision  Recall   F-Measure  ROC Area  Class
0.833    0.056    0.833      0.833    0.833      0.889     soft
0.750    0.050    0.750      0.750    0.750      0.850     hard
0.933    0.111    0.933      0.933    0.933      0.911     none

Confusion Matrix:
 a  b  c   <-- classified as
 5  0  1 | a = soft
 0  3  1 | b = hard
 1  0 14 | c = none`
      }
    ],
    outputDescription: 'Evaluates classifiers under training set and cross-validation test modes. Displays detailed accuracy metrics (TP, FP, Precision, Recall, F-measure, Kappa) and ROC threshold curves.',
    voiceExplanation: 'Classification maps data into predefined target classes. Decision trees like ID3 and J48 split on maximum Information Gain and Gain Ratio, while Naive Bayes uses prior and conditional probabilities.'
  },
  {
    id: 'dwdm-exp5',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 5',
    category: 'Clustering',
    title: 'Clustering using Simple K-Means Algorithm & 2D Cluster Visualizations',
    description: 'Perform unsupervised clustering on data using Simple K-Means with varying k clusters, observe cluster centroids, Sum of Squared Errors (SSE), and visualize assignments.',
    objectives: [
      'Understand unsupervised learning and partitioning algorithms',
      'Run Simple K-Means in WEKA with k=2, 3, and 5 clusters',
      'Analyze cluster centroids, iteration count, and Within-Cluster Sum of Squared Errors',
      'Explore cluster visualization features by toggling X-axis, Y-axis, Color, and Jitter'
    ],
    commands: [
      '# In WEKA Cluster Tab:',
      'Clusterer > Choose > SimpleKMeans',
      'Click SimpleKMeans to set numClusters (k=3)',
      'Select Use training set or Classes to clusters evaluation',
      'Right click result > Visualize cluster assignments'
    ],
    files: [
      {
        filename: 'kmeans_weka_output.txt',
        language: 'shell',
        code: `=== Run information ===
Scheme:       weka.clusterers.SimpleKMeans -N 3 -A "weka.core.EuclideanDistance -R first-last" -I 500 -S 10
Relation:     iris
Instances:    150
Attributes:   5

=== Model and evaluation on training set ===
Number of iterations: 6
Within cluster sum of squared errors: 6.9981

Final cluster centroids:
Attribute          Full Data (150)       Cluster 0 (61)        Cluster 1 (50)        Cluster 2 (39)
===================================================================================================
sepallength                 5.8433               5.8885                5.006                 6.8462
sepalwidth                  3.054                2.7607                3.418                 3.0821
petallength                 3.7587               4.3967                1.464                 5.7026
petalwidth                  1.1987               1.4344                0.244                 2.0795
class                  Iris-setosa      Iris-versicolor           Iris-setosa        Iris-virginica

Clustered Instances:
0      61 ( 41%)
1      50 ( 33%)
2      39 ( 26%)`
      }
    ],
    outputDescription: 'Groups 150 instances into 3 distinct clusters matching natural species boundaries with minimized Sum of Squared Errors (SSE).',
    voiceExplanation: 'K-Means partitions n observations into k clusters where each observation belongs to the cluster with the nearest mean centroid, iteratively recalculating centroids until convergence.'
  },
  {
    id: 'dwdm-exp6',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 6',
    category: 'Knowledge Flow',
    title: 'Knowledge Flow Application Layout for Apriori & FP-Growth Algorithms',
    description: 'Develop a graphical Knowledge Flow pipeline in WEKA linking ArffLoader, ClassAssigner, Association Rule Learner (Apriori/FP-Growth), and TextViewer.',
    objectives: [
      'Explore WEKA Knowledge Flow visual data pipeline environment',
      'Connect data loaders, transformers, learning schemes, and evaluators visually',
      'Compare Apriori and FP-Growth association rule generation in Knowledge Flow',
      'Inspect results dynamically via TextViewer and ModelPerformanceChart'
    ],
    steps: [
      'Open WEKA and click on Knowledge Flow',
      'Add ArffLoader component from DataSources onto canvas',
      'Right click ArffLoader, configure and browse input .arff file',
      'Add ClassAssigner from Evaluation and connect dataset connection from ArffLoader',
      'Add Apriori or FPGrowth from Associations and connect batchAssociationRules',
      'Add TextViewer from Visualization and link text connection',
      'Click Play/Run button and inspect outputs in TextViewer'
    ],
    files: [
      {
        filename: 'knowledge_flow_workflow.txt',
        language: 'shell',
        code: `=== WEKA Knowledge Flow Component Pipeline ===

[ ArffLoader ] 
      │ (dataSet)
      ▼
[ ClassAssigner ]
      │ (dataSet)
      ▼
[ Apriori / FPGrowth ]
      │ (text / associationRules)
      ▼
[ TextViewer / ModelPerformanceChart ]

Key Advantages of Knowledge Flow:
1. Drag-and-drop intuitive visual programming
2. Supports incremental learning on data streams
3. Parallel execution of multiple learning schemes
4. Direct export of models and interactive charts`
      }
    ],
    outputDescription: 'Visual canvas executes all connected components in order, showing FINISHED status and streaming association rules to TextViewer.',
    voiceExplanation: 'The Knowledge Flow interface supports flexible visual pipeline composition for machine learning, executing data preprocessing, learning, and visualization through connected modular blocks.'
  },
  {
    id: 'dwdm-exp8',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 8',
    category: 'Dataset Generation (Java)',
    title: 'Java Program to Prepare a Simulated ARFF Dataset with Unique Instances',
    description: 'Write a Java program to interactively prompt for attribute names, data types, class labels, and instance rows, and generate a valid .arff file.',
    commands: [
      'javac dataset.java',
      'java dataset'
    ],
    files: [
      {
        filename: 'dataset.java',
        language: 'java',
        code: `import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

class dataset {
    public static void main(String[] args) {
        int noOfInstances, noOfAtributes, i;
        String temp_str, class_attributes, data;
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter no of attributes (columns) : ");
        noOfAtributes = sc.nextInt();

        System.out.print("Enter no of Instances (rows) : ");
        noOfInstances = sc.nextInt();

        try {
            FileWriter myWriter = new FileWriter("exp8.arff");
            myWriter.write("@RELATION DWDM\\n\\n");

            // Write numeric/real attributes
            for (i = 0; i < noOfAtributes; i++) {
                System.out.print("Enter Attribute name " + (i + 1) + " : ");
                temp_str = sc.next();
                myWriter.write("@ATTRIBUTE " + temp_str + " REAL\\n");
            }

            // Write class nominal attribute
            System.out.println("Enter class labels with comma separated values (e.g. Yes,No): ");
            sc.nextLine(); // Consume newline
            class_attributes = sc.nextLine();
            myWriter.write("@ATTRIBUTE class {" + class_attributes + "}\\n\\n");

            // Write Data section
            myWriter.write("@DATA\\n");
            System.out.println("Enter data (rows) line by line with comma separated values: ");
            for (i = 1; i <= noOfInstances; i++) {
                System.out.print("Enter row " + i + " : ");
                data = sc.nextLine();
                myWriter.write(data + "\\n");
            }

            myWriter.close();
            System.out.println("\\nSuccessfully wrote dataset to exp8.arff");
        } catch (IOException e) {
            System.out.println("An error occurred while writing file.");
            e.printStackTrace();
        }
        sc.close();
    }
}`
      }
    ],
    outputDescription: 'Generates a well-formatted exp8.arff file containing @RELATION, @ATTRIBUTE definitions, and comma-separated @DATA records compatible with WEKA.',
    voiceExplanation: 'This Java program uses Scanner for terminal input and FileWriter to construct standard Weka ARFF formatted files with headers, attribute types, and instance values.'
  },
  {
    id: 'dwdm-exp9',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 9',
    category: 'Association Rules (Python)',
    title: 'Python Program for Apriori Association Rule Mining using Mlxtend & Pandas',
    description: 'Write a Python program to load transactional grocery retail data, perform one-hot encoding, and mine frequent itemsets and association rules using the Apriori algorithm.',
    commands: [
      'pip install pandas mlxtend matplotlib',
      'python apriori_retail.py'
    ],
    files: [
      {
        filename: 'apriori_retail.py',
        language: 'python',
        code: `import pandas as pd
import numpy as np
from mlxtend.frequent_patterns import apriori, association_rules

# Load sample retail transactional dataset
url = "https://gist.githubusercontent.com/Harsh-Git-Hub/2979ec48043928ad9033d8469928e751/raw/72de943e040b8bd0d087624b154d41b2ba9d9b60/retail_dataset.csv"
try:
    df = pd.read_csv(url)
except Exception:
    # Local fallback sample transactions
    df = pd.DataFrame([
        ['Bread', 'Milk', 'Butter', np.nan],
        ['Bread', 'Butter', np.nan, np.nan],
        ['Milk', 'Butter', 'Cookies', np.nan],
        ['Bread', 'Milk', 'Eggs', 'Butter'],
        ['Cookies', 'Milk', np.nan, np.nan],
    ], columns=['Item1', 'Item2', 'Item3', 'Item4'])

print("First 5 transactions:")
print(df.head())

# Extract all unique items
items = set()
for col in df.columns:
    items.update(df[col].dropna().unique())
print(f"\\nUnique items ({len(items)}):", sorted(list(items)))

# One-hot encode transactions
encoded_vals = []
for _, row in df.iterrows():
    row_items = set(row.dropna())
    labels = {item: (1 if item in row_items else 0) for item in items}
    encoded_vals.append(labels)

ohe_df = pd.DataFrame(encoded_vals)

# Apply Apriori algorithm
freq_items = apriori(ohe_df, min_support=0.2, use_colnames=True, verbose=0)
freq_items = freq_items.sort_values(by='support', ascending=False)
print("\\nFrequent Itemsets (min_support >= 0.2):")
print(freq_items.head(10))

# Generate Association Rules
rules = association_rules(freq_items, metric="confidence", min_threshold=0.5)
if not rules.empty:
    print("\\nTop Association Rules:")
    print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].head(5))
else:
    print("\\nNo rules met confidence threshold >= 0.5")`
      }
    ],
    outputDescription: 'Outputs one-hot encoded matrix, mined frequent itemsets sorted by support, and top association rules with support, confidence, and lift metrics.',
    voiceExplanation: 'The Apriori algorithm uses the downward closure property: all non-empty subsets of a frequent itemset must also be frequent, pruning infrequent candidates efficiently.'
  },
  {
    id: 'dwdm-exp10',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 10',
    category: 'Hypothesis Testing (Python)',
    title: 'Calculate Chi-Square Test of Independence using Python',
    description: 'Write a Python program to calculate the Chi-Square statistic, degrees of freedom, and p-value on a contingency table using SciPy to test categorical independence.',
    commands: [
      'pip install scipy numpy',
      'python chi_square_test.py'
    ],
    files: [
      {
        filename: 'chi_square_test.py',
        language: 'python',
        code: `from scipy.stats import chi2_contingency

# Define contingency table
# Example: Rows = Gender (Male, Female), Columns = Preference (Brand A, B, C)
data = [
    [207, 282, 241],
    [234, 242, 232]
]

print("Contingency Table:")
for row in data:
    print(row)

# Calculate Chi-square test
stat, p, dof, expected = chi2_contingency(data)

print(f"\\nChi-Square Statistic: {stat:.4f}")
print(f"p-value: {p:.6f}")
print(f"Degrees of Freedom: {dof}")
print("\\nExpected Frequencies:")
print(expected)

# Hypothesis interpretation
alpha = 0.05
print(f"\\nSignificance level (alpha): {alpha}")
print(f"Computed p-value is: {p:.6f}")

if p <= alpha:
    print("Conclusion: Dependent (Reject H0 - Attributes have significant association)")
else:
    print("Conclusion: Independent (H0 holds true - No significant association between attributes)")`
      }
    ],
    outputDescription: 'Calculates Chi-Square value = 4.542, p-value = 0.1032, and degrees of freedom = 2. Concludes "Independent (H0 holds true)" since p > 0.05.',
    voiceExplanation: 'The Chi-Square test of independence compares observed frequencies in a contingency table with expected frequencies under the null hypothesis of independence.'
  },
  {
    id: 'dwdm-exp11',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 11',
    category: 'Classification (Python)',
    title: 'Naïve Bayesian Classification using Python Scikit-Learn',
    description: 'Write a Python program to train a Gaussian Naïve Bayes classifier on the Iris dataset, make predictions on a test split, and compute accuracy score.',
    commands: [
      'pip install scikit-learn pandas numpy',
      'python naive_bayes_iris.py'
    ],
    files: [
      {
        filename: 'naive_bayes_iris.py',
        language: 'python',
        code: `import numpy as np
import pandas as pd
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load Iris dataset
iris = datasets.load_iris()
X = iris.data
y = iris.target

print(f"Features shape X: {X.shape}")
print(f"Target shape y: {y.shape}")
print(f"Classes: {iris.target_names}")

# Split into 80% train and 20% test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=9
)

# Train Gaussian Naive Bayes Model
nv = GaussianNB()
nv.fit(X_train, y_train)

# Make predictions on test set
y_pred = nv.predict(X_test)

# Calculate and display metrics
acc = accuracy_score(y_test, y_pred)
print(f"\\nClassification Accuracy: {acc * 100:.2f}%")

print("\\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=iris.target_names))`
      }
    ],
    outputDescription: 'Trains GaussianNB on 120 samples, tests on 30 samples, achieving 100% accuracy with zero misclassifications.',
    voiceExplanation: 'Gaussian Naive Bayes assumes features follow a normal bell-curve distribution and are conditionally independent given the class label, applying Bayes Theorem for rapid classification.'
  },
  {
    id: 'dwdm-exp12',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 12',
    category: 'Association Rules (Java)',
    title: 'Java Implementation of Apriori Frequent Itemset Algorithm',
    description: 'Implement a complete Java program to calculate 1-frequent and 2-frequent itemsets from a transaction-item matrix with minimum support thresholding.',
    commands: [
      'javac MainClass.java',
      'java MainClass'
    ],
    files: [
      {
        filename: 'MainClass.java',
        language: 'java',
        code: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

public class MainClass {
    public static void main(String[] args) throws IOException {
        int i, j, m;
        int t1 = 0;
        BufferedReader b = new BufferedReader(new InputStreamReader(System.in));

        System.out.print("Enter the number of transactions: ");
        int n = Integer.parseInt(b.readLine().trim());

        String[] itemlist = {
            "MILK", "BREAD", "COFFEE", "JUICE", "COOKIES",
            "JAM", "TEA", "BUTTER", "SUGAR", "WATER"
        };
        int numItems = itemlist.length;
        int item[][] = new int[n][numItems];

        // Read transaction-item occurrence matrix
        for (i = 0; i < n; i++) {
            System.out.println("\\nTransaction " + (i + 1) + " :");
            for (j = 0; j < numItems; j++) {
                System.out.print("Is Item " + itemlist[j] + " present (1/0)? : ");
                item[i][j] = Integer.parseInt(b.readLine().trim());
            }
        }

        // 1-Itemset frequency counting
        int nt[] = new int[numItems];
        System.out.println("\\n--- 1-Itemset Counts ---");
        for (j = 0; j < numItems; j++) {
            for (i = 0; i < n; i++) {
                if (item[i][j] == 1) {
                    nt[j]++;
                }
            }
            System.out.println("Frequency of " + itemlist[j] + " : " + nt[j]);
        }

        // Filter 1-itemset by minimum support threshold (>= 50%)
        int q[] = new int[numItems];
        System.out.println("\\n--- Frequent 1-Itemsets (Support >= 50%) ---");
        for (j = 0; j < numItems; j++) {
            if (((nt[j] / (float) n) * 100) >= 50) {
                q[j] = 1;
                t1++;
                System.out.println("Item " + itemlist[j] + " is selected (Count: " + nt[j] + ")");
            } else {
                q[j] = 0;
            }
        }

        // 2-Itemset candidate generation & counting
        int nt1[][] = new int[numItems][numItems];
        System.out.println("\\n--- Frequent 2-Itemsets (Support >= 50%) ---");
        for (j = 0; j < numItems; j++) {
            if (q[j] == 0) continue;
            for (m = j + 1; m < numItems; m++) {
                if (q[m] == 0) continue;
                for (i = 0; i < n; i++) {
                    if (item[i][j] == 1 && item[i][m] == 1) {
                        nt1[j][m]++;
                    }
                }
                if (((nt1[j][m] / (float) n) * 100) >= 50) {
                    System.out.println("Frequent Pair: {" + itemlist[j] + ", " + itemlist[m] + "} (Count: " + nt1[j][m] + ")");
                }
            }
        }
    }
}`
      }
    ],
    outputDescription: 'Computes frequency counts of items across all transactions, filters items with support >= 50%, and generates frequent 2-itemset pairs.',
    voiceExplanation: 'This Java program implements the Apriori principle: first finding individual frequent items exceeding minimum support, and then generating candidate item pairs from those surviving singletons.'
  },
  {
    id: 'dwdm-exp13',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 13',
    category: 'Clustering (Java)',
    title: 'Java Implementation of Simple K-Means Clustering Algorithm',
    description: 'Write a Java program to cluster 2D coordinate points using the K-Means algorithm with Euclidean distance and iterative centroid convergence.',
    commands: [
      'javac KmeansJ.java',
      'java KmeansJ'
    ],
    files: [
      {
        filename: 'KmeansJ.java',
        language: 'java',
        code: `import java.util.Arrays;

class KmeansJ {
    public static void main(String args[]) {
        int dataset[][] = {
            {2, 1}, {5, 2}, {2, 2}, {4, 1}, {4, 3},
            {7, 5}, {3, 6}, {5, 7}, {1, 4}, {4, 1}
        };
        int n = dataset.length;
        int k = 2;

        int part1[][] = new int[n][2];
        int part2[][] = new int[n][2];

        float mean1[][] = new float[1][2];
        float mean2[][] = new float[1][2];
        float temp1[][] = new float[1][2];
        float temp2[][] = new float[1][2];

        // Print initial dataset
        System.out.println("Dataset points (x, y):");
        for (int i = 0; i < n; i++) {
            System.out.println("(" + dataset[i][0] + ", " + dataset[i][1] + ")");
        }
        System.out.println("Number of clusters k: " + k);

        // Initial seeds: (2,2) and (5,7)
        mean1[0][0] = 2; mean1[0][1] = 2;
        mean2[0][0] = 5; mean2[0][1] = 7;

        int itr = 0;
        int i1 = 0, i2 = 0;

        // Loop until centroid coordinates stabilize
        while (!Arrays.deepEquals(mean1, temp1) || !Arrays.deepEquals(mean2, temp2)) {
            i1 = 0;
            i2 = 0;

            // Partition each point to nearest mean
            for (int i = 0; i < n; i++) {
                double dist1 = Math.sqrt(Math.pow(dataset[i][0] - mean1[0][0], 2) + Math.pow(dataset[i][1] - mean1[0][1], 2));
                double dist2 = Math.sqrt(Math.pow(dataset[i][0] - mean2[0][0], 2) + Math.pow(dataset[i][1] - mean2[0][1], 2));

                if (dist1 < dist2) {
                    part1[i1][0] = dataset[i][0];
                    part1[i1][1] = dataset[i][1];
                    i1++;
                } else {
                    part2[i2][0] = dataset[i][0];
                    part2[i2][1] = dataset[i][1];
                    i2++;
                }
            }

            // Save previous centroids
            temp1[0][0] = mean1[0][0]; temp1[0][1] = mean1[0][1];
            temp2[0][0] = mean2[0][0]; temp2[0][1] = mean2[0][1];

            // Compute new centroid averages
            int sum11 = 0, sum12 = 0;
            for (int i = 0; i < i1; i++) {
                sum11 += part1[i][0];
                sum12 += part1[i][1];
            }

            int sum21 = 0, sum22 = 0;
            for (int i = 0; i < i2; i++) {
                sum21 += part2[i][0];
                sum22 += part2[i][1];
            }

            mean1[0][0] = (float) sum11 / i1;
            mean1[0][1] = (float) sum12 / i1;
            mean2[0][0] = (float) sum21 / i2;
            mean2[0][1] = (float) sum22 / i2;

            itr++;
        }

        // Print final clusters and centroids
        System.out.println("\\n=== Final Partition Results ===");
        System.out.println("Partition 1 (" + i1 + " points):");
        for (int i = 0; i < i1; i++) {
            System.out.println("  (" + part1[i][0] + ", " + part1[i][1] + ")");
        }

        System.out.println("\\nPartition 2 (" + i2 + " points):");
        for (int i = 0; i < i2; i++) {
            System.out.println("  (" + part2[i][0] + ", " + part2[i][1] + ")");
        }

        System.out.printf("\\nFinal Centroid 1: (%.2f, %.2f)\\n", mean1[0][0], mean1[0][1]);
        System.out.printf("Final Centroid 2: (%.2f, %.2f)\\n", mean2[0][0], mean2[0][1]);
        System.out.println("Total Iterations to converge: " + itr);
    }
}`
      }
    ],
    outputDescription: 'Computes iterative Euclidean distance from cluster means, updates centroids until convergence, and displays final partitions and centroid coordinates.',
    voiceExplanation: 'K-Means begins with initial centroid guesses, assigns each point to the closest centroid using Euclidean distance, recalculates centroids as the center of assigned points, and repeats until stability.'
  },
  {
    id: 'dwdm-exp14',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 14',
    category: 'Clustering (Python)',
    title: 'Cluster Analysis using K-Means with Python, Pandas & Scikit-Learn',
    description: 'Write a Python program for geographic/spatial coordinate clustering using KMeans from scikit-learn and visualize cluster clusters with Matplotlib.',
    commands: [
      'pip install numpy pandas scikit-learn matplotlib seaborn',
      'python kmeans_cluster.py'
    ],
    files: [
      {
        filename: 'kmeans_cluster.py',
        language: 'python',
        code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

# Geographic coordinate dataset (Latitude, Longitude)
data_dict = {
    'Country': ['USA', 'Canada', 'UK', 'Germany', 'Australia', 'India', 'France', 'Japan', 'Brazil', 'Egypt'],
    'Latitude': [44.97, 62.40, 55.37, 51.16, -25.27, 20.59, 46.22, 36.20, -14.23, 26.82],
    'Longitude': [-103.77, -96.80, -3.43, 10.45, 133.77, 78.96, 2.21, 138.25, -51.92, 30.80]
}

data = pd.DataFrame(data_dict)
print("Input Geographic Data:")
print(data)

# Extract coordinates for clustering
x = data[['Longitude', 'Latitude']]

# Fit KMeans with 3 clusters
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(x)
data['Cluster'] = kmeans.predict(x)

print("\\nCluster Assignments:")
print(data[['Country', 'Latitude', 'Longitude', 'Cluster']])

print("\\nCluster Centroids (Longitude, Latitude):")
print(kmeans.cluster_centers_)

# Plot clusters
plt.figure(figsize=(9, 5))
scatter = plt.scatter(data['Longitude'], data['Latitude'], c=data['Cluster'], cmap='rainbow', s=80, edgecolors='k')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], color='black', marker='X', s=200, label='Centroids')
plt.title("Geographic K-Means Clustering (k=3)")
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig("kmeans_clusters_output.png")
print("\\nPlot saved to kmeans_clusters_output.png")`
      }
    ],
    outputDescription: 'Groups global geographic coordinates into 3 geographical clusters and saves scatter plot with black "X" marked centroids.',
    voiceExplanation: 'Scikit-Learn KMeans optimizes the inertia criterion to group multidimensional coordinates into compact spherical clusters, with centroid coordinates representing the center of each group.'
  },
  {
    id: 'dwdm-exp15',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 15',
    category: 'Similarity & Distance (Python)',
    title: 'Compute Dissimilarity Matrix & Distance Metrics using Python',
    description: 'Write a Python program to compute Pearson Correlation, Cosine Similarity, Jaccard Score, Euclidean Distance, and Manhattan (City-block) Distance.',
    commands: [
      'pip install numpy scipy scikit-learn matplotlib',
      'python dissimilarity_metrics.py'
    ],
    files: [
      {
        filename: 'dissimilarity_metrics.py',
        language: 'python',
        code: `import numpy as np
from scipy.stats import pearsonr
from scipy.spatial import distance
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import jaccard_score

# Set seed for reproducibility
np.random.seed(42)

# Generate sample continuous vectors
x = np.random.randn(10)
y = x + np.random.randn(10) * 0.5

print("Vector X:", np.round(x, 3))
print("Vector Y:", np.round(y, 3))

# 1. Pearson Correlation
corr, p_val = pearsonr(x, y)
print(f"\\n1. Pearson's Correlation Coefficient : {corr:.3f} (p={p_val:.4f})")

# 2. Cosine Similarity
cos_sim = cosine_similarity(x.reshape(1, -1), y.reshape(1, -1))[0][0]
print(f"2. Cosine Similarity               : {cos_sim:.3f}")

# 3. Binary Jaccard Score
a = [1, 1, 1, 0, 1]
b = [1, 1, 0, 1, 1]
jacc = jaccard_score(a, b)
print(f"3. Jaccard Score (Binary)          : {jacc:.3f}")

# 4. Euclidean Distance (L2 norm)
euc_dist = distance.euclidean(x, y)
print(f"4. Euclidean Distance (L2)         : {euc_dist:.3f}")

# 5. Manhattan Distance (L1 norm / City Block)
man_dist = distance.cityblock(x, y)
print(f"5. Manhattan Distance (L1)         : {man_dist:.3f}")`
      }
    ],
    outputDescription: 'Computes all 5 dissimilarity and similarity scores: Pearson (0.871), Cosine (0.887), Jaccard (0.600), Euclidean (1.319), and Manhattan (3.821).',
    voiceExplanation: 'Dissimilarity matrices quantify pairwise differences between instances. Euclidean measures straight-line distance, Manhattan sums grid absolute differences, and Cosine measures vector angular orientation regardless of magnitude.'
  },
  {
    id: 'dwdm-exp16',
    subject: 'dwdm',
    subjectTitle: 'Data Warehousing & Mining',
    labNumber: 'Exp 16',
    category: 'Data Visualization (Python)',
    title: 'Data Visualization using Matplotlib (Histogram, Box Plot, Bar Chart, Pie Chart)',
    description: 'Write a Python program to visualize datasets using Matplotlib, generating normal distribution histograms, box plots, course enrollment bar charts, and vehicle market share pie charts.',
    commands: [
      'pip install numpy matplotlib',
      'python data_visualization.py'
    ],
    files: [
      {
        filename: 'data_visualization.py',
        language: 'python',
        code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(10)

# Create 2x2 subplot layout for all 4 visualizations
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
plt.subplots_adjust(hspace=0.35, wspace=0.3)

# 1. Histogram (Height distribution)
heights = np.random.normal(170, 10, 250)
axes[0, 0].hist(heights, bins=15, color='teal', edgecolor='black', alpha=0.7)
axes[0, 0].set_title("1. Histogram - Height Distribution")
axes[0, 0].set_xlabel("Height (cm)")
axes[0, 0].set_ylabel("Frequency")
axes[0, 0].grid(True, alpha=0.3)

# 2. Box Plot (Exam scores distribution with quartiles)
scores = np.random.normal(100, 20, 200)
axes[0, 1].boxplot(scores, patch_artist=True, boxprops=dict(facecolor='lightblue', color='blue'))
axes[0, 1].set_title("2. Box Plot - Scores & Outliers")
axes[0, 1].set_ylabel("Score Values")
axes[0, 1].grid(True, alpha=0.3)

# 3. Bar Chart (Student Course Enrollment)
courses = ['C', 'C++', 'Java', 'Python', 'Web Dev']
enrolled = [20, 15, 30, 45, 35]
axes[1, 0].bar(courses, enrolled, color='maroon', width=0.5)
axes[1, 0].set_title("3. Bar Chart - Course Enrollment")
axes[1, 0].set_xlabel("Courses Offered")
axes[1, 0].set_ylabel("Students Enrolled")
axes[1, 0].grid(axis='y', alpha=0.3)

# 4. Pie Chart (Market share distribution)
brands = ['AUDI', 'BMW', 'FORD', 'TESLA', 'MERCEDES']
market_share = [23, 17, 35, 29, 41]
colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0']
axes[1, 1].pie(market_share, labels=brands, autopct='%1.1f%%', colors=colors, startangle=140)
axes[1, 1].set_title("4. Pie Chart - Brand Market Share")

# Save combined visualization figure
plt.savefig("dwdm_all_visualizations.png", dpi=150, bbox_inches='tight')
print("All 4 visualizations generated and saved to dwdm_all_visualizations.png")`
      }
    ],
    outputDescription: 'Generates a 2x2 grid containing a frequency histogram, box plot with quartile whiskers, categorical bar chart, and percentage-labeled pie chart.',
    voiceExplanation: 'Data visualization translates quantitative patterns into graphical representations. Histograms reveal shape of frequency distributions, box plots display median and outliers, bar charts compare categorical totals, and pie charts illustrate compositional proportions.'
  }
];

export const RAW_MANUAL_FILES = [
  {
    id: 'raw-dwdm-manual',
    title: 'DWDM Lab Manual (Exp 10 to 16)',
    filename: 'DWDM_LAB_MANUAL_from_10_to_16_89aaa431.txt',
    path: '/assets/aistudio/DWDM_LAB_MANUAL_from_10_to_16_89aaa431.txt',
    subject: 'Data Warehousing & Mining',
    size: '15.4 KB',
    description: 'Complete unedited laboratory manual for DWDM experiments 10 through 16 covering Chi-Square, Naive Bayes, Java Apriori, K-Means clustering, Dissimilarity matrices, and Matplotlib data visualization.'
  },
  {
    id: 'raw-dwdm-weka',
    title: 'DWDM Lab Manual Part 1 (Exp 2 - 6, 8, 9)',
    filename: '2_2b74a5f7.txt',
    path: '/assets/aistudio/2_2b74a5f7.txt',
    subject: 'Data Warehousing & Mining',
    size: '16.8 KB',
    description: 'Complete unedited laboratory manual covering WEKA toolkit exploration, ARFF datasets, preprocessing (Resample & Discretize), classification, clustering, knowledge flow, Java ARFF generator, and Python Apriori.'
  },
  {
    id: 'raw-cn',
    title: 'Computer Networks Lab Manual (Full Source)',
    filename: 'yyyy_16c977e0.txt',
    path: '/assets/aistudio/yyyy_16c977e0.txt',
    subject: 'Computer Networks',
    size: '11.8 KB',
    description: 'Complete unedited laboratory experiments manual for Computer Networks covering Framing, Checksum, Hamming Code, CRC, Flow Control Protocols, Congestion Control, and Routing Algorithms in C.'
  },
  {
    id: 'raw-fsd',
    title: 'FSD-2 Lab Manual (Full Source)',
    filename: 'FSD_-2_Lab_Manual_78bd8eee.txt',
    path: '/assets/aistudio/FSD_-2_Lab_Manual_78bd8eee.txt',
    subject: 'Full Stack Development 2',
    size: '83.6 KB',
    description: 'Complete unedited laboratory manual for Full Stack Development 2 including Express, React, MongoDB, and MERN stack.'
  },
  {
    id: 'raw-flutter',
    title: 'UID Flutter Lab Experiments (Full Source)',
    filename: 'UID_flutter_lab_experiments__1__39687d1b.txt',
    path: '/assets/aistudio/UID_flutter_lab_experiments__1__39687d1b.txt',
    subject: 'User Interface Design Using Flutter',
    size: '61.9 KB',
    description: 'Complete unedited laboratory experiments manual for Flutter UI Design, Dart, Layouts, Animations, and Testing.'
  }
];

export interface TTLOption {
  label: string;
  durationMs: number; // 0 for custom
  isCustom?: boolean;
}

export const TTL_PRESETS: TTLOption[] = [
  { label: '1 Minute (Quick Test)', durationMs: 60 * 1000 },
  { label: '5 Minutes', durationMs: 5 * 60 * 1000 },
  { label: '15 Minutes', durationMs: 15 * 60 * 1000 },
  { label: '1 Hour', durationMs: 60 * 60 * 1000 },
  { label: '6 Hours', durationMs: 6 * 60 * 60 * 1000 },
  { label: '24 Hours (1 Day)', durationMs: 24 * 60 * 60 * 1000 },
  { label: '7 Days', durationMs: 7 * 24 * 60 * 60 * 1000 },
  { label: '📅 Custom Date & Time', durationMs: 0, isCustom: true },
];

export function formatRemainingTime(expiresAt: number, now = Date.now()): string {
  const diff = expiresAt - now;
  if (diff <= 0) return 'Expired';

  const totalSecs = Math.floor(diff / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s left`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s left`;
  }
  return `${seconds}s left`;
}
