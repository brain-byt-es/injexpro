import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ProcedureCardProps {
  procedure: {
    id: string
    name: string
    area: string
    type: "Neurotoxin" | "Dermal Filler"
    description: string
    slug: string
  }
}

export function ProcedureCard({ procedure }: ProcedureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{procedure.name}</CardTitle>
            <CardDescription>{procedure.area}</CardDescription>
          </div>
          <Badge
            variant={procedure.type === "Neurotoxin" ? "default" : "secondary"}
            className={procedure.type === "Neurotoxin" ? "bg-primary" : "bg-success"}
          >
            {procedure.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{procedure.description}</p>
        <Link href={`/dashboard/procedures/${procedure.slug}`}>
          <Button className="w-full">
            View Protocol
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
