import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, FileX, Clock, TrendingUp } from "lucide-react"

export function QuickStats() {
  const stats = [
    {
      title: "Conversions réussies",
      value: "127",
      change: "+12%",
      icon: FileCheck,
      trend: "up",
    },
    {
      title: "En attente",
      value: "3",
      change: "",
      icon: Clock,
      trend: "neutral",
    },
    {
      title: "Erreurs",
      value: "5",
      change: "-2%",
      icon: FileX,
      trend: "down",
    },
    {
      title: "Taux de succès",
      value: "96.2%",
      change: "+1.2%",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p
                  className={`text-xs ${
                    stat.trend === "up"
                      ? "text-chart-2"
                      : stat.trend === "down"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change} par rapport au mois dernier
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
