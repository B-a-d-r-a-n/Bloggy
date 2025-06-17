import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../validation";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormInput } from "../../../components/ui/FormInput"; // Import our final component
import { FormGroup } from "../../../components/ui/FormGroup";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../queries";
import authService from "../../../core/services/authService";
import { api } from "../../../lib/api";
import toast from "react-hot-toast";

export default function LoginForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Validate when user leaves a field
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setApiError(null);

    // Show loading toast
    const loadingToast = toast.loading("Logging in...");

    try {
      // 1. Call the login service method
      const response = await authService.login(data);

      // 2. Set the authorization header immediately
      const { accessToken } = response;
      if (accessToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      } else {
        delete api.defaults.headers.common["Authorization"];
      }
      if (accessToken) {
        localStorage.setItem("access_token", accessToken); // 👈 Save to localStorage
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      }

      // 3. Fetch and set user data directly to avoid query delays
      try {
        const userResponse = await authService.getMe();
        const userData = userResponse.data.user;

        // Set the user data directly in the query cache
        queryClient.setQueryData(authKeys.me, userData);

        console.log("User data set in cache:", userData);

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success(`Welcome back, ${userData.name || "User"}!`);

        // Navigate away with a small delay to let toast show
        setTimeout(() => {
          navigate({ to: "/", replace: true });
        }, 500);
      } catch (userError) {
        console.error("Failed to fetch user after login:", userError);

        // Still try to invalidate queries
        await queryClient.invalidateQueries({
          queryKey: authKeys.me,
          refetchType: "all",
        });

        // Show success toast anyway
        toast.dismiss(loadingToast);
        toast.success("Login successful!");

        // Navigate anyway
        setTimeout(() => {
          navigate({ to: "/", replace: true });
        }, 500);
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);

      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-body space-y-4"
        noValidate
      >
        <h2 className="card-title justify-center text-2xl font-bold">
          Welcome Back!
        </h2>

        <FormGroup>
          <FormInput
            label="Email Address"
            registration={register("email")}
            error={errors.email?.message}
            type="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            autoComplete="email"
          />
        </FormGroup>

        <FormGroup>
          <FormInput
            label="Password"
            registration={register("password")}
            error={errors.password?.message}
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
            autoComplete="current-password"
          />
        </FormGroup>

        {apiError && (
          <div role="alert" className="alert alert-error text-sm p-3">
            <span>{apiError}</span>
          </div>
        )}

        <div className="form-control mt-4">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Log In"
            )}
          </button>
        </div>

        <div className="text-center mt-2 text-sm">
          <p className="text-base-content/80">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
