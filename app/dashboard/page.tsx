import { createClient } from "@/lib/supabase/server"
import { ProcedureCard } from "@/components/injexpro/procedure-card"

// Fallback data in case database is not available
const fallbackProcedures = [
  {
    id: "1",
    name: "Forehead Lines Treatment",
    area: "Forehead",
    type: "Neurotoxin" as const,
    description:
      "Treatment of horizontal forehead lines using botulinum toxin injections targeting the frontalis muscle.",
    slug: "forehead-lines",
  },
  {
    id: "2",
    name: "Glabellar Lines Treatment",
    area: "Glabella",
    type: "Neurotoxin" as const,
    description:
      "Treatment of vertical frown lines between the eyebrows targeting the corrugator and procerus muscles.",
    slug: "glabellar-lines",
  },
  {
    id: "3",
    name: "Crow's Feet Treatment",
    area: "Periorbital",
    type: "Neurotoxin" as const,
    description: "Treatment of lateral canthal lines targeting the orbicularis oculi muscle.",
    slug: "crows-feet",
  },
  {
    id: "4",
    name: "Nasolabial Fold Enhancement",
    area: "Mid-face",
    type: "Dermal Filler" as const,
    description: "Enhancement of nasolabial folds using hyaluronic acid dermal fillers.",
    slug: "nasolabial-folds",
  },
  {
    id: "5",
    name: "Lip Enhancement",
    area: "Lips",
    type: "Dermal Filler" as const,
    description: "Lip volume enhancement and contouring using hyaluronic acid fillers.",
    slug: "lip-enhancement",
  },
]

export default async function DashboardPage() {
  let procedures = fallbackProcedures

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("procedures").select("*").order("name")

    if (!error && data && data.length > 0) {
      procedures = data
    }
  } catch (error) {
    console.error("Database connection error:", error)
    // Use fallback data
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Injection Library</h1>
        <p className="text-muted-foreground mt-2">Access comprehensive injection protocols and safety guidelines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {procedures?.map((procedure) => (
          <ProcedureCard key={procedure.id} procedure={procedure} />
        ))}
      </div>
    </div>
  )
}
