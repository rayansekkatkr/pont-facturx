import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePanelSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="border border-primary/10 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className={idx === 2 ? "md:col-span-2" : undefined}>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-primary/10 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-56" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <Card className="border border-primary/10 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-36" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[0, 1].map((idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 border border-primary/10 bg-card/60 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-4 w-72" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
