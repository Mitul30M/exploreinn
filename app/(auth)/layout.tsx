import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Exploreinn Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen bg-background border-border/90 border-x-[1px] !max-w-7xl m-auto">
        <div className="relative hidden h-full flex-col bg-muted p-8  dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-medium text-background ">
            <Link
              href={"/"}
              className="mr-4 flex items-center gap-1 font-semibold"
            >
              exploreinn
            </Link>
          </div>
          <div className="relative z-20 mt-auto text-background">
            <blockquote className="space-y-2">
              <p className="text-lg font-semibold">
                &ldquo;ExploreInn makes travel planning effortless with its
                seamless booking process, AI-powered recommendations, and
                features tailored for both travelers and hotel managers. A true
                game-changer in hospitality.&rdquo;
              </p>
              <footer className="text-sm font-medi">
                Mitul Mungase, Project Developer
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
