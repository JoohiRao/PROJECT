TASKIFY

Tech Stack: MERN (MongoDB, Express.js, React.js, Node.js), Socket.io, Chart.js, JWT, TailWind CSS

--> Taskify is a real-time task management platform designed to streamline team collaboration and productivity. 
    It provides role-based access for Admins and Users, allowing efficient task assignment, status tracking, and performance analytics within teams.


FEATURES:
--> Authentication & Authorization
Secure login/signup using JWT.
Role-based access: Admin vs User.

 --> Team Management (Admin)
Create and manage teams.
Add/remove team members.
Assign tasks to specific users or teams.

--> Task Management
Create, update, and delete tasks.
Add priority (High/Medium/Low), sub-description, start date, due date, and reminders.
Set task status: Not Started, In Progress, Completed.
Filter/sort tasks by priority and status.

--> Dashboard & Visualization
Graphs showing task status and priority distribution.
Member-wise task performance tracking.
Priority-based task sorting.

Clean, modular React frontend.
RESTful API backend with Node.js + Express.


HOW TO SETUP AND RUN THE PROJECT

To set up and run this project, begin by cloning the repository using git clone,
then navigate into the project directory.
Install all necessary dependencies using npm install (for both frontend and backend if they are in separate folders).
Make sure you have Node.js and MongoDB installed and running locally. 
Set up your environment variables in a .env file (such as MongoDB URI, JWT secret, etc.).
Once everything is configured, start the backend server using npm start or npx nodemon and run the frontend with npm start in its directory. 
The application should now be accessible at http://localhost:5000 in your browser.


DEPENDENCIES AND CONFIGURATION REQUIRED 

This project requires the following dependencies:
Node.js for backend functionality.
React.js for the frontend development.
MongoDB for database storage .
Axios for making HTTP requests from the frontend.
Express for the backend API framework.
Mongoose for interacting with MongoDB.
dotenv for managing environment variables.
Tailwind CSS for frontend styling.
Nodemon for automatically restarting the backend server during development.




