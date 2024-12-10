'use client';
import React, { useState, useEffect } from 'react';

import { Nanny } from '@/types/nanny';
import { workHistory } from '@/types/workHistory';
import { Recommendations } from '@/types/recommendations';

export default function NannyManagementPage() {
  const [nannyForm, setNannyForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    yearsOfExperience: 0
  })


  useEffect(() => {
    async function fetchNannies() {
      try {
        const response = await fetch('/api/nanny')

        if (response.ok) {
          const nannies = await response.json()
          console.log(nannies)
          setNannyForm(nannies)
        }
      } catch (error) {
        console.error('Error fetching nannies:', error);
      }
    }
  }
  )
}