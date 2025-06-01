"use client";

import React, { FormEvent, useState } from "react";

type ErrorType = { username?: string; password?: string; form?: string };
const LoginForm = ({
      onSubmit,
}: {
      onSubmit: ({ username, password }: { username: string; password: string }) => Promise<void>;
}) => {
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [errors, setErrors] = useState<ErrorType>({});
      const [isSubmitting, setIsSubmitting] = useState(false); // To show loading state

      const validate = () => {
            const newErrors: ErrorType = {};
            if (!username) newErrors.username = "Username is required";
            if (!password) newErrors.password = "Password is required";
            return newErrors;
      };

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors);
                  return;
            }

            setErrors({});
            setIsSubmitting(true);

            try {
                  await onSubmit({ username, password });
            } catch (error) {
                  // Handle submission error if onSubmit throws one
                  setErrors({ form: (error as Error).message || "Submission failed" });
            } finally {
                  setIsSubmitting(false); // Reset submitting state
            }
      };

      return (
            <form onSubmit={handleSubmit} aria-label="Login Form">
                  {errors.form && (
                        <p role="alert" style={{ color: "red", marginBottom: "10px" }}>
                              {errors.form}
                        </p>
                  )}
                  <div>
                        <label htmlFor="username">Username:</label>
                        <input
                              id="username"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              aria-describedby={errors.username ? "username-error" : undefined}
                        />
                        {errors.username && (
                              <p id="username-error" role="alert" style={{ color: "red" }}>
                                    {errors.username}
                              </p>
                        )}
                  </div>
                  <div>
                        <label htmlFor="password">Password:</label>
                        <input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        {errors.password && (
                              <p id="password-error" role="alert" style={{ color: "red" }}>
                                    {errors.password}
                              </p>
                        )}
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                  </button>
            </form>
      );
};

export default LoginForm;
