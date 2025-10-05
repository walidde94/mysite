# Contributing to EcoStep

First off, thank you for considering contributing to EcoStep! It's people like you that make EcoStep such a great tool for promoting sustainability. 🌱

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues to avoid duplicates.

When you create a bug report, include as many details as possible:
- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:
- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Pull Requests 🔀

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**:
   - Follow the coding style of the project
   - Write clear, commented code
   - Add tests if applicable
   - Update documentation as needed

3. **Commit your changes**:
   ```bash
   git commit -m "Add some amazing feature"
   ```
   
   Follow commit message conventions:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

4. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request** with a clear title and description

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

## Style Guides

### JavaScript Style Guide
- Use ES6+ features
- Use meaningful variable names
- Follow ESLint configuration
- Add JSDoc comments for functions

Example:
```javascript
/**
 * Calculate daily carbon footprint
 * @param {Object} lifestyle - User's lifestyle data
 * @returns {Number} Daily CO2 emissions in kg
 */
function calculateFootprint(lifestyle) {
  // Implementation
}
```

### Vue.js Style Guide
- Use composition API with `<script setup>`
- Keep components small and focused
- Use props validation
- Emit events for parent communication

### Python Style Guide
- Follow PEP 8
- Use type hints
- Write docstrings for functions
- Keep functions focused and small

Example:
```python
def calculate_emissions(distance: float, mode: str) -> float:
    """
    Calculate transportation emissions.
    
    Args:
        distance: Distance traveled in km
        mode: Transportation mode
        
    Returns:
        CO2 emissions in kg
    """
    # Implementation
```

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests

## Project Structure

```
ecostep/
├── backend/          # Node.js API
├── ai-service/       # Python AI service
├── frontend/         # Vue.js web app
└── mobile/           # React Native app
```

### Adding New Features

#### Backend (API Endpoint)
1. Create model in `backend/src/models/`
2. Create route in `backend/src/routes/`
3. Create controller in `backend/src/controllers/`
4. Add tests
5. Update API documentation

#### Frontend (Vue Component)
1. Create component in `frontend/src/components/`
2. Add route if needed in `frontend/src/router/`
3. Create store if needed in `frontend/src/stores/`
4. Style with TailwindCSS
5. Test responsive design

#### AI Service (New Algorithm)
1. Add function in `ai-service/carbon_calculator.py`
2. Add endpoint in `ai-service/main.py`
3. Write tests
4. Update documentation

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### AI Service Tests
```bash
cd ai-service
pytest
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc/docstring comments to new functions
- Update API documentation for new endpoints
- Include examples in documentation

## Review Process

1. **Automated Checks**: CI/CD will run tests and linting
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Merge**: Once approved, your PR will be merged!

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (coming soon)

## Community

- **Discord**: [Join our community](https://discord.gg/ecostep)
- **Twitter**: [@EcoStepApp](https://twitter.com/ecostepapp)
- **Blog**: [blog.ecostep.app](https://blog.ecostep.app)

## Questions?

Feel free to:
- Open a GitHub Discussion
- Ask in our Discord
- Email: developers@ecostep.app

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making EcoStep better! Every contribution, no matter how small, makes a difference. 💚🌍
