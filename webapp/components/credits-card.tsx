"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CreditCard } from "lucide-react"

export function CreditsCard() {
  const creditsUsed = 145
  const creditsTotal = 1000
  const percentage = (creditsUsed / creditsTotal) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Crédits disponibles</CardTitle>
        <CardDescription>Plan Professionnel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold">{creditsTotal - creditsUsed}</span>
            <span className="text-sm text-muted-foreground">/ {creditsTotal} crédits</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">{creditsUsed} crédits utilisés ce mois</p>
        </div>

        <div className="space-y-2 rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Prix par conversion</span>
            <span className="font-medium">0,50 €</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Renouvellement</span>
            <span className="font-medium">15 janvier 2026</span>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          <CreditCard className="mr-2 h-4 w-4" />
          Acheter des crédits
        </Button>
      </CardContent>
    </Card>
  )
}
