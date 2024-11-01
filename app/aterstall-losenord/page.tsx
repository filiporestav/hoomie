"use client";

import { useState } from "react";
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
import { Home, Loader2, Mail } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handlePasswordReset = async (formData: FormData) => {
    setLoading(true);
    const email = formData.get('email') as string;

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://hoomies.se/nytt-losenord',
      });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setConfirmation("Kolla din e-post för en länk för att återställa lösenordet");
      }
    } catch (err) {
      setError("Ett oväntat fel inträffade. Försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Glömt lösenord
          </CardTitle>
          <CardDescription className="text-center">
            Ange din e-postadress för att återställa ditt lösenord
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Fel</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {confirmation && (
            <Alert className="mb-4">
              <AlertTitle>Framgång</AlertTitle>
              <AlertDescription>{confirmation}</AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              setError(null);
              await handlePasswordReset(formData);
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="din.email@student.se"
                />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  "Återställ lösenord"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-muted-foreground">
            Kom du ihåg ditt lösenord?{" "}
            <a
              href="/logga-in"
              className="font-medium text-primary hover:underline"
            >
              Logga in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}