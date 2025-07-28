"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createWorkflowRecord } from "@/app/actions/workflow-actions"
import { CheckCircle, Loader2 } from "lucide-react"

interface WorkflowChecklistProps {
  procedureName: string
  onComplete: () => void
}

const checklistItems = [
  {
    id: "consent",
    label: "Patient Consent Confirmed",
    description: "Written informed consent obtained and documented",
  },
  {
    id: "anatomy",
    label: "Anatomy Reviewed",
    description: "Facial anatomy and injection sites reviewed with patient",
  },
  {
    id: "medical_history",
    label: "Medical History Verified",
    description: "Contraindications and allergies reviewed",
  },
  {
    id: "emergency_kit",
    label: "Emergency Kit Available",
    description: "Emergency medications and equipment readily accessible",
  },
  {
    id: "sterile_technique",
    label: "Sterile Technique Prepared",
    description: "Sterile field established and maintained",
  },
  {
    id: "product_verification",
    label: "Product Verification Complete",
    description: "Product authenticity, expiration, and storage verified",
  },
]

export function WorkflowChecklist({ procedureName, onComplete }: WorkflowChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleItemCheck = (itemId: string, checked: boolean) => {
    const newCheckedItems = new Set(checkedItems)
    if (checked) {
      newCheckedItems.add(itemId)
    } else {
      newCheckedItems.delete(itemId)
    }
    setCheckedItems(newCheckedItems)
  }

  const allItemsChecked = checkedItems.size === checklistItems.length

  const handleSubmit = async () => {
    if (!allItemsChecked) return

    setIsSubmitting(true)

    try {
      await createWorkflowRecord(procedureName)
      setSuccess(true)
      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (error) {
      console.error("Error creating workflow record:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-success">Workflow Complete!</h3>
        <p className="text-muted-foreground">Safety checklist has been documented.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {checklistItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-slate-50">
            <Checkbox
              id={item.id}
              checked={checkedItems.has(item.id)}
              onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor={item.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {item.label}
              </label>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {!allItemsChecked && (
        <Alert>
          <AlertDescription>Please complete all safety checks before proceeding.</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!allItemsChecked || isSubmitting}
        className="w-full bg-success hover:bg-success/90"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirm & Generate Record
      </Button>
    </div>
  )
}
