// components/LoginPage.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust the path as necessary
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { supabase } = useAuth(); // Get supabase from context
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("LoginPage: Attempting to sign in with", email);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("LoginPage: Error signing in:", error.message);
      setError(error.message);
    } else {
      console.log("LoginPage: Signed in successfully");
      setError(null);
      router.push("/konto"); // Navigate to account page
      // No need to call router.refresh(), as AuthContext will update via onAuthStateChange
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Välkommen tillbaka
          </CardTitle>
          <CardDescription className="text-center">
            Logga in för att fortsätta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              setError(null);
              await handleLogin(formData);
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="din.email@student.se"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="******"
                />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loggar in...
                  </>
                ) : (
                  "Logga in"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-center w-full text-muted-foreground">
              Har du inget konto?{" "}
              <a
                href="/skapa-konto"
                className="font-medium text-primary hover:underline"
              >
                Skapa ett konto
              </a>
            </p>
            <p className="text-sm text-center w-full text-muted-foreground">
              Glömt lösenordet?{" "}
              <a
                href="/aterstall-losenord"
                className="font-medium text-primary hover:underline"
              >
                Återställ lösenord
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
