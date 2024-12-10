'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import nannyNetClient, { Nanny, workHistory, Recommendations } from '@/lib/api-clients/nannynet/nannynet-client';

export default function NannyManagementPage() {
  const [nannies, setNannyData] = useState([] as Nanny[])
  const [workHistories, setWorkHistories] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)



  useEffect(() => {

    async function fetchNannies() {
      try {
        const nannies = await nannyNetClient.fetchNannies()
        setNannyData(nannies)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    fetchNannies()
  }, []
  )
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nannies</h1>
      {nannies.length === 0 ? (
        <p>No nannies found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nannies.map((nanny) => (
            <Card key={nanny.id} className="w-full">
              <CardHeader>
                <CardTitle>{`${nanny.firstName} ${nanny.lastName}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Email: {nanny.email}</p>
                <p>Years of Experience: {nanny.yearsOfExperience}</p>
                <p>Registered: {new Date(nanny.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

}