"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Complication {
  id: string
  name: string
  signs_symptoms: string[]
  management_protocol: {
    immediate_steps?: string[]
    treatment_options?: string[]
    emergency_treatment?: string[]
    monitoring?: string[]
    follow_up?: string[]
    prevention?: string[]
  }
}

// Fallback complications data
const fallbackComplications: Complication[] = [
  {
    id: "1",
    name: "Eyelid Ptosis",
    signs_symptoms: [
      "Drooping of upper eyelid",
      "Asymmetrical eye appearance",
      "Difficulty opening affected eye",
      "Patient reports heavy feeling in eyelid",
    ],
    management_protocol: {
      immediate_steps: [
        "Reassure patient that condition is temporary",
        "Document onset time and severity",
        "Take photographs for medical record",
      ],
      treatment_options: [
        "Prescribe apraclonidine 0.5% eye drops (off-label use)",
        "Instruct patient to apply drops 2-3 times daily",
        "Consider iopidine 0.5% as alternative",
      ],
      follow_up: [
        "Schedule follow-up in 1-2 weeks",
        "Monitor progression and recovery",
        "Expected resolution in 2-8 weeks",
      ],
      prevention: [
        "Avoid injection too close to orbital rim",
        "Use appropriate injection depth",
        "Consider lower dosages in high-risk patients",
      ],
    },
  },
  {
    id: "2",
    name: "Vascular Occlusion",
    signs_symptoms: [
      "Immediate blanching of skin",
      "Severe pain at injection site",
      "Skin color changes (white, then blue/purple)",
      "Cool skin temperature",
      "Delayed capillary refill",
    ],
    management_protocol: {
      immediate_steps: [
        "STOP injection immediately",
        "Apply warm compress to area",
        "Massage injection site vigorously",
        "Administer hyaluronidase if HA filler used",
      ],
      emergency_treatment: [
        "Inject hyaluronidase 150-300 units around affected area",
        "Apply nitroglycerin paste 2% if available",
        "Consider aspirin 325mg if no contraindications",
        "Refer to emergency department if severe",
      ],
      monitoring: [
        "Assess for signs of tissue necrosis",
        "Document with serial photography",
        "Monitor for 24-48 hours minimum",
      ],
      follow_up: [
        "Daily assessment until resolved",
        "Consider hyperbaric oxygen therapy for severe cases",
        "Plastic surgery consultation if tissue loss occurs",
      ],
    },
  },
]

export default function ComplicationsPage() {
  const [complications, setComplications] = useState<Complication[]>(fallbackComplications)
  const [filteredComplications, setFilteredComplications] = useState<Complication[]>(fallbackComplications)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchComplications() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("complications").select("*").order("name")

        if (!error && data && data.length > 0) {
          setComplications(data)
          setFilteredComplications(data)
        }
      } catch (error) {
        console.error("Database connection error:", error)
        // Use fallback data which is already set
      }
      setLoading(false)
    }

    fetchComplications()
  }, [])

  useEffect(() => {
    const filtered = complications.filter(
      (complication) =>
        complication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complication.signs_symptoms.some((symptom) => symptom.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredComplications(filtered)
  }, [searchTerm, complications])

  if (loading) {
    return <div>Loading complications...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Complication Protocols</h1>
        <p className="text-muted-foreground mt-2">Emergency management protocols for injection complications</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search complications or symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredComplications.map((complication) => (
          <Card key={complication.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-lg">
                    <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                    {complication.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {complication.signs_symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {complication.management_protocol.immediate_steps && (
                  <AccordionItem value="immediate">
                    <AccordionTrigger className="text-destructive font-medium">Immediate Steps</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-1">
                        {complication.management_protocol.immediate_steps.map((step, index) => (
                          <li key={index} className="text-sm">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {complication.management_protocol.emergency_treatment && (
                  <AccordionItem value="emergency">
                    <AccordionTrigger className="text-destructive font-medium">Emergency Treatment</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-1">
                        {complication.management_protocol.emergency_treatment.map((step, index) => (
                          <li key={index} className="text-sm">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {complication.management_protocol.treatment_options && (
                  <AccordionItem value="treatment">
                    <AccordionTrigger>Treatment Options</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-1">
                        {complication.management_protocol.treatment_options.map((option, index) => (
                          <li key={index} className="text-sm">
                            {option}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {complication.management_protocol.monitoring && (
                  <AccordionItem value="monitoring">
                    <AccordionTrigger>Monitoring</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-1">
                        {complication.management_protocol.monitoring.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {complication.management_protocol.follow_up && (
                  <AccordionItem value="followup">
                    <AccordionTrigger>Follow-up Care</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-1">
                        {complication.management_protocol.follow_up.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {complication.management_protocol.prevention && (
                  <AccordionItem value="prevention">
                    <AccordionTrigger className="text-success">Prevention</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-1">
                        {complication.management_protocol.prevention.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredComplications.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No complications found matching your search.</p>
        </div>
      )}
    </div>
  )
}
