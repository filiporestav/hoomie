"use client";

import React from "react";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-center mb-2">
            404
          </CardTitle>
          <p className="text-xl text-center text-muted-foreground">
            Sidan kunde inte hittas
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Det verkar som att du har hamnat på en sida som inte finns. Sidan du
            letar efter kan ha flyttats eller tagits bort.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Startsida
            </Button>
            <Button
              onClick={() => (window.location.href = "/listings")}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              Sök annonser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
