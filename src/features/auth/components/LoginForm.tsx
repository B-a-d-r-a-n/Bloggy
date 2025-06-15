import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../validation";
import { Link, useNavigate } from "@tanstack/react-router";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../hooks/useAuth";
export default function LoginForm() {
  const { login } = useAuth();
  const [formError, setFormError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), 
  });
  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    try {
      await login(data);
      navigate({ to: "/", replace: true });
    } catch (error: any) {
      setFormError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="card-body">
        <h2 className="card-title justify-center text-2xl">Welcome Back!</h2>
        <Input
          label="Email Address"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
          placeholder="you@example.com"
          disabled={isSubmitting}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password?.message}
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        {formError && (
          <div role="alert" className="alert alert-error text-sm">
            <span>{formError}</span>
          </div>
        )}
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <span className="loading loading-spinner"></span>}
            Log In
          </button>
        </div>
        <div className="text-center mt-4 text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}