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
import { Home, Loader2, Lock } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdatePassword = async (formData: FormData) => {
    setLoading(true);
    const new_password = formData.get('new_password') as string;
    const confirm_password = formData.get('confirm_password') as string;

    if (new_password !== confirm_password) {
      setError("Lösenorden matchar inte.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: new_password
      });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setIsPasswordUpdated(true);
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
            {isPasswordUpdated ? "Lösenord uppdaterat" : "Uppdatera lösenord"}
          </CardTitle>
          {!isPasswordUpdated && (
            <CardDescription className="text-center">
              Ange ditt nya lösenord nedan
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Fel</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isPasswordUpdated ? (
            <div className="text-center space-y-4">
              <Button 
                className="w-full" 
                onClick={() => router.push('https://semesterbyte.se/konto')}
              >
                Konto
              </Button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget as HTMLFormElement);
                setError(null);
                await handleUpdatePassword(formData);
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">Nytt lösenord</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Bekräfta nytt lösenord</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    required
                    minLength={8}
                  />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uppdaterar...
                    </>
                  ) : (
                    "Uppdatera lösenord"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        {!isPasswordUpdated && (
          <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
              Vill du gå tillbaka?{" "}
              <a
                href="/logga-in"
                className="font-medium text-primary hover:underline"
              >
                Gå till inloggning
              </a>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}