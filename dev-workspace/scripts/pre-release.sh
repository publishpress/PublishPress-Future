#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to validate version number format (x.x.x)
validate_version() {
    if ! [[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
        echo "Invalid version format. Please use x.x.x or x.x.x-beta.x"
        exit 1
    fi
}

# Function to create release checklist
create_checklist() {
    cat << EOF
To release the Free plugin version $1, ensure you complete all the tasks below.

## Pre-release Checklist

- [ ] Create the release branch as \`release-$1\` from the development branch.
- [ ] Review and merge all relevant Pull Requests into the release branch.
- [ ] Update the version number to a beta version in the main plugin file as per [tech documentation](https://rambleventures.slab.com/posts/version-numbers-58nmrk4b), and commit to the release branch.
- [ ] Start a dev-workspace session.
- [ ] Run \`composer update\` (updating root and lib vendors).
- [ ] Review updated packages and mention any production library updates in the changelog.
- [ ] Inspect GitHub’s Dependabot warnings or Pull Requests. Resolve any false positives, then fix and commit the remaining issues.
- [ ] If needed, build JS files for production using \`composer build:js\` and commit changes.
- [ ] Run a code quality check with \`composer check\` and fix the highlighted issues.
- [ ] Update the language files with \`composer gen:lang\` and note this in the changelog.
- [ ] For minor and patch releases, maintain backward compatibility (e.g., renamed or moved classes, namespaces, functions). Include deprecation comments and note this in the changelog. Major releases may remove deprecated code; always note this in the changelog.
- [ ] Update the changelog in \`/CHANGELOG.md\` with a user-friendly description and correct release date.
- [ ] Update the changelog in \`readme.txt\`, maintaining records of the last 4-5 releases only.
- [ ] Confirm there are no uncommitted changes.
- [ ] Build the zip package with \`composer build\`, creating a new beta package in the \`./dist\` directory.
- [ ] Distribute the new package to the team for testing.

## Deployment Checklist

- [ ] Update the version number to a stable version in the main plugin file and \`readme.txt\` as per [tech documentation](https://rambleventures.slab.com/posts/version-numbers-58nmrk4b), and commit to the release branch.
- [ ] If anything changed in the code after test package distribution, redo the pre-release checklist.
- [ ] Build the final zip package with \`composer build\`, creating a new package in the \`./dist\` directory.
- [ ] Create and merge a Pull Request for the release branch into the \`main\` branch. Delete the release branch.
- [ ] Establish the GitHub release on the \`main\` branch with the correct tag.
- [ ] Merge the \`main\` branch into the \`develop\` branch.
- [ ] Follow up with the deployment process on the [GitHub Actions](https://github.com/publishpress/PublishPress-Future/actions) page.
- [ ] Await WordPress's version number update and perform a final test by updating the plugin on a staging site.

## Notes
- Release version: $1
- Created on: $(date +"%Y-%m-%d")
EOF
}

# Get current branch
current_branch=$(git branch --show-current)

# Ensure we're on main/master branch
if [[ "$current_branch" != "main" && "$current_branch" != "master" ]]; then
    echo -e "${YELLOW}Warning: You're not on main/master branch. Current branch: $current_branch${NC}"
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Ensure working directory is clean
if [[ -n $(git status -s) ]]; then
    echo "Error: Working directory is not clean. Please commit or stash changes first."
    exit 1
fi

# Get latest changes from remote
echo "Fetching latest changes..."
git fetch origin

# Prompt for version number
read -p "Enter the version number to release (x.x.x): " version

# Validate version number
validate_version $version

# Create branch name
branch_name="release-$version"

# Create and checkout new branch
echo -e "${GREEN}Creating branch $branch_name...${NC}"
git checkout -b $branch_name

# Push branch to remote
echo -e "${GREEN}Pushing branch to remote...${NC}"
git push -u origin $branch_name

# Generate checklist
checklist=$(create_checklist $version)

# Create pull request using GitHub CLI
if command -v gh &> /dev/null; then
# Check gh is authenticated
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}Warning: GitHub credentials are not set up.${NC}"
        exit 1
    fi

    echo -e "${GREEN}Creating pull request...${NC}"
    gh pr create \
        --title "Release $version" \
        --body "$checklist" \
        --base main \
        --head $branch_name

    echo -e "${GREEN}Pull request created successfully!${NC}"
else
    echo "GitHub CLI (gh) is not installed. Please install it to create pull requests automatically."
    echo "You can create the pull request manually with this checklist:"
    echo "$checklist"
fi
