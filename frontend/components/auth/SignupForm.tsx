"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "./PasswordInput";
import { ValidationMessage } from "./ValidationMessage";
import { PasswordChecklist } from "./PasswordChecklist";
import { useRouter } from "next/navigation";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must contain at least 2 characters")
      .regex(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const emailValue = watch("email");
  const confirmPasswordValue = watch("confirmPassword");

  const router = useRouter();

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Form submitted:", data);
    router.push("/");
  };

  return (
    <div className="w-full">
      <Card className="border border-slate-200 shadow-sm bg-white/80 rounded-2xl backdrop-blur-sm transition-all">
        <CardContent className="p-5 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-900">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                autoComplete="name"
                aria-invalid={!!errors.fullName && touchedFields.fullName}
                aria-describedby={errors.fullName && touchedFields.fullName ? "fullName-error" : undefined}
                {...register("fullName")}
                className={`text-slate-900 transition-colors focus-visible:ring-0 focus-visible:outline-none ${
                  errors.fullName && touchedFields.fullName ? "border-red-500 focus-visible:border-red-500" : "border-slate-200 focus-visible:border-slate-300"
                }`}
              />
              {touchedFields.fullName && errors.fullName && (
                <div id="fullName-error">
                  <ValidationMessage message={errors.fullName.message} state="error" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email && dirtyFields.email}
                aria-describedby={dirtyFields.email ? "email-validation" : undefined}
                {...register("email")}
                className={`text-slate-900 transition-colors focus-visible:ring-0 focus-visible:outline-none ${
                  errors.email && dirtyFields.email
                    ? "border-red-500 focus-visible:border-red-500"
                    : dirtyFields.email && !errors.email && emailValue.length > 0
                    ? "border-green-500 focus-visible:border-green-500"
                    : "border-slate-200 focus-visible:border-slate-300"
                }`}
              />
              <div id="email-validation">
                {dirtyFields.email && errors.email ? (
                  <ValidationMessage message={errors.email.message} state="error" />
                ) : dirtyFields.email && !errors.email && emailValue.length > 0 ? (
                  <ValidationMessage message="Valid email" state="valid" />
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-900">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Create a password"
                autoComplete="new-password"
                aria-invalid={!!errors.password && dirtyFields.password}
                aria-describedby="password-rules"
                {...register("password")}
                className={`text-slate-900 transition-colors focus-visible:ring-0 focus-visible:outline-none ${
                  errors.password && dirtyFields.password
                    ? "border-red-500 focus-visible:border-red-500"
                    : dirtyFields.password && !errors.password && passwordValue.length > 0
                    ? "border-green-500 focus-visible:border-green-500"
                    : "border-slate-200 focus-visible:border-slate-300"
                }`}
              />
              <div id="password-rules">
                <PasswordChecklist password={passwordValue} isDirty={dirtyFields.password} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-900">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword && dirtyFields.confirmPassword}
                aria-describedby={dirtyFields.confirmPassword ? "confirmPassword-validation" : undefined}
                {...register("confirmPassword")}
                className={`text-slate-900 transition-colors focus-visible:ring-0 focus-visible:outline-none ${
                  errors.confirmPassword && dirtyFields.confirmPassword
                    ? "border-red-500 focus-visible:border-red-500"
                    : dirtyFields.confirmPassword && !errors.confirmPassword && confirmPasswordValue.length > 0
                    ? "border-green-500 focus-visible:border-green-500"
                    : "border-slate-200 focus-visible:border-slate-300"
                }`}
              />
              <div id="confirmPassword-validation">
                {dirtyFields.confirmPassword && errors.confirmPassword ? (
                  <ValidationMessage message={errors.confirmPassword.message} state="error" />
                ) : dirtyFields.confirmPassword && !errors.confirmPassword && confirmPasswordValue.length > 0 ? (
                  <ValidationMessage message="Passwords match" state="valid" />
                ) : null}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm rounded-lg py-5 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="mb-6 opacity-60" />
            <Alert className="bg-slate-50 text-slate-600 border-slate-200 shadow-sm rounded-xl">
              <Info className="h-4 w-4 stroke-slate-500 mt-0.5" />
              <AlertDescription className="text-xs leading-relaxed ml-2 text-slate-500">
                Every new account is registered as an Employee. Administrator roles
                are assigned later by your organization.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-slate-900 hover:text-blue-600 hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
