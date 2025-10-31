"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Search } from "lucide-react";

export default function DatabasePage() {
  const [medicineQuery, setMedicineQuery] = useState("");
  const [conditionQuery, setConditionQuery] = useState("");

  const { data: medicines } = api.database.searchMedicines.useQuery({
    query: medicineQuery || undefined,
  });
  const { data: conditions } = api.database.searchConditions.useQuery({
    query: conditionQuery || undefined,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medicine & Disease Database</h1>
        <p className="mt-2 text-gray-600">Search information about medicines and health conditions</p>
      </div>

      <Tabs defaultValue="medicines" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="medicines" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search medicines..."
              value={medicineQuery}
              onChange={(e) => setMedicineQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {medicines && medicines.length > 0 ? (
              medicines.map((medicine) => (
                <Card key={medicine.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{medicine.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {medicine.uses && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Uses:</p>
                        <p className="text-sm text-gray-600">{medicine.uses}</p>
                      </div>
                    )}
                    {medicine.sideEffects && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Side Effects:</p>
                        <p className="text-sm text-gray-600">{medicine.sideEffects}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">
                    {medicineQuery ? "No medicines found" : "Search for medicines"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conditions..."
              value={conditionQuery}
              onChange={(e) => setConditionQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conditions && conditions.length > 0 ? (
              conditions.map((condition) => (
                <Card key={condition.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{condition.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {condition.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Description:</p>
                        <p className="text-sm text-gray-600">{condition.description}</p>
                      </div>
                    )}
                    {condition.symptoms && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Symptoms:</p>
                        <p className="text-sm text-gray-600">{condition.symptoms}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">
                    {conditionQuery ? "No conditions found" : "Search for conditions"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

