# 🤝 Contributing to OpenVision

Thank you for your interest in contributing to the OpenVision project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Unacceptable Behavior

Examples of unacceptable behavior include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- Node.js and npm installed
- Git for version control
- A GitHub account
- Basic knowledge of React, TypeScript, and Vite
- Familiarity with computer vision concepts (helpful but not required)

### First Steps

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/OpenVision.git
   cd OpenVision/hf-vision-demo
   ```
3. **Set up the development environment** (see [Development Setup](#development-setup))
4. **Create a branch** for your contribution:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ How to Contribute

### Types of Contributions

We welcome various types of contributions:

#### 🐛 Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide system information
- Add screenshots if applicable

#### ✨ Feature Requests
- Use the feature request template
- Explain the use case
- Describe the proposed solution
- Consider implementation complexity

#### 📝 Documentation
- Fix typos and grammar
- Improve clarity and examples
- Add missing documentation
- Translate to other languages

#### 💻 Code Contributions
- Bug fixes
- New features
- Performance improvements
- Code refactoring
- Test coverage improvements

#### 🎨 UI/UX Improvements
- Frontend enhancements
- Better user experience
- Accessibility improvements
- Mobile responsiveness

## 🔧 Development Setup

Detailed setup instructions are available in [DEVELOPMENT.md](hf-vision-demo/DEVELOPMENT.md). Quick setup:

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/OpenVision.git
cd OpenVision/hf-vision-demo

# Install dependencies
npm install

# Start development server
npm run dev
```
The application will be available at `http://localhost:5173/` (or another port if 5173 is busy).

## 📏 Coding Standards

### TypeScript/React Code Style

We use ESLint to enforce coding standards.

```bash
# Lint with ESLint
npm run lint
```

#### Code Style Guidelines

- **Line length**: Maximum 88 characters (enforced by Prettier, if used)
- **Imports**: Group and sort imports.
- **Type hints**: Add type hints for function parameters and returns.
- **Component names**: Use PascalCase for React components.
- **Variable names**: Use camelCase for variables and functions.

### HTML/CSS Style

- **Semantic HTML**: Use appropriate HTML5 elements
- **CSS Modules**: Use CSS Modules for component-scoped styles.
- **Responsive Design**: Ensure mobile compatibility
- **Accessibility**: Add proper ARIA labels and alt text

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Ensure code style** compliance (`npm run lint`)
5. **Update CHANGELOG** if applicable

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Updated integration tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass (linting, tests)
2. **Code review** by maintainers
3. **Testing** on different environments
4. **Approval** and merge

## 📝 Issue Guidelines

### Bug Reports

Use this template for bug reports:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS 12.0]
- Node: [e.g., 18.12.0]
- Browser: [e.g., Chrome 95.0]

**Additional Context**
Screenshots, logs, etc.
```

### Feature Requests

Use this template for feature requests:

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this be implemented?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Mockups, examples, etc.
```

## 🏷️ Labels and Milestones

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on

### Priority Labels

- `priority: high`: Critical issues
- `priority: medium`: Important issues
- `priority: low`: Nice to have

## 🌟 Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributor graphs and statistics

## 💬 Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code review and collaboration

### Getting Help

1. **Check documentation**: README, hf-vision-demo/DEVELOPMENT.md
2. **Search existing issues**: Someone might have asked already
3. **Create a new issue**: Use appropriate templates
4. **Join discussions**: Share ideas and get feedback

### Mentorship

New contributors can:

- **Start with good first issues**: Look for `good first issue` label
- **Ask questions**: Don't hesitate to ask for help
- **Pair programming**: Request code review and feedback
- **Documentation**: Start with documentation improvements

## 📚 Resources

### Learning Materials

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

### Tools

- [VS Code](https://code.visualstudio.com/): Recommended IDE
- [GitHub Desktop](https://desktop.github.com/): Git GUI
- [Postman](https://www.postman.com/): API testing

## 🙏 Thank You

Thank you for contributing to OpenVision! Your contributions help make this project better for everyone.

---

**Questions?** Feel free to open an issue or start a discussion. We're here to help! 🚀