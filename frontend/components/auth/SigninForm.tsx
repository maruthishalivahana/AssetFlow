"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordInput } from "./PasswordInput";
import { ValidationMessage } from "./ValidationMessage";
import { useAppDispatch } from "../../src/store/hooks";
import { performLogin } from "../../src/store/actions/authActions";
import { useAuth } from "../../src/hooks/useAuth";

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export function SigninForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

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

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: SigninFormValues) => {
    setIsSubmitting(true);

    try {
      await dispatch(performLogin(data));
      toast.success("Welcome back");
      router.replace("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="border border-slate-200 shadow-sm bg-white/80 rounded-2xl backdrop-blur-sm transition-all">
        <CardContent className="p-5 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                className={`text-slate-900 transition-colors focus-visible:ring-0 focus-visible:outline-none border-slate-200 ${errors.email && dirtyFields.email
                  ? "border-red-500 focus-visible:border-red-500"
                  : dirtyFields.email && !errors.email && emailValue?.length > 0
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-900">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-slate-900 hover:text-blue-600 hover:underline transition-colors"
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
                className={`transition-colors focus-visible:ring-1 ${errors.password && touchedFields.password ? "border-red-500 focus-visible:ring-red-500" : ""
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
