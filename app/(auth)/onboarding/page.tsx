import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserOnboardingForm from "@/components/auth/onboarding-form";

const OnboardingPage = () => {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <Card className="w-full sm:w-96 border-none shadow-none">
        <CardHeader>
          <CardTitle>Getting you Onboard with exploreinn</CardTitle>
          <CardDescription>
            Please enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-y-4">
          <ScrollArea className="h-[500px] p-4">
            <UserOnboardingForm />
          </ScrollArea>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
};

export default OnboardingPage;
