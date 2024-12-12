'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import nannyNetClient, { Nanny, workHistory, Recommendations } from '@/lib/api-clients/nannynet/nannynet-client';

export default function NannyManagementPage() {
  const [nannies, setNannyData] = useState([] as Nanny[])
  const [workHistories, setWorkHistories] = useState([] as workHistory[])
  const [recommendations, setRecommendations] = useState([] as Recommendations[])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNanny, setSelectedNanny] = useState(true)

  async function fetchWorkHistories(nannyId: string) {
    try {
      const workHistory: workHistory[] = await nannyNetClient.fetchWorkHistory(nannyId)
      console.log(workHistory)
      setWorkHistories(workHistory)
      setSelectedNanny(true)
    } catch (error) {
      console.log(error)
    }
  }
  async function fetchRecommendations(nannyId: string) {
    try {
      const recommendations: Recommendations[] = await nannyNetClient.fetchRecommendations(nannyId)
      setRecommendations(recommendations)
    } catch (error) {
      console.log(error)
    }
  }

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
            <Card key={nanny.id} className="w-full" onClick={() => { fetchWorkHistories(nanny.id!); fetchRecommendations(nanny.id!) }}>
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
      {
        workHistories.length === 0 ? (
          <p>No work history found.</p>
        ) : (
          <div>
            <h2 className="font-bold">Work History</h2>
            {workHistories.map((workHistory) => (
              <div key={workHistory.id}>
                <p>Job Title: {workHistory.jobTitle}</p>
                {workHistory.description && <p>Description: {workHistory.description}</p>}
                <h2>StartDate: {workHistory.startDate} EndDate: {workHistory.endDate ? workHistory.endDate : "-"}</h2>
              </div>
            ))}
          </div>
        )
      }
      {
        recommendations.length === 0 ? (
          <p>No recommendations found.</p>
        ) : (
          <div>
            <h2 className="font-bold">Recommendations</h2>
            {recommendations.map((recommendation) => (
              <div key={recommendation.id}>
                <p>Review by {recommendation.customerName}</p>
                <p>{recommendation.customerEmail}</p>
                <p>{recommendation.text}</p>
                <p>Rating: {recommendation.rating}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )

}