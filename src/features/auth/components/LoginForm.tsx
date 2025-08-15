import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../validation";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormInput } from "../../../components/ui/FormInput";
import { FormGroup } from "../../../components/ui/FormGroup";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../queries";
import authService from "../../../core/services/authService";
import { api } from "../../../lib/api";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../core/types/api";
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
    mode: "onBlur",
  });
  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setApiError(null);
    const loadingToast = toast.loading("Logging in...");
    try {
      const response = await authService.login(data);
      const { accessToken } = response;
      if (accessToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      } else {
        delete api.defaults.headers.common["Authorization"];
      }
      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      }
      try {
        const userResponse = await authService.getMe();
        const userData = userResponse.data.user;
        queryClient.setQueryData(authKeys.me, userData);
        console.log("User data set in cache:", userData);

        // Also invalidate the query to ensure fresh data is fetched everywhere
        await queryClient.invalidateQueries({ queryKey: authKeys.me });

        toast.dismiss(loadingToast);
        toast.success(`Welcome back, ${userData.name || "User"}!`);
        setTimeout(() => {
          navigate({ to: "/", replace: true });
        }, 100); // Reduced from 500ms to 100ms for faster response
      } catch (userError) {
        console.error("Failed to fetch user after login:", userError);
        await queryClient.invalidateQueries({
          queryKey: authKeys.me,
          refetchType: "all",
        });
        toast.dismiss(loadingToast);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate({ to: "/", replace: true });
        }, 100); // Reduced from 500ms to 100ms for faster response
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      toast.dismiss(loadingToast);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Login failed. Please try again.";
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
