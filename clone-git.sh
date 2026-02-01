#!/bin/bash
# chmod +x clone-git.sh
# clone-git.sh
# Clones or pulls the repository, syncs files to deployment directory, and builds

# --- Configuration ---
REPO_URL="https://github.com/PENPAY-BY-AWABAH/awabah-agents-web.git"
TARGET_DIR="/home/awabah-agent/htdocs/agent.awabah.com"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

send_email_api() {
    local email_address="marshalgfx@gmail.com"
    local email_subject="Awabah-agent website update"

    # We encode the subject to ensure spaces and special characters don't break the URL
    local encoded_subject=$(echo "$email_subject" | jq -sRr @uri)

    echo "Sending email to $email_address..."

    # Perform the GET request
    # -s: Silent mode
    # -L: Follow redirects if any
    curl -s -L "https://www.awabah.com/email_sender/email=${email_address}&subject=${encoded_subject}&message=Awabah-agent-website update"

    echo -e "\nRequest completed."
}
# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_action() {
    echo -e "${BLUE}→ $1${NC}"
}

print_skip() {
    echo -e "${YELLOW}⊘ $1${NC}"
}

# Function to ensure Node/Yarn environment is loaded
load_node_env() {
    # Load NVM if it exists
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        \. "$NVM_DIR/nvm.sh"
        print_info "NVM loaded"
    fi
    
    # Source bashrc to get environment
    if [ -f ~/.bashrc ]; then
        source ~/.bashrc 2>/dev/null || true
    fi
    
    # Check if node is available
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found! Please install Node.js first."
        exit 1
    fi
    
    # Check if yarn is available, install if not
    if ! command -v yarn &> /dev/null; then
        print_info "Yarn not found. Installing yarn..."
        if npm install -g yarn; then
            print_success "Yarn installed successfully"
        else
            print_error "Failed to install yarn"
            exit 1
        fi
    fi
    
    print_info "Node.js: $(node --version)"
    print_info "Yarn: $(yarn --version)"
}

# Function to run yarn install
run_yarn_install() {
    print_action "Installing dependencies with yarn..."
    if yarn install; then
        print_success "Dependencies installed successfully"
        return 0
    else
        print_error "Failed to install dependencies"
        return 1
    fi
}

# Function to run yarn build
run_yarn_build() {
    print_action "Building project with yarn..."
    if yarn build; then
        print_success "Build completed successfully"
        send_email_api
        return 0
    else
        print_error "Build failed"
        return 1
    fi
}

# Check if repository URL is provided
if [ -z "$REPO_URL" ]; then
    print_error "Repository URL is required!"
    exit 1
fi

# Load Node/Yarn environment
load_node_env

# Check if directory exists
if [ ! -d "$TARGET_DIR/src" ]; then
    print_info "Directory does not exist: $TARGET_DIR"
    print_info "Creating directory and cloning repository..."
    
    # Create parent directory if needed
    PARENT_DIR=$(dirname "$TARGET_DIR")
    if [ ! -d "$PARENT_DIR" ]; then
        mkdir -p "$PARENT_DIR"
    fi
    
    # Clone the repository directly to target directory
    if git clone "$REPO_URL" "$TARGET_DIR"; then
        print_success "Repository cloned successfully!"
        
        # Change to target directory and checkout branch
        cd "$TARGET_DIR" || exit 1
        if [ -n "$BRANCH" ]; then
            git checkout "$BRANCH" 2>/dev/null || print_info "Using default branch"
        fi
        
        # Run yarn install and build
        run_yarn_install || exit 1
        run_yarn_build || exit 1
    else
        print_error "Failed to clone repository"
        exit 1
    fi
    
else
    # Directory exists - check if it's a git repository
    if [ -d "$TARGET_DIR/.git" ]; then
        print_info "Git repository detected. Checking for changes..."
        cd "$TARGET_DIR" || exit 1
        
        # Configure pull strategy
        git config pull.rebase false 2>/dev/null || true
        
        # Check if there are local changes
        if [[ -n $(git status --porcelain) ]]; then
            print_info "Local changes detected. Committing..."
            
            # Add all changes
            if git add .; then
                print_success "Changes staged"
                
                # Commit changes
                if git commit -m "Auto-commit: Local changes before pull $(date '+%Y-%m-%d %H:%M:%S')"; then
                    print_success "Changes committed"
                else
                    print_error "Failed to commit changes"
                    exit 1
                fi
            else
                print_error "Failed to stage changes"
                exit 1
            fi
        else
            print_skip "No local changes to commit"
        fi
        
        # Fetch remote changes
        print_action "Fetching remote changes..."
        if git fetch origin "$BRANCH"; then
            print_success "Remote fetched successfully"
            
            # Check if remote has new commits
            LOCAL_HASH=$(git rev-parse HEAD)
            REMOTE_HASH=$(git rev-parse origin/"$BRANCH")
            
            if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
                print_skip "Already up to date. No new changes from remote."
                print_info "Current commit: ${LOCAL_HASH:0:7}"
            else
                print_info "New changes detected on remote"
                print_info "Local:  ${LOCAL_HASH:0:7}"
                print_info "Remote: ${REMOTE_HASH:0:7}"
                
                # Pull the changes
                print_action "Pulling latest changes..."
                if git pull origin "$BRANCH"; then
                    print_success "Successfully pulled latest changes"
                    
                    # Run yarn install and build only if there are changes
                    run_yarn_install || exit 1
                    run_yarn_build || exit 1
                else
                    print_error "Failed to pull changes"
                    
                    # Check for merge conflicts
                    if git diff --name-only --diff-filter=U | grep -q .; then
                        print_error "Merge conflicts detected in:"
                        git diff --name-only --diff-filter=U
                        print_info "Please resolve conflicts manually"
                    fi
                    exit 1
                fi
            fi
        else
            print_error "Failed to fetch from remote"
            exit 1
        fi
    else
        print_error "Directory exists but is not a git repository: $TARGET_DIR"
        exit 1
    fi
fi

print_success "Operation completed successfully!"
print_info "Project is ready at: $TARGET_DIR"