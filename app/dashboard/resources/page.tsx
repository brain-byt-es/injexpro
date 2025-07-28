import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, DollarSign, Users, Briefcase } from "lucide-react"

const resources = [
  {
    id: "business-plan-template",
    title: "Aesthetic Practice Business Plan Template",
    description: "Comprehensive business plan template specifically designed for aesthetic injection practices",
    category: "Business Planning",
    icon: Briefcase,
    downloadUrl: "#",
  },
  {
    id: "pricing-guide",
    title: "Injection Pricing Strategy Guide",
    description: "Market analysis and pricing strategies for neurotoxin and dermal filler services",
    category: "Pricing",
    icon: DollarSign,
    downloadUrl: "#",
  },
  {
    id: "marketing-toolkit",
    title: "Social Media Marketing Toolkit",
    description: "Templates, content ideas, and compliance guidelines for aesthetic practice marketing",
    category: "Marketing",
    icon: Users,
    downloadUrl: "#",
  },
  {
    id: "consent-forms",
    title: "Legal Consent Form Templates",
    description: "Legally compliant consent forms for various injection procedures",
    category: "Legal",
    icon: FileText,
    downloadUrl: "#",
  },
  {
    id: "insurance-guide",
    title: "Professional Insurance Guide",
    description: "Guide to professional liability insurance for aesthetic injectors",
    category: "Insurance",
    icon: FileText,
    downloadUrl: "#",
  },
  {
    id: "startup-checklist",
    title: "Practice Startup Checklist",
    description: "Step-by-step checklist for launching your aesthetic injection practice",
    category: "Getting Started",
    icon: Briefcase,
    downloadUrl: "#",
  },
]

const categoryColors = {
  "Business Planning": "bg-primary",
  Pricing: "bg-success",
  Marketing: "bg-purple-500",
  Legal: "bg-orange-500",
  Insurance: "bg-blue-500",
  "Getting Started": "bg-green-500",
}

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Side Gig Starter Pack</h1>
        <p className="text-muted-foreground mt-2">
          Essential resources to launch and grow your aesthetic injection practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const IconComponent = resource.icon
          return (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge className={`${categoryColors[resource.category as keyof typeof categoryColors]} text-white`}>
                    {resource.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">{resource.description}</CardDescription>
                <Button className="w-full" asChild>
                  <a href={resource.downloadUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Resource
                  </a>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Need More Support?</h3>
            <p className="text-muted-foreground mt-1">
              Our comprehensive business coaching program provides personalized guidance for launching your aesthetic
              practice.
            </p>
            <Button className="mt-4 bg-transparent" variant="outline">
              Learn More About Coaching
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
