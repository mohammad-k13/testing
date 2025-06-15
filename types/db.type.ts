/**
 * @file This file contains TypeScript interfaces for all database tables
 * defined for the nutrition and fitness tracking application.
 * These interfaces help ensure type safety and consistency when interacting
 * with data fetched from or sent to Supabase.
 */

/**
 * @interface User
 * @description Defines the structure for a user entry in the `users` table.
 * Includes user's authentication details, role, and personal settings.
 */
export interface User {
      id: string; // UUID from Supabase auth.users or gen_random_uuid() for new users
      email: string;
      role: 'user' | 'admin'; // 'user' or 'admin'
      target_weight: number | null; // REAL, nullable
      language: string; // e.g., 'fa', 'en'
      theme: 'light' | 'dark'; // 'light' or 'dark'
      created_at: string; // TIMESTAMPTZ (ISO 8601 string)
}

/**
 * @interface FoodCategory
 * @description Defines the structure for a food category entry in the `food_categories` table.
 * Used to categorize food units with predefined values.
 */
export interface FoodCategory {
      id: string; // UUID
      value: string; // e.g., 'grains', 'meats' (unique identifier)
      title: string; // e.g., 'غلات', 'گوشت ها' (display name in Persian)
}

/**
 * @interface FoodUnit
 * @description Defines the structure for a food unit entry in the `food_units` table.
 * These are the basic building blocks of meals, defined by an admin.
 */
export interface FoodUnit {
      id: string; // UUID
      name: string; // e.g., 'نان سبوس‌دار', 'پنیر کم‌چرب'
      category_id: string; // UUID, references FoodCategory.id
      standard_amount_description: string; // e.g., '1 کف دست', '1 قوطی کبریت'
      calories_per_standard_amount: number; // REAL
      created_by: string; // UUID, references User.id (admin user)
      created_at: string; // TIMESTAMPTZ (ISO 8601 string)
}

/**
 * @interface MealOption
 * @description Defines the structure for a meal option entry in the `meal_options` table.
 * These are complete meal choices defined by an admin, composed of FoodUnits.
 */
export interface MealOption {
      id: string; // UUID
      name: string; // e.g., 'صبحانه - انتخاب اول', 'چلو مرغ'
      meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_sleep_snack'; // Example types, you can define an enum or strict literal types
      description: string | null; // TEXT, nullable (e.g., 'همراه با خیار و گوجه')
      total_calories: number; // REAL, calculated from MealOptionItems
      created_by: string; // UUID, references User.id (admin user)
      created_at: string; // TIMESTAMPTZ (ISO 8601 string)
}

/**
 * @interface MealOptionItem
 * @description Defines the structure for an item within a meal option in the `meal_option_items` table.
 * This links a MealOption to a FoodUnit and specifies the quantity.
 */
export interface MealOptionItem {
      id: string; // UUID
      meal_option_id: string; // UUID, references MealOption.id
      food_unit_id: string; // UUID, references FoodUnit.id
      quantity: number; // REAL (e.g., 3.5 for 3.5 "کف دست")
      created_at: string; // TIMESTAMPTZ (ISO 8601 string)
}

/**
 * @interface MealLog
 * @description Defines the structure for a meal log entry in the `meal_logs` table.
 * Records a user's chosen meal option for a specific date and meal type.
 */
export interface MealLog {
      id: string; // UUID
      user_id: string; // UUID, references User.id
      meal_option_id: string; // UUID, references MealOption.id
      log_date: string; // DATE (YYYY-MM-DD string)
      meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_sleep_snack'; // Should match MealOption.meal_type
      calories_consumed: number; // REAL (copied from MealOption.total_calories)
      created_at: string; // TIMESTAMPTZ (ISO 8601 string)
}

/**
 * @interface WorkoutLog
 * @description Defines the structure for a workout log entry in the `workout_logs` table.
 * Records a user's workout activity for a specific date.
 */
export interface WorkoutLog {
      id: string; // UUID
      user_id: string; // UUID, references User.id
      workout_date: string; // DATE (YYYY-MM-DD string)
      workout_type: string; // e.g., 'هوازی', 'وزنه', 'طناب'
      duration_minutes: number | null; // INTEGER, nullable (e.g., 60 for 1 hour)
      created_at: string; // TIMESTAMPTZ (ISO 8601 string)
}

/**
 * @interface BodyMetric
 * @description Defines the structure for a body measurement entry in the `body_metrics` table.
 * Records various body measurements of a user on a specific date.
 */
export interface BodyMetric {
      id: string; // UUID
      user_id: string; // UUID, references User.id
      measurement_date: string; // DATE (YYYY-MM-DD string)
      weight: number; // REAL (kg)
      bmi: number; // REAL
      waist_circumference: number | null; // REAL (cm), nullable
      arm_circumference: number | null; // REAL (cm), nullable
      thigh_circumference: number | null; // REAL (cm), nullable
      hip_circumference: number | null; // REAL (cm), nullable
      side_circumference: number | null; // REAL (cm/mm), nullable (adjust unit based on input source)
      created_at: string; // TIMESTAMPTZ (ISO 8601 string)
}

/**
 * @interface Recommendation
 * @description Defines the structure for a recommendation entry in the `recommendations` table.
 * These are fixed nutritional tips displayed to users, defined by an admin.
 */
export interface Recommendation {
      id: string; // UUID
      title: string; // The title of the recommendation
      content: string; // The full content/text of the recommendation
      category: string; // The category of the recommendation (e.g., 'آب', 'پروتئین', 'ویتامین')
      created_by: string; // UUID, references User.id (admin user)
      created_at: string; // TIMESTAMPTZ (ISO 8601 string)
}
