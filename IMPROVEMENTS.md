# Future Improvements

This document tracks suggested improvements for Moodily based on code review feedback and best practices.

## High Priority

### 1. Timezone-Aware Streak Calculation
**Issue**: The streak view uses `CURRENT_DATE` in UTC, which may cause streaks to break unexpectedly for users in different timezones.

**Solution**: 
- Store user timezone in profiles (already done)
- Modify streak calculation to use timezone-aware date comparisons
- Consider implementing streak calculation on the client side
- Or create a PostgreSQL function that accepts timezone parameter

### 2. Email Service Integration
**Issue**: Edge Function logs emails but doesn't send them.

**Solution**:
- Integrate with SendGrid, Resend, or AWS SES
- Add email templates
- Handle email delivery failures
- Track email open rates

### 3. Complete Account Deletion
**Issue**: Current implementation deletes user data but not the auth user itself (requires service role key).

**Solution**:
- Create admin API route with service role key
- Implement secure endpoint for complete account deletion
- Add proper authentication and validation
- Consider adding a grace period before permanent deletion

## Medium Priority

### 4. Dependency Updates
**Issue**: Some dependencies could be updated to latest versions.

**Action Items**:
- Update `@supabase/supabase-js` to latest version
- Pin Supabase client version in Edge Function
- Regularly check for security updates

### 5. Type Safety Improvements
**Issue**: Some use of `any` types and type assertions bypass TypeScript checking.

**Solution**:
```typescript
// Instead of: const calcAvg = (data: any[], field: 'mood' | 'energy')
// Use proper interface:
interface EntryData {
  mood: number
  energy: number
}
const calcAvg = (data: EntryData[], field: 'mood' | 'energy')
```

### 6. Performance Optimizations
**Issues**:
- Timezone calculated on every render in `useTodayEntry`
- Chart data processing could be more efficient
- Large datasets may slow down visualizations

**Solutions**:
- Memoize timezone and date range calculations with `useMemo`
- Optimize data processing in trend sparkline
- Add pagination for large entry datasets
- Consider caching frequently accessed data

## Low Priority

### 7. Error Boundary Implementation
Add React Error Boundaries for graceful error handling:
```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <Dashboard />
</ErrorBoundary>
```

### 8. Accessibility Improvements
- Add ARIA live regions for dynamic content
- Improve keyboard navigation
- Add screen reader announcements for actions
- Test with NVDA/JAWS

### 9. Analytics Enhancement
- Integrate with PostHog or similar
- Track user behavior patterns
- A/B test UI variations
- Monitor performance metrics

### 10. Additional Features
- Export data to CSV/JSON
- Import historical data
- Custom mood/energy categories
- Photo attachments for entries
- Multi-language support
- Dark mode
- PWA support for offline access
- Desktop notifications

### 11. Testing
- Add unit tests for utilities
- Integration tests for API routes
- E2E tests with Playwright
- Test RLS policies thoroughly

### 12. Monitoring & Observability
- Set up Sentry or similar (when Next.js 16 supported)
- Add performance monitoring
- Set up uptime monitoring
- Create dashboard for metrics

## Technical Debt

### 1. Next.js Middleware Migration
**Issue**: Using deprecated `middleware.ts` instead of new `proxy.ts` convention.

**Timeline**: Can wait until Next.js and Supabase provide clearer migration path.

**Action**: Monitor Next.js releases and Supabase SSR documentation updates.

### 2. Environment Variable Handling
**Issue**: CI builds use placeholder values.

**Solution**: Consider failing builds if required secrets are missing, or set up separate test/dev environments.

### 3. Code Organization
As the app grows, consider:
- Splitting large components into smaller ones
- Creating a component library
- Standardizing error handling patterns
- Adding consistent logging

## Security Enhancements

1. **Rate Limiting**: Add rate limiting for API endpoints
2. **CSRF Protection**: Implement CSRF tokens for mutations
3. **Input Sanitization**: Add additional validation layers
4. **Audit Logging**: Track sensitive operations
5. **Session Management**: Add session timeout handling

## Performance

1. **Image Optimization**: If adding images, use Next.js Image component
2. **Code Splitting**: Lazy load heavy components
3. **Bundle Analysis**: Regular bundle size monitoring
4. **Database Indexing**: Add indexes for frequently queried fields
5. **Caching Strategy**: Implement proper caching headers

## Documentation

1. **API Documentation**: Generate API docs
2. **Component Storybook**: Create component library docs
3. **Architecture Decision Records**: Document major decisions
4. **Runbook**: Operations guide for production issues

---

**Note**: These improvements should be prioritized based on user feedback, analytics, and business requirements. The current MVP is production-ready and functional.
