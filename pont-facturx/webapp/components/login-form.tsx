"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [enable2FA, setEnable2FA] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
          <FileText className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Factur-X</h1>
        <p className="text-sm text-muted-foreground">Convertissez vos factures PDF en format Factur-X</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Accédez à votre compte pour commencer la conversion</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company">Entreprise</TabsTrigger>
              <TabsTrigger value="cabinet">Cabinet</TabsTrigger>
            </TabsList>
            <TabsContent value="company" className="space-y-4 pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-company">Email</Label>
                  <Input id="email-company" type="email" placeholder="votre@email.fr" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-company">Mot de passe</Label>
                  <Input id="password-company" type="password" required disabled={isLoading} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="2fa-company"
                    checked={enable2FA}
                    onCheckedChange={(checked) => setEnable2FA(checked as boolean)}
                  />
                  <Label
                    htmlFor="2fa-company"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Activer l'authentification à deux facteurs (optionnel)
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="cabinet" className="space-y-4 pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-cabinet">Email</Label>
                  <Input id="email-cabinet" type="email" placeholder="cabinet@email.fr" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-cabinet">Mot de passe</Label>
                  <Input id="password-cabinet" type="password" required disabled={isLoading} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="2fa-cabinet"
                    checked={enable2FA}
                    onCheckedChange={(checked) => setEnable2FA(checked as boolean)}
                  />
                  <Label
                    htmlFor="2fa-cabinet"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Activer l'authentification à deux facteurs (optionnel)
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary">
              Mot de passe oublié ?
            </a>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Pas encore de compte ?{" "}
        <a href="#" className="text-primary hover:underline">
          Créer un compte
        </a>
      </p>
    </div>
  )
}
