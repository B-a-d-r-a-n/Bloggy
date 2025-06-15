import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "../validation";
import { Link, useNavigate } from "@tanstack/react-router";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../hooks/useAuth";
export default function SignupForm() {
  const { signup } = useAuth();
  const [formError, setFormError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });
  const onSubmit = async (data: SignupFormValues) => {
    setFormError(null);
    try {
      const { passwordConfirm, ...signupData } = data;
      await signup({ ...signupData, passwordConfirm });
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
        <h2 className="card-title justify-center text-2xl">
          Create an Account
        </h2>
        <Input
          label="Full Name"
          name="name"
          register={register}
          error={errors.name?.message}
          disabled={isSubmitting}
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
          disabled={isSubmitting}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password?.message}
          disabled={isSubmitting}
        />
        <Input
          label="Confirm Password"
          name="passwordConfirm"
          type="password"
          register={register}
          error={errors.passwordConfirm?.message}
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
            Create Account
          </button>
        </div>
        <div className="text-center mt-4 text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}