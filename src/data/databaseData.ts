export interface CodeFile {
  filename: string;
  language: 'javascript' | 'dart' | 'html' | 'css' | 'json' | 'shell' | 'yaml';
  code: string;
  description?: string;
}

export interface Experiment {
  id: string;
  subject: 'fsd' | 'flutter' | 'custom' | 'temporary';
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
  { id: 'all', name: 'All Database Files', count: 42 },
  { id: 'temporary', name: '⏳ Temporary Database', count: 0 },
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
  }
];

export const RAW_MANUAL_FILES = [
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
