import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 clinical-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">IP</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-primary">Welcome to InjexPro</CardTitle>
          <CardDescription>Sign in to your clinical injection management platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> Use any email address and password (min. 6 characters) to test the
              application.
            </AlertDescription>
          </Alert>

          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
