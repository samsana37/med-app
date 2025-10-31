import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your health management center</p>
      </div>

      {/* Emergency Alert Button */}
      <div className="mb-8">
        <Card className="border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Emergency Alert</CardTitle>
            <CardDescription>
              Click to view emergency contacts and critical health information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="lg" className="w-full md:w-auto">
              🚨 Emergency Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-600">to take</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-600">this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-600">this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Caregivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-600">contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/medications">
              <Button variant="outline" className="w-full justify-start">
                💊 Add Medication
              </Button>
            </Link>
            <Link href="/mood">
              <Button variant="outline" className="w-full justify-start">
                😊 Log Mood
              </Button>
            </Link>
            <Link href="/symptoms">
              <Button variant="outline" className="w-full justify-start">
                📋 Log Symptom
              </Button>
            </Link>
            <Link href="/health">
              <Button variant="outline" className="w-full justify-start">
                💓 Log Vital Signs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Medications</CardTitle>
            <CardDescription>Check off medications you've taken</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">No medications scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Mood Entry</CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">😢</Button>
              <Button variant="outline" size="sm">😟</Button>
              <Button variant="outline" size="sm">😐</Button>
              <Button variant="outline" size="sm">🙂</Button>
              <Button variant="outline" size="sm">😊</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

