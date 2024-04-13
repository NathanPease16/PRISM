# Installation Guide
Detailed instructions for setting up PRISM in various environments. Ensure you have the necessary prerequisites installed before you begin

## Prerequisites
- [Node.js](https://nodejs.org/en/download)
- [MongoDB](https://www.mongodb.com/docs/manual/tutorial/getting-started/)

### Running local host
*This will only be accessible from the machine running the server, no other machines will be able to connect*
1. **Clone the repository:**
   - **Terminal**: Execute the following command:
        ```
        git clone https://github.com/NathanPease16/PRISM.git
        ```
   - **VS Code**:
     - Press `Ctrl+Shift+P` to open the command palette
     - Type `>Git: Clone` and select it
     - Enter the repository URL: `https://github.com/NathanPease16/PRISM.git` and proceed
2. **Install all dependencies:**
    - Execute the following command in the root directory of the cloned project:
        ```
        npm install
        ```
3. **Add environment files:**
    - In the root directory of the project add a file titled `.env`, replacing `<YOUR MONGO URI>` with your Mongo URI
    - Enter the following in the `.env` file
        ```
        MONGO_URI=<YOUR MONGO URI>
        ```
    - Docs on finding your Mongo URI can be found [here](https://www.mongodb.com/basics/mongodb-connection-string) (Recommended to connect using VS Code)
4. **Run the server:**
    - Execute the following command in the root directory of the cloned project:
        ```
        npm start
        ```

### Using [Render](https://render.com/)
1. **Create an Account on Render:**
    - Sign up for a Render account and navigate to your dashboard
2. **Create a New Web Service:**
    - Click `New`, then select `Web Service`
    - Choose `Build and deploy from a Git repository` and click `Next`
3. **Configure the Repository:**
    - Under `Public Git Repository`, enter:
        ```
        https://github.com/NathanPease16/PRISM.git
        ```
    - Click `Continue`
4. **Configure Your Service:**
    - Enter a service name and select the best server region
    - Set `Branch` to `main`
    - Set `Runtime` to `Node`
    - Configure runtime to `Node`, with `npm install` as the build command and `node src/app.js` as the start command
5. **Instances and Environment Setup:**
    - Select the appropriate instance type for your needs
    - Define environment variables, specifically for `MONGO_URI`:
        - `NAME_OF_VARIABLE` &rarr; `MONGO_URI`
        - `value` &rarr; `<YOUR MONGO URI>`
        - Docs on finding your Mongo URI can be found [here](https://www.mongodb.com/basics/mongodb-connection-string) (Recommended to connect using VS Code)
6. **Launch your Service:**
    - Click `Create Web Service`
    - Allow render to complete initial setup, which may take some time