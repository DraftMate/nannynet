'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import nannyNetClient, { Nanny, workHistory, Recommendations } from '@/lib/api-clients/nannynet/nannynet-client';
import { useRouter } from 'next/router';

export default function NannyManagementPage() {
    //    const router = useRouter()
    const [nanny, setNannyData] = useState({} as Nanny)
    const [workHistories, setWorkHistories] = useState([] as workHistory[])
    const [recommendations, setRecommendations] = useState([] as Recommendations[])
    const [isLoading, setIsLoading] = useState(true)

    async function fetchWorkHistories(nannyId: string) {
        try {
            const workHistory: workHistory[] = await nannyNetClient.fetchLogginedInWorkHistory()
            console.log(workHistory)
            setWorkHistories(workHistory)
        } catch (error) {
            console.log(error)
        }
    }
    async function fetchRecommendations(nannyId: string) {
        try {
            const recommendations: Recommendations[] = await nannyNetClient.fetchLoggedInRecommendations()
            setRecommendations(recommendations)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        async function fetchNanny() {
            try {
                const nanny = await nannyNetClient.fetchLoggedInNanny()
                setNannyData(nanny)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            }
        }
        fetchNanny()
    }, []
    )
    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Nannies</h1>
            {nanny.id ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                </div>
            ) : (
                <div>
                    <p>
                        No nanny logged in.
                    </p>
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