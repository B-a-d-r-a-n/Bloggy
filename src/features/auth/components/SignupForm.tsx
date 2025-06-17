import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "../validation";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormInput } from "../../../components/ui/FormInput"; // Import our final component
import authService from "../../../core/services/authService";
import { authKeys } from "../queries";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import toast from "react-hot-toast";

export default function SignupForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setApiError(null);

    // Show loading toast
    const loadingToast = toast.loading("Creating your account...");

    try {
      // 1. Call the signup service method
      const response = await authService.signup(data);

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
      // 3. Fetch and set user data directly
      try {
        const userResponse = await authService.getMe();
        const userData = userResponse.data.user;

        // Set the user data directly in the query cache
        queryClient.setQueryData(authKeys.me, userData);

        console.log("User data set in cache after signup:", userData);

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success(
          `Welcome, ${userData.name || "User"}! Account created successfully.`
        );

        // Navigate away with a small delay
        setTimeout(() => {
          navigate({ to: "/", replace: true });
        }, 500);
      } catch (userError) {
        console.error("Failed to fetch user after signup:", userError);

        // Still try to invalidate queries
        await queryClient.invalidateQueries({
          queryKey: authKeys.me,
          refetchType: "all",
        });

        // Show success toast anyway
        toast.dismiss(loadingToast);
        toast.success("Account created successfully!");

        // Navigate anyway
        setTimeout(() => {
          navigate({ to: "/", replace: true });
        }, 500);
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);

      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-body gap-4"
        noValidate
      >
        <h2 className="card-title justify-center text-2xl font-bold">
          Create an Account
        </h2>

        <FormInput
          label="Full Name"
          registration={register("name")}
          error={errors.name?.message}
          disabled={isSubmitting}
          autoComplete="name"
        />

        <FormInput
          label="Email Address"
          registration={register("email")}
          error={errors.email?.message}
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
        />

        <FormInput
          label="Password"
          registration={register("password")}
          error={errors.password?.message}
          type="password"
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        <FormInput
          label="Confirm Password"
          registration={register("passwordConfirm")}
          error={errors.passwordConfirm?.message}
          type="password"
          autoComplete="new-password"
          disabled={isSubmitting}
        />

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
              "Create Account"
            )}
          </button>
        </div>

        <div className="text-center mt-2 text-sm">
          <p className="text-base-content/80">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
