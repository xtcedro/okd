const fs = require("fs");
const path = require("path");

// Define the directory structure
const directories = [
    "frontend/public",
    "frontend/src",
    "frontend/src/assets/css",
    "frontend/src/assets/images",
    "frontend/src/assets/js",
    "frontend/src/components",
    "frontend/src/context",
    "frontend/src/hooks",
    "frontend/src/pages",
    "frontend/src/routes",
    "frontend/src/services"
];

// Define the files with initial content
const files = {
    "frontend/src/pages/Home.js": `import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/home.css";

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero">
                <h1>Welcome to Dominguez Tech Solutions</h1>
                <p>Empowering businesses with AI-driven solutions.</p>
                <Link to="/hops-dashboard" className="cta-button">Explore HOPS AI</Link>
            </section>
        </div>
    );
};

export default Home;`,

    "frontend/src/assets/css/home.css": `.home-container {
    text-align: center;
    font-family: 'Arial', sans-serif;
}

.hero {
    background-color: #00274D;
    color: #FFD700;
    padding: 50px 20px;
}

.cta-button {
    display: inline-block;
    background: #FFD700;
    color: #00274D;
    padding: 10px 20px;
    text-decoration: none;
    font-weight: bold;
    border-radius: 5px;
}

.cta-button:hover {
    background: #ffcc00;
}`,

    "frontend/src/routes/AppRouter.js": `import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;`,

    "frontend/src/App.js": `import React from "react";
import AppRouter from "./routes/AppRouter";

function App() {
    return <AppRouter />;
}

export default App;`,

    "frontend/src/index.js": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);`,

    "frontend/package.json": `{
    "name": "hops-frontend",
    "version": "1.0.0",
    "private": true,
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.12.0"
    }
}`
};

// Function to create directories
const createDirectories = () => {
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        }
    });
};

// Function to create files
const createFiles = () => {
    Object.keys(files).forEach(filePath => {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, files[filePath], "utf8");
            console.log(`✅ Created file: ${filePath}`);
        }
    });
};

// Run the script
const setupProject = () => {
    createDirectories();
    createFiles();
    console.log("🎉 React file structure created successfully!");
};

setupProject();