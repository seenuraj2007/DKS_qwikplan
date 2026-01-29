# Services Layer

This directory contains the business logic services for the application. All database operations and business logic should be encapsulated in these services.

## Available Services

### UserService (`lib/services/userService.ts`)

Handles user profile management and usage tracking.

**Methods:**
- `getUserProfile(userId)` - Get user profile by user ID
- `createUserProfile(input)` - Create a new user profile
- `getOrCreateProfile(userId)` - Get existing profile or create new one
- `updateProfile(profileId, input)` - Update user profile
- `incrementUsage(profileId)` - Increment user's usage count
- `hasReachedLimit(userId)` - Check if user has reached monthly limit
- `deleteUserData(userId)` - Delete all user data

**Example:**
```typescript
import { UserService } from '@/lib/services'

const userService = new UserService(supabase)
const profile = await userService.getUserProfile(userId)
```

---

### GenerateService (`lib/services/generateService.ts`)

Handles AI content generation and strategy management.

**Methods:**
- `generateContent(input)` - Generate content using AI
- `saveStrategy(userId, input, result)` - Save generated strategy
- `getUserStrategies(userId, limit, offset)` - Get user's strategy history
- `deleteStrategy(strategyId, userId)` - Delete a strategy
- `getStrategyById(strategyId, userId)` - Get specific strategy

**Example:**
```typescript
import { GenerateService } from '@/lib/services'

const generateService = new GenerateService(supabase)
const content = await generateService.generateContent({
  niche: 'Coffee Shop',
  platform: 'instagram',
  goal: 'sales'
})
```

---

### StreakService (`lib/services/streakService.ts`)

Handles user engagement streak tracking.

**Methods:**
- `getUserStreak(userId)` - Get user's current streak
- `createStreak(userId)` - Create new streak for user
- `updateStreak(userId)` - Update streak (call after user action)
- `getLeaderboard(limit)` - Get top streaks leaderboard
- `resetStreak(userId)` - Reset user's streak

**Example:**
```typescript
import { StreakService } from '@/lib/services'

const streakService = new StreakService(supabase)
const streak = await streakService.updateStreak(userId)
```

---

### FeedbackService (`lib/services/feedbackService.ts`)

Handles user feedback collection and analytics.

**Methods:**
- `createFeedback(input)` - Create new feedback entry
- `getUserFeedback(userId)` - Get user's feedback history
- `getFeedbackStats()` - Get overall feedback statistics
- `deleteFeedback(feedbackId, userId)` - Delete feedback

**Example:**
```typescript
import { FeedbackService } from '@/lib/services'

const feedbackService = new FeedbackService(supabase)
await feedbackService.createFeedback({
  userId: 'user-uuid',
  rating: 5,
  feedbackText: 'Great tool!'
})
```

---

## Usage in API Routes

**Before (Direct Supabase queries):**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single()
```

**After (Using Services):**
```typescript
import { UserService } from '@/lib/services'

const userService = new UserService(supabase)
const profile = await userService.getUserProfile(userId)
```

## Benefits

1. **Separation of Concerns** - API routes handle HTTP, services handle business logic
2. **Reusability** - Services can be used across multiple API routes and components
3. **Testability** - Services can be unit tested independently
4. **Type Safety** - Strongly typed interfaces for all inputs and outputs
5. **Error Handling** - Consistent error handling across all operations
6. **Maintainability** - Easy to update business logic without touching API routes

## Creating New Services

1. Create a new file in `lib/services/`
2. Export the service class from `lib/services/index.ts`
3. Add methods with consistent error handling
4. Document the service in this README
5. Write unit tests

## Best Practices

1. Always inject SupabaseClient in constructor (not create inside service)
2. Return consistent response types: `{ data, error }` or `{ success, error }`
3. Log all errors with context
4. Use TypeScript interfaces for all inputs/outputs
5. Keep methods focused and single-purpose
6. Handle null/undefined cases explicitly
