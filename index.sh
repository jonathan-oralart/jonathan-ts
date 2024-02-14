#!/bin/bash

# Function to check Node version compatibility
check_node_version() {
    local major_version=$(node --version | cut -d '.' -f1 | cut -d 'v' -f2)
    if [ "$major_version" -lt 21 ]; then
        echo "Your Node version is less than the required version 21."
        echo "Please update your Node.js to version 21 or higher."
        exit 1
    fi
}

# Generate a default project name with dynamic date and increment
generate_project_name() {
    local base_name="test1_$(date +%a_%dth_%Y)"
    local counter=1
    local project_name="${base_name}"

    while [ -d "$project_name" ]; do
        let counter++
        project_name="${base_name}_$counter"
    done

    echo "$project_name"
}

# Check Node version compatibility
check_node_version

# Check if VS Code command line tool is installed
if ! command -v code &> /dev/null; then
    echo "VS Code (code command) is not installed. Please install it to open projects directly."
    exit 1
fi

# Generate default project name
projectName=$(generate_project_name)
echo "Using project name: $projectName"

echo "Cloning the project template..."
git clone --depth 1 https://github.com/jonathan-oralart/typescript-debug-vscode.git "$projectName" --quiet

# Remove the existing .git directory to start fresh
rm -rf "$projectName/.git"

# Change directory to the new project folder
cd "$projectName"

echo "Initializing a new git repository..."
git init > /dev/null

# Check if pnpm is installed, if not, install it
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm > /dev/null
fi

echo "Installing dependencies..."
pnpm install > /dev/null

echo "Opening project in Visual Studio Code..."
code .

echo "Project setup is complete."