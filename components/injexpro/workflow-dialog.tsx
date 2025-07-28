"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { WorkflowChecklist } from "./workflow-checklist"
import { Play } from "lucide-react"

interface WorkflowDialogProps {
  procedureName: string
}

export function WorkflowDialog({ procedureName }: WorkflowDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-success hover:bg-success/90">
          <Play className="mr-2 h-5 w-5" />
          Start Pre-Procedure Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pre-Procedure Safety Checklist</DialogTitle>
          <DialogDescription>Complete all safety checks before proceeding with {procedureName}</DialogDescription>
        </DialogHeader>
        <WorkflowChecklist procedureName={procedureName} onComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
