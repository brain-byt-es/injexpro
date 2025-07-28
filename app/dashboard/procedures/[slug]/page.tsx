import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { WorkflowDialog } from "@/components/injexpro/workflow-dialog"
import Image from "next/image"

interface ProcedurePageProps {
  params: {
    slug: string
  }
}

// Fallback data for procedures
const fallbackProcedures: Record<string, any> = {
  "forehead-lines": {
    id: "1",
    name: "Forehead Lines Treatment",
    area: "Forehead",
    type: "Neurotoxin",
    description:
      "Treatment of horizontal forehead lines using botulinum toxin injections targeting the frontalis muscle.",
    slug: "forehead-lines",
    injection_patterns: [
      {
        id: "1",
        pattern_name: "Standard Forehead Pattern",
        target_muscles: ["frontalis"],
        dosages: [
          {
            site_name: "Central forehead",
            dosage_range: "4-6 units",
            depth: "Intramuscular",
            notes: "Avoid over-treatment to prevent brow ptosis",
          },
          {
            site_name: "Lateral forehead",
            dosage_range: "2-4 units per side",
            depth: "Intramuscular",
            notes: "Maintain natural brow arch",
          },
        ],
      },
    ],
  },
  "glabellar-lines": {
    id: "2",
    name: "Glabellar Lines Treatment",
    area: "Glabella",
    type: "Neurotoxin",
    description:
      "Treatment of vertical frown lines between the eyebrows targeting the corrugator and procerus muscles.",
    slug: "glabellar-lines",
    injection_patterns: [
      {
        id: "2",
        pattern_name: "Standard Glabellar Pattern",
        target_muscles: ["corrugator supercilii", "procerus", "depressor supercilii"],
        dosages: [
          {
            site_name: "Procerus",
            dosage_range: "4-6 units",
            depth: "Intramuscular",
            notes: "Single injection point",
          },
          {
            site_name: "Corrugator (medial)",
            dosage_range: "4-6 units per side",
            depth: "Intramuscular",
            notes: "Avoid medial injection to prevent ptosis",
          },
        ],
      },
    ],
  },
  "crows-feet": {
    id: "3",
    name: "Crow's Feet Treatment",
    area: "Periorbital",
    type: "Neurotoxin",
    description: "Treatment of lateral canthal lines targeting the orbicularis oculi muscle.",
    slug: "crows-feet",
    injection_patterns: [
      {
        id: "3",
        pattern_name: "Standard Crow's Feet Pattern",
        target_muscles: ["orbicularis oculi"],
        dosages: [
          {
            site_name: "Lateral canthal area",
            dosage_range: "6-12 units per side",
            depth: "Intradermal/Superficial",
            notes: "Inject lateral to orbital rim to avoid diplopia",
          },
        ],
      },
    ],
  },
  "nasolabial-folds": {
    id: "4",
    name: "Nasolabial Fold Enhancement",
    area: "Mid-face",
    type: "Dermal Filler",
    description: "Enhancement of nasolabial folds using hyaluronic acid dermal fillers.",
    slug: "nasolabial-folds",
    injection_patterns: [
      {
        id: "4",
        pattern_name: "Linear Threading Technique",
        target_muscles: ["N/A - Soft tissue enhancement"],
        dosages: [
          {
            site_name: "Deep nasolabial fold",
            dosage_range: "0.5-1.0ml per side",
            depth: "Deep dermal/Subcutaneous",
            notes: "Use linear threading or serial puncture technique",
          },
        ],
      },
    ],
  },
  "lip-enhancement": {
    id: "5",
    name: "Lip Enhancement",
    area: "Lips",
    type: "Dermal Filler",
    description: "Lip volume enhancement and contouring using hyaluronic acid fillers.",
    slug: "lip-enhancement",
    injection_patterns: [
      {
        id: "5",
        pattern_name: "Comprehensive Lip Enhancement",
        target_muscles: ["N/A - Soft tissue enhancement"],
        dosages: [
          {
            site_name: "Upper lip body",
            dosage_range: "0.3-0.5ml",
            depth: "Superficial to mid-dermal",
            notes: "Enhance volume while maintaining natural shape",
          },
          {
            site_name: "Lower lip body",
            dosage_range: "0.2-0.4ml",
            depth: "Superficial to mid-dermal",
            notes: "Balance with upper lip enhancement",
          },
        ],
      },
    ],
  },
}

export default async function ProcedurePage({ params }: ProcedurePageProps) {
  let procedure = fallbackProcedures[params.slug]

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("procedures")
      .select(`
        *,
        injection_patterns (*)
      `)
      .eq("slug", params.slug)
      .single()

    if (!error && data) {
      procedure = data
    }
  } catch (error) {
    console.error("Database connection error:", error)
    // Use fallback data
  }

  if (!procedure) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">{procedure.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{procedure.area}</p>
          </div>
          <Badge
            variant={procedure.type === "Neurotoxin" ? "default" : "secondary"}
            className={`${procedure.type === "Neurotoxin" ? "bg-primary" : "bg-success"} text-lg px-3 py-1`}
          >
            {procedure.type}
          </Badge>
        </div>

        <p className="text-muted-foreground">{procedure.description}</p>
      </div>

      {/* Anatomical Illustration */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Anatomical Reference</h2>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?width=600&height=400"
            alt="Anatomical illustration"
            width={600}
            height={400}
            className="rounded-lg border"
          />
        </div>
      </div>

      {/* Injection Patterns */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Injection Patterns</h2>

        {procedure.injection_patterns && procedure.injection_patterns.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {procedure.injection_patterns.map((pattern: any, index: number) => (
              <AccordionItem key={pattern.id} value={`pattern-${index}`}>
                <AccordionTrigger className="text-left">
                  <div>
                    <h3 className="font-medium">{pattern.pattern_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Target muscles:{" "}
                      {Array.isArray(pattern.target_muscles)
                        ? pattern.target_muscles.join(", ")
                        : pattern.target_muscles}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <h4 className="font-medium">Injection Sites & Dosages:</h4>
                    <div className="grid gap-4">
                      {pattern.dosages?.map((dosage: any, dosageIndex: number) => (
                        <div key={dosageIndex} className="border rounded-lg p-4 bg-slate-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h5 className="font-medium text-sm">Site</h5>
                              <p className="text-sm">{dosage.site_name}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm">Dosage Range</h5>
                              <p className="text-sm">{dosage.dosage_range}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-sm">Depth</h5>
                              <p className="text-sm">{dosage.depth}</p>
                            </div>
                          </div>
                          {dosage.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <h5 className="font-medium text-sm">Notes</h5>
                              <p className="text-sm text-muted-foreground">{dosage.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground">No injection patterns available for this procedure.</p>
        )}
      </div>

      {/* Workflow Button */}
      <div className="flex justify-center">
        <WorkflowDialog procedureName={procedure.name} />
      </div>
    </div>
  )
}
