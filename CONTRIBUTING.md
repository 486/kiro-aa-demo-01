# Contributing to kiro-aa-demo-01

Thank you for your interest in contributing to kiro-aa-demo-01! We welcome contributions from the community and are pleased that you want to help improve this project.

This document provides guidelines and instructions for contributing to the project. Please take a moment to review these guidelines before submitting your contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Contributing Code](#contributing-code)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community and Communication](#community-and-communication)
- [Questions](#questions)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

We are committed to providing a welcoming and inspiring community for all. Please be respectful, professional, and considerate in all interactions.

## Getting Started

Before you begin:
- Have you read the [README.md](README.md)?
- Check the [issue tracker](../../issues) to see if your issue or feature has already been reported
- Ensure you understand the project's goals and scope

## Prerequisites

To contribute to this project, you should have:

- **Git**: Familiarity with version control using Git
- **GitHub Account**: An active GitHub account to fork the repository and submit pull requests
- **Development Environment**: A properly configured development environment (see [Development Setup](#development-setup))
- **Communication**: Ability to communicate effectively in English for discussions and documentation

### Technical Prerequisites

Depending on the type of contribution you're making, you may need:
- Basic understanding of the project's technology stack
- Text editor or IDE of your choice
- Command-line interface (CLI) familiarity

## How to Contribute

There are many ways to contribute to this project:

### Reporting Bugs

If you find a bug in the project, please help us by submitting an issue. Before creating a new issue, please:

1. **Search existing issues** to ensure the bug hasn't already been reported
2. **Use the bug report template** if one is provided
3. **Provide detailed information**:
   - Clear and descriptive title
   - Steps to reproduce the issue
   - Expected behavior vs. actual behavior
   - Screenshots or error messages (if applicable)
   - Environment details (OS, version, browser, etc.)
   - Any additional context that might be helpful

**Example Bug Report:**

```markdown
**Title**: Application crashes when submitting empty form

**Description**: 
When attempting to submit the form without filling in any fields, 
the application crashes instead of showing validation errors.

**Steps to Reproduce**:
1. Navigate to the contact form page
2. Click the "Submit" button without entering any data
3. Observe the application crash

**Expected Behavior**: 
Validation errors should be displayed for required fields

**Actual Behavior**: 
Application crashes with error message: [error details]

**Environment**:
- OS: macOS 14.1
- Browser: Chrome 120.0
- Project Version: 1.2.3
```

### Suggesting Features

We welcome feature suggestions! To suggest a new feature:

1. **Check existing feature requests** to avoid duplicates
2. **Use the feature request template** if one is provided
3. **Clearly describe the feature**:
   - What problem does it solve?
   - How would it work?
   - Why is it valuable to the project?
   - Are there any alternatives you've considered?

**Example Feature Request:**

```markdown
**Title**: Add dark mode support

**Problem**: 
Users working in low-light environments find the current light theme 
difficult to use for extended periods.

**Proposed Solution**: 
Implement a dark mode theme that users can toggle via a settings menu.

**Benefits**:
- Improved user experience in various lighting conditions
- Reduced eye strain for extended usage
- Modern UI/UX practice

**Alternatives Considered**:
- Browser extensions (not ideal - requires user installation)
- System-based theme detection (could be added later)
```

### Contributing Code

We love code contributions! Whether it's bug fixes, new features, or improvements to existing functionality, your contributions are welcome.

**Before you start coding:**

1. **Check existing issues and pull requests** to avoid duplicate work
2. **Create or comment on an issue** to discuss your proposed changes
3. **Wait for maintainer feedback** before investing significant time
4. **Fork the repository** and create a feature branch

**Types of code contributions we accept:**

- Bug fixes
- New features (after discussion)
- Documentation improvements
- Performance optimizations
- Test coverage improvements
- Code refactoring for better maintainability
- Accessibility improvements
- Security enhancements

## Development Setup

Follow these steps to set up your development environment:

### 1. Fork and Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/kiro-aa-demo-01.git
cd kiro-aa-demo-01
```

### 2. Add Upstream Remote

```bash
# Add the original repository as upstream
git remote add upstream https://github.com/486/kiro-aa-demo-01.git

# Verify remotes
git remote -v
```

### 3. Create a Development Branch

```bash
# Ensure you're on the main branch
git checkout main

# Pull the latest changes from upstream
git pull upstream main

# Create a new branch for your work
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/feature-name` - For new features
- `fix/bug-description` - For bug fixes
- `docs/documentation-update` - For documentation changes
- `refactor/code-improvement` - For code refactoring
- `test/test-improvements` - For test additions or improvements

### 4. Install Dependencies

```bash
# Follow project-specific installation instructions
# Example commands (adjust based on your technology stack):

# For Node.js projects:
# npm install

# For Python projects:
# pip install -r requirements.txt

# For Go projects:
# go mod download

# For other projects, refer to README.md
```

### 5. Verify Your Setup

```bash
# Run tests to ensure everything is working
# Example commands:

# For Node.js:
# npm test

# For Python:
# pytest

# For Go:
# go test ./...
```

### 6. Make Your Changes

- Write clean, readable code
- Follow the project's code style guidelines
- Add or update tests as necessary
- Update documentation if you're changing functionality
- Commit your changes with clear, descriptive commit messages

### 7. Keep Your Branch Updated

```bash
# Regularly sync with upstream to avoid merge conflicts
git fetch upstream
git rebase upstream/main

# If there are conflicts, resolve them and continue
git rebase --continue
```

## Code Style Guidelines

Maintaining consistent code style helps keep the project readable and maintainable. Please follow these guidelines:

### General Principles

- **Write clear, self-documenting code**: Use meaningful variable and function names
- **Keep it simple**: Prefer simplicity over cleverness
- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed
- **Comment when necessary**: Explain "why", not "what"
- **Be consistent**: Follow the existing code style in the project

### Language-Specific Guidelines

#### JavaScript/TypeScript
- Use 2 spaces for indentation
- Use single quotes for strings
- Always use `const` or `let`, never `var`
- Use semicolons consistently
- Follow ESLint configuration if present

```javascript
// Good
const userName = 'John Doe';
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Avoid
var userName = "John Doe"
const calculateTotal = function(items) {
    var total = 0
    for(var i = 0; i < items.length; i++) {
        total = total + items[i].price
    }
    return total
}
```

#### Python
- Follow PEP 8 style guide
- Use 4 spaces for indentation
- Use snake_case for functions and variables
- Use PascalCase for classes
- Add docstrings to functions and classes

```python
# Good
def calculate_total(items):
    """Calculate the total price of all items.
    
    Args:
        items (list): List of item dictionaries with 'price' key
        
    Returns:
        float: Total price of all items
    """
    return sum(item['price'] for item in items)

# Avoid
def CalculateTotal(Items):
    Total = 0
    for Item in Items:
        Total = Total + Item['price']
    return Total
```

#### HTML/CSS
- Use 2 spaces for indentation
- Use lowercase for element names and attributes
- Use semantic HTML5 elements
- Keep CSS selectors specific but not overly complex
- Organize CSS properties logically

#### Markdown
- Use ATX-style headers (`#` syntax)
- Add blank lines around headers and code blocks
- Use code fences with language identifiers
- Keep line length reasonable (80-120 characters recommended)

### Commit Message Guidelines

Write clear, meaningful commit messages that describe what changed and why:

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat: add user authentication with JWT

Implement JWT-based authentication system including:
- Login and logout endpoints
- Token generation and validation
- Middleware for protected routes

Closes #123
```

```
fix: resolve memory leak in data processing

Update the data processor to properly release resources after use.
This prevents memory accumulation during long-running operations.

Fixes #456
```

## Pull Request Process

Follow these steps to submit a pull request:

### 1. Prepare Your Changes

- Ensure all tests pass
- Update documentation as needed
- Add tests for new functionality
- Verify code follows style guidelines
- Commit your changes with clear messages

### 2. Push to Your Fork

```bash
# Push your branch to your fork
git push origin feature/your-feature-name
```

### 3. Create the Pull Request

1. Navigate to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the pull request template (if provided)

### 4. Write a Clear PR Description

Your pull request should include:

- **Title**: Clear, concise description of the change
- **Description**: What changed and why
- **Related Issues**: Link to related issues using `Fixes #123` or `Relates to #456`
- **Testing**: How you tested the changes
- **Screenshots**: If applicable, for UI changes
- **Breaking Changes**: Note any breaking changes and migration steps

**Example Pull Request:**

```markdown
## Description
This PR adds user authentication using JWT tokens to secure API endpoints.

## Changes Made
- Implemented JWT token generation on login
- Added authentication middleware for protected routes
- Created user session management
- Added logout functionality

## Related Issues
Closes #123

## Testing
- Added unit tests for authentication functions (100% coverage)
- Tested login/logout flow manually
- Verified protected routes reject unauthorized requests
- Tested token expiration handling

## Breaking Changes
None - This is a new feature with no impact on existing functionality.

## Screenshots
N/A - Backend only changes
```

### 5. Respond to Review Feedback

- Be open to constructive feedback
- Make requested changes promptly
- Push updates to the same branch (they'll appear in the PR automatically)
- Mark conversations as resolved when addressed
- Ask questions if feedback is unclear

### 6. PR Approval and Merge

- Maintainers will review your PR
- Once approved, a maintainer will merge your changes
- You may be asked to rebase or squash commits
- After merge, you can delete your feature branch

### PR Checklist

Before submitting, ensure:

- [ ] Code follows the project's style guidelines
- [ ] All tests pass locally
- [ ] New code has adequate test coverage
- [ ] Documentation has been updated
- [ ] Commit messages are clear and follow conventions
- [ ] Branch is up to date with main/master
- [ ] No merge conflicts exist
- [ ] Self-review completed
- [ ] Related issues are linked

## Community and Communication

We believe in open, transparent communication. Here are ways to connect with the community:

### GitHub Discussions

- **General Questions**: Use GitHub Discussions for questions about using the project
- **Ideas and Brainstorming**: Share ideas for new features or improvements
- **Show and Tell**: Share what you've built with the project
- **Q&A**: Get help from maintainers and community members

### Issue Tracker

- **Bug Reports**: Report bugs via GitHub Issues
- **Feature Requests**: Propose new features via GitHub Issues
- **Task Tracking**: Track ongoing work and project progress

### Communication Channels

- **GitHub**: Primary platform for all project-related communication
- **Pull Request Comments**: For code review and implementation discussions
- **Issue Comments**: For bug reports, feature requests, and general discussion

### Getting Help

If you need help:

1. **Check the documentation**: Start with README.md and this file
2. **Search existing issues**: Your question may have been answered already
3. **Ask in GitHub Discussions**: Post your question with relevant context
4. **Be patient and respectful**: Maintainers contribute in their spare time

### Maintainer Response Time

Please note:
- We aim to respond to issues and PRs within 3-5 business days
- Complex changes may require more time for review
- Security issues are prioritized and addressed quickly

## Questions

If you have questions about contributing that aren't covered here:

1. Check if your question has been asked before in GitHub Discussions or Issues
2. Create a new discussion in GitHub Discussions
3. Tag it appropriately for visibility
4. Provide as much context as possible

---

## Attribution

Thank you to all our contributors who help make this project better! Your contributions are greatly appreciated.

---

**Remember**: No contribution is too small. Whether it's fixing a typo, improving documentation, or adding a major feature, all contributions are valued and appreciated!

Happy coding! 🚀
