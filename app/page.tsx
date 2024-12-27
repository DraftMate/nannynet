//TODO: Change this to home page where users first come to NannyNet page

'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import nannyNetClient, { Nanny, workHistory, Recommendations } from '@/lib/api-clients/nannynet/nannynet-client';

export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  )
}