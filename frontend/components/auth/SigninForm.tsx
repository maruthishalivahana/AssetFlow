"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordInput } from "./PasswordInput";
import { ValidationMessage } from "./ValidationMessage";

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export function SigninForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");

  const onSubmit = async (data: SigninFormValues) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", data);
    
    // In the future, dispatch to Redux Toolkit here
    // dispatch(signinUser(data));
    
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <Card className="border-0 shadow-none bg-transparent sm:border sm:shadow-sm sm:bg-white sm:rounded-2xl sm:backdrop-blur-sm sm:bg-white/80 transition-all">
        <CardContent className="p-0 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email && dirtyFields.email}
                aria-describedby={dirtyFields.email ? "email-validation" : undefined}
                {...register("email")}
                className={`transition-colors focus-visible:ring-1 ${
                  errors.email && dirtyFields.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : dirtyFields.email && !errors.email && emailValue.length > 0
                    ? "border-green-500 focus-visible:ring-green-500"
                    : ""
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-slate-500 hover:text-blue-600 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password && touchedFields.password}
                aria-describedby={errors.password && touchedFields.password ? "password-error" : undefined}
                {...register("password")}
                className={`transition-colors focus-visible:ring-1 ${
                  errors.password && touchedFields.password ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
              <div id="password-error">
                {touchedFields.password && errors.password && (
                  <ValidationMessage message={errors.password.message} state="error" />
                )}
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-slate-900 hover:text-blue-600 hover:underline transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
