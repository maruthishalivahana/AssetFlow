import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SigninForm } from "@/components/auth/SigninForm";
import { SignupHero } from "@/components/auth/SignupHero";

export const metadata: Metadata = {
  title: "Sign In | AssetFlow",
  description: "Sign in to access your organization's AssetFlow workspace.",
};

export default function SigninPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to access your organization's AssetFlow workspace."
      hero={<SignupHero />}
    >
      <SigninForm />
    </AuthLayout>
  );
}
