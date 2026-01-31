#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "================================================"
echo "  Node.js Development Environment Setup"
echo "================================================"
echo ""

# Update apt if needed
print_action "Updating package lists..."
if sudo apt update; then
    print_success "Package lists updated"
else
    print_error "Failed to update package lists"
    exit 1
fi
echo ""

# Check and install curl
print_action "Checking for curl..."
if command -v curl &> /dev/null; then
    print_skip "curl is already installed ($(curl --version | head -n1))"
else
    print_info "curl not found. Installing..."
    if sudo apt install -y curl; then
        print_success "curl installed successfully"
    else
        print_error "Failed to install curl"
        exit 1
    fi
fi
echo ""

# Check and install NVM
print_action "Checking for NVM..."
export NVM_DIR="$HOME/.nvm"
if [ -d "$NVM_DIR" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
    print_skip "NVM is already installed"
    source "$NVM_DIR/nvm.sh"
    print_info "NVM version: $(nvm --version)"
else
    print_info "NVM not found. Installing..."
    if curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
        
        # Source bashrc to load NVM
        if [ -f ~/.bashrc ]; then
            source ~/.bashrc 2>/dev/null || true
        fi
        
        # Load NVM for current session
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        print_success "NVM installed successfully"
        print_info "NVM version: $(nvm --version)"
    else
        print_error "Failed to install NVM"
        exit 1
    fi
fi
echo ""

# Check and install Node.js LTS
print_action "Checking for Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_skip "Node.js is already installed ($NODE_VERSION)"
    print_info "Checking for LTS updates..."
    nvm install --lts
    print_success "Node.js updated to latest LTS"
else
    print_info "Node.js not found. Installing LTS version..."
    if nvm install --lts; then
        print_success "Node.js LTS installed successfully"
    else
        print_error "Failed to install Node.js"
        exit 1
    fi
fi
print_info "Node.js version: $(node --version)"
print_info "npm version: $(npm --version)"
echo ""

# Check and install Yarn
print_action "Checking for Yarn..."
if command -v yarn &> /dev/null; then
    print_skip "Yarn is already installed ($(yarn --version))"
else
    print_info "Yarn not found. Installing globally..."
    if npm install -g yarn; then
        print_success "Yarn installed successfully"
        print_info "Yarn version: $(yarn --version)"
    else
        print_error "Failed to install Yarn"
        exit 1
    fi
fi
echo ""

# Check and install PM2
print_action "Checking for PM2..."
if command -v pm2 &> /dev/null; then
    CURRENT_PM2=$(pm2 --version)
    print_skip "PM2 is already installed ($CURRENT_PM2)"
    print_info "Updating PM2 to latest version..."
    if npm install -g pm2@latest; then
        print_success "PM2 updated to latest version"
        print_info "PM2 version: $(pm2 --version)"
    else
        print_error "Failed to update PM2"
    fi
else
    print_info "PM2 not found. Installing..."
    if npm install -g pm2@latest; then
        print_success "PM2 installed successfully"
        print_info "PM2 version: $(pm2 --version)"
    else
        print_error "Failed to install PM2"
        exit 1
    fi
fi
echo ""

# Check and restart Nginx
print_action "Checking for Nginx..."
if command -v nginx &> /dev/null; then
    print_info "Nginx found. Restarting service..."
    if sudo systemctl restart nginx; then
        print_success "Nginx restarted successfully"
        
        # Check nginx status
        if sudo systemctl is-active --quiet nginx; then
            print_success "Nginx is running"
        else
            print_error "Nginx failed to start"
        fi
    else
        print_error "Failed to restart Nginx"
    fi
else
    print_skip "Nginx is not installed. Skipping restart."
fi
echo ""

echo "================================================"
print_success "Setup completed successfully!"
echo "================================================"
echo ""
echo "Installed versions:"
echo "  • Node.js: $(node --version)"
echo "  • npm: $(npm --version)"
echo "  • Yarn: $(yarn --version)"
echo "  • PM2: $(pm2 --version)"
echo "  • NVM: $(nvm --version)"
echo ""
print_info "Please run 'source ~/.bashrc' or restart your terminal to ensure all changes take effect."