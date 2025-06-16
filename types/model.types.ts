export interface BodyMetric {
      arm_circumference: number | null;
      bmi: number;
      created_at: string;
      hip_circumference: number | null;
      id: string;
      measurement_date: string;
      side_circumference: number | null;
      thigh_circumference: number | null;
      user_id: string;
      waist_circumference: number | null;
      weight: number;
}

export interface FoodCategory {
      id: string;
      title: string;
      value: string;
}

export interface FoodUnit {
      calories_per_standard_amount: number;
      category_id: string;
      created_at: string;
      created_by: string;
      id: string;
      name: string;
      standard_amount_description: string;
}

export interface MealLog {
      calories_consumed: number;
      created_at: string;
      id: string;
      log_date: string;
      meal_option_id: string;
      meal_type: string;
      user_id: string;
}

export interface MealOptionItem {
      created_at: string;
      food_unit_id: string;
      id: string;
      meal_option_id: string;
      quantity: number;
}

export interface MealOption {
      created_at: string;
      created_by: string;
      description: string | null;
      id: string;
      meal_type: string;
      name: string;
      total_calories: number;
}

export interface Recommendation {
      category: string;
      content: string;
      created_at: string;
      created_by: string;
      id: string;
      title: string;
}

export interface Session {
      created_at: string;
      id: number;
      is_valid: boolean;
      token: string;
      user_id: string | null;
}

export interface User {
      created_at: string;
      email: string;
      id: string;
      password: string | null;
      role: 'user' | 'admin';
      username: string;
}

export interface WorkoutLog {
      created_at: string;
      duration_minutes: number | null;
      id: string;
      user_id: string;
      workout_date: string;
      workout_type: string;
}
