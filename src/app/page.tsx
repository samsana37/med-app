import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">MedAlert</h1>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-5xl font-bold text-gray-900">
          Take Control of Your Health
        </h2>
        <p className="mb-8 text-xl text-gray-600">
          Manage medications, track symptoms, and monitor your wellness all in one place
        </p>
        <Link href="/signin">
          <Button size="lg" className="text-lg">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="mb-12 text-center text-3xl font-bold text-gray-900">Features</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Medication Reminders</CardTitle>
              <CardDescription>
                Never miss a dose with browser notifications and daily checklists
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Emergency Alerts</CardTitle>
              <CardDescription>
                Quick access to emergency contacts and critical health information
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracking</CardTitle>
              <CardDescription>
                Track your daily mood and mental wellness over time
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Symptom Logger</CardTitle>
              <CardDescription>
                Log symptoms with severity levels and track patterns
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>
                Keep track of vital signs and health metrics
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Medicine Database</CardTitle>
              <CardDescription>
                Search comprehensive information about medicines and conditions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>MedAlert - Proof of Concept for College Project</p>
          <p className="mt-2 text-sm">This is a demo application. Not for actual medical use.</p>
          <p className="mt-1 text-xs text-gray-500">⚠️ Not HIPAA compliant - For demonstration purposes only</p>
        </div>
      </footer>
    </div>
  );
}
