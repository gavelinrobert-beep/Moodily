# Contributing to Moodily

Thank you for your interest in contributing to Moodily! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive. This is a wellness app - let's keep the community positive!

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (browser, OS, etc.)

### Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Potential implementation approach (optional)

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a pull request

## Development Setup

See the main [README.md](README.md) for detailed setup instructions.

Quick start:
```bash
git clone https://github.com/gavelinrobert-beep/Moodily.git
cd Moodily
npm install
cp .env.example .env.local
# Add your Supabase credentials to .env.local
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Enable strict mode
- Define proper types/interfaces
- Avoid `any` type

### React

- Use functional components and hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing
- Support dark mode

### Code Style

- Run `npm run lint` before committing
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Git Commit Messages

Format:
```
type: brief description

Longer explanation if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add data export functionality

fix: resolve streak calculation bug for timezone differences

docs: update deployment guide with custom domain setup
```

## Project Structure

```
moodily/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utilities and helpers
├── supabase/        # Database and edge functions
└── public/          # Static assets
```

## Testing

Currently, we rely on manual testing. When adding features:

1. Test the happy path
2. Test edge cases
3. Test error states
4. Test on different screen sizes
5. Test with and without data

Future: We plan to add automated tests.

## Database Changes

When modifying the database schema:

1. Create a new migration file in `supabase/migrations/`
2. Name it: `YYYYMMDDHHMMSS_description.sql`
3. Include both `up` and `down` migrations if possible
4. Test migrations on a dev project first
5. Document any breaking changes

## Documentation

When adding features:

1. Update README.md if needed
2. Add JSDoc comments to functions
3. Update DEPLOYMENT.md for deployment changes
4. Add examples for complex features

## Review Process

1. All PRs require review before merging
2. Address review comments
3. Keep PRs focused and small
4. Ensure CI passes

## Areas for Contribution

### High Priority
- [ ] Automated tests (Jest, Playwright)
- [ ] Data export functionality (CSV/JSON)
- [ ] Email template improvements
- [ ] Mobile app (React Native)
- [ ] Accessibility improvements

### Medium Priority
- [ ] Custom reminder times per user
- [ ] More visualization options
- [ ] Mood pattern insights
- [ ] Multi-language support
- [ ] Dark mode toggle

### Nice to Have
- [ ] Social features (optional sharing)
- [ ] Customizable themes
- [ ] Advanced analytics
- [ ] Integration with other apps

## Questions?

- Open an issue for questions
- Tag with `question` label
- Be specific about what you need help with

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Moodily! 🎭✨
