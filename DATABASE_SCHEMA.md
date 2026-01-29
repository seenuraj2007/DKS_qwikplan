# Database Schema Documentation

## Overview
This document describes the database schema for DKS QwikPlan application. All tables use PostgreSQL with Row Level Security (RLS) enabled.

## Tables

### 1. profiles
Stores user profile information, plan details, and usage tracking.

#### Columns
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | uuid | NOT NULL, UNIQUE, FK to auth.users | Reference to Supabase auth user |
| plan_usage | integer | NOT NULL, DEFAULT 0, CHECK >= 0 | Monthly usage count |
| monthly_limit | integer | NOT NULL, DEFAULT 50, CHECK > 0 | Monthly generation limit |
| plan_type | text | NOT NULL, DEFAULT 'free', CHECK in ('free','pro','enterprise') | User's plan type |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | Last update timestamp |

#### Indexes
- `idx_profiles_user_id` on user_id
- `idx_profiles_plan_type` on plan_type

#### RLS Policies
- Users can view their own profile
- Users can insert their own profile
- Users can update their own profile

#### Triggers
- `update_profiles_updated_at`: Auto-updates updated_at on row updates

---

### 2. strategies
Stores all AI-generated marketing strategies and content.

#### Columns
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | uuid | NOT NULL, FK to auth.users | Reference to Supabase auth user |
| niche | text | NOT NULL | Business niche/category |
| platform | text | NOT NULL | Social media platform (instagram, facebook, linkedin, twitter, youtube) |
| goal | text | NOT NULL | Campaign goal (sales, brand, engagement, leads) |
| strategy_text | text | NOT NULL | Strategy explanation |
| schedule | jsonb | NOT NULL, DEFAULT '[]' | AI-generated content as JSON (script, hook, caption, cta, hashtags, etc.) |
| hashtags | text | NULLABLE | Hashtag string |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Creation timestamp |

#### Indexes
- `idx_strategies_user_id` on user_id
- `idx_strategies_created_at` on created_at DESC
- `idx_strategies_platform` on platform
- `idx_strategies_niche` on niche
- `idx_strategies_user_created` composite on (user_id DESC, created_at DESC)

#### RLS Policies
- Users can view their own strategies
- Users can insert their own strategies
- Users can delete their own strategies

---

### 3. feedback
Stores user feedback on generated content for quality improvement.

#### Columns
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | uuid | NOT NULL, FK to auth.users | Reference to Supabase auth user |
| rating | integer | CHECK (rating >= 1 AND rating <= 5) | Star rating (1-5) |
| feedback_text | text | NOT NULL | User's feedback text |
| niche | text | NULLABLE | Related niche |
| platform | text | NULLABLE | Related platform |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Creation timestamp |

#### Indexes
- `idx_feedback_user_id` on user_id
- `idx_feedback_created_at` on created_at DESC
- `idx_feedback_rating` on rating

#### RLS Policies
- Users can view their own feedback
- Users can insert their own feedback

---

### 4. user_streaks
Tracks user engagement streaks to encourage daily usage.

#### Columns
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | uuid | NOT NULL, UNIQUE, FK to auth.users | Reference to Supabase auth user |
| current_streak | integer | NOT NULL, DEFAULT 0, CHECK >= 0 | Current consecutive days of activity |
| longest_streak | integer | NOT NULL, DEFAULT 0, CHECK >= 0 | Longest streak achieved |
| last_active_at | timestamptz | NOT NULL, DEFAULT now() | Last activity timestamp |
| streak_history | jsonb | NOT NULL, DEFAULT '[]' | Historical streak data |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | Last update timestamp |

#### Indexes
- `idx_user_streaks_user_id` on user_id
- `idx_user_streaks_last_active` on last_active_at DESC
- `idx_user_streaks_current_streak` on current_streak DESC

#### RLS Policies
- Users can view their own streaks
- Users can insert their own streaks
- Users can update their own streaks

#### Triggers
- `update_user_streaks_updated_at`: Auto-updates updated_at on row updates

---

## Functions

### delete_user(user_id uuid)
Deletes all user data from application tables. Note: Does not delete the Supabase auth user (requires admin privileges).

**Returns:** 'DELETED'

**Usage:**
```sql
select public.delete_user('user-uuid-here');
```

### delete_user_data(user_id uuid)
Safely deletes only application data (profiles, strategies, feedback, streaks) but leaves the auth user intact.

**Returns:** 'USER_DATA_DELETED'

**Usage:**
```sql
select public.delete_user_data('user-uuid-here');
```

---

## Common Queries

### Get user with profile
```sql
select u.id, u.email, p.plan_type, p.plan_usage, p.monthly_limit
from auth.users u
left join public.profiles p on p.user_id = u.id
where u.id = 'user-uuid';
```

### Get user's recent strategies with pagination
```sql
select id, niche, platform, goal, created_at
from public.strategies
where user_id = 'user-uuid'
order by created_at desc
limit 10 offset 0;
```

### Update usage count
```sql
update public.profiles
set plan_usage = plan_usage + 1
where user_id = 'user-uuid';
```

### Get user's average rating
```sql
select avg(rating) as avg_rating
from public.feedback
where user_id = 'user-uuid';
```

---

## Migration Notes

### Applied Migrations
1. `001_create_profiles.sql` - User profiles with plan tracking
2. `002_create_strategies.sql` - AI-generated strategies storage
3. `003_create_feedback.sql` - User feedback collection
4. `004_create_user_streaks.sql` - User engagement streaks
5. `005_create_delete_user_function.sql` - User data deletion functions

### Running Migrations

**Via Supabase CLI:**
```bash
supabase db push
```

**Via SQL Editor (Supabase Dashboard):**
1. Go to SQL Editor
2. Copy and run each migration file in order

---

## Schema Changes

### Version History
- **v1.0.0** - Initial schema with core tables (profiles, strategies, feedback, user_streaks)
- **v1.0.1** - Added composite indexes for better query performance
- **v1.0.2** - Added delete_user functions for data management

---

## Best Practices

1. **Always use RLS policies** to ensure users can only access their own data
2. **Use prepared statements** in application code to prevent SQL injection
3. **Index frequently queried columns** for better performance
4. **Use jsonb** for flexible data storage (like strategy content)
5. **Use timestamptz** for all timestamps to handle timezones correctly
6. **Add foreign key constraints** to maintain referential integrity
7. **Check constraints** to enforce data validation at database level
