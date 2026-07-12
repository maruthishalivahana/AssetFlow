import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { SignupHero } from "@/components/auth/SignupHero";

export const metadata: Metadata = {
  title: "Create an Account | AssetFlow",
  description: "Register to access your organization's AssetFlow workspace.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your Employee Account"
      description="Register to access your organization's AssetFlow workspace."
      hero={<SignupHero />}
    >
      <SignupForm />
    </AuthLayout>
  );
}
