/// <reference lib="dom" />

// import ApiClient, { InvalidResponseError, StatusCodeError } from 'simple-api-client';
import BaseError from '@/lib/base-error'
// import { verifyPassword, hashPassword } from '@/lib/hash-password'

class StatusCodeError extends BaseError<{status: number, url: string}> {}
class NetworkError extends BaseError<{ url: string }> {}
class JSONParseError extends BaseError<{ bodyText?: string }> {}
class DataParserError extends BaseError<{ property: string, value: any }> {}
class RegistrationError extends BaseError<{ email: string }> {}


export interface Nanny {
    id?: string,
    firstName: string,
    lastName: string,
    email: string,
    yearsOfExperience: number
    password: string
    createdAt: Date
}
export interface workHistory {
    id?: number
    nannyId: string;
    jobTitle: string;
    description?: string;
    startDate: string;
    endDate?: string;
}
export interface Recommendations {
    id?: number;
    nannyId: string;
    customerName: string;
    customerEmail: string;
    text: string;
    rating: number;
}

class NannyNetClient {
    host: string
    defaultHeaders: Headers
    auth: {
        accessToken: string | null
        refreshToken: string | null
    } | undefined
    constructor() {
        this.host = '/api';
        this.defaultHeaders = {
            // @ts-ignore
            'Content-Type': 'application/json'
        }
    }

    getDefaultHeaders(): Headers {
        if (this.auth) {
            return {
                ...this.defaultHeaders,
                // @ts-ignore
                'Authorization': `Bearer ${this.auth.accessToken}`
            }
        }
        return this.defaultHeaders
    }

    async jsonFetch(url: string, init: RequestInit = {method: 'GET'}) {
        let response
        try {
            response = await fetch(`${this.host}${url}`, {
                ...init,
                headers: this.getDefaultHeaders()
            })
        } catch(err) {
            // network error
            // TODO: retry
            throw NetworkError.wrap(err as any, 'network error', { url })
        }

        if (!response.ok) {
            // failure, check status code
            throw new StatusCodeError(response.statusText ?? "status code error", { status: response.status, url })
        }

        // success
        let bodyText
        try {
            bodyText = await response.text()
        } catch (err) {
            throw NetworkError.wrap(err as any, 'network error: receiving body', { url })
        }
        try {
            const bodyJSON = JSON.parse(bodyText)
            return bodyJSON;
        } catch (err) {
            throw JSONParseError.wrap(err as any, 'json parse error', { bodyText })
        }
    }

    async jsonPost(url: string, body: {}, init: Omit<RequestInit, 'body' | 'method'> = {}) {
        console.log(body)
        return this.jsonFetch(url, {
            ...init,
            method: 'POST',
            body : JSON.stringify(body)
        })
    }

    async fetchNannies() {
        
        this.auth =  { accessToken:localStorage.getItem('accessToken'), refreshToken: "" }
        const nannies: Nanny[] = await this.jsonFetch('/nannies', {})
        console.log(nannies)
        nannies.forEach(nanny => {
            if(nanny.id == null) {
                throw new DataParserError('no id found', {property: 'id', value: nanny.id})
            } 
            this.nannyTypeCheck(nanny)
        })
        
        return nannies
    }

    nannyTypeCheck(nanny: Nanny) {
        if(nanny.firstName == null) {
            throw new DataParserError('no first name found', {property: 'firstName', value: nanny.firstName})
        }
        if(nanny.lastName == null) {
            throw new DataParserError('no last name found', {property: 'lastName', value: nanny.lastName})
        }
        if(nanny.email == null) {
            throw new DataParserError('no email found', {property: 'email', value: nanny.email})
        }
        if(nanny.yearsOfExperience == null) {
            throw new DataParserError('no years of experience found', {property: 'yearsOfExperience', value: nanny.yearsOfExperience})
        }
    }

    async fetchWorkHistory(nannyId: string) {
        // nannyId required to make request
        if(nannyId == null) {
            throw new DataParserError('no nanny id found', {property: 'nannyId', value: nannyId})
        }
        const params = {
            nannyId: nannyId
        }
        const workHistories: workHistory[] = await this.jsonFetch(`/nannies/${nannyId}/work-history`)
        workHistories.forEach(workHistory => this.workHistoryTypeChecker(workHistory))
        return workHistories
    }
    
    workHistoryTypeChecker(workHistory: workHistory) {
        if(workHistory.id == null) {
            throw new DataParserError('no id found', {property: 'id', value: workHistory.id})
        }  
        if(workHistory.jobTitle == null) {
            throw new DataParserError('no job title found', {property: 'jobTitle', value: workHistory.jobTitle})
        }
        if(workHistory.startDate == null) {
            throw new DataParserError('no start date found', {property: 'startDate', value: workHistory.startDate})
        }
    }

    async fetchRecommendations(nannyId: string) {
        if(nannyId == null) {
            throw new DataParserError('no nanny id found')
        }
        const recommendations: Recommendations[] = await this.jsonFetch(`/nannies/${nannyId}/recommendations`)
        recommendations.forEach(recommendation => this.recommendationTypeChecker(recommendation))
        return recommendations
    }

    recommendationTypeChecker(recommendation: Recommendations) {
        if(recommendation.id == null) {
            throw new DataParserError('no id found', {property: 'id', value: recommendation.id})
        }
        if(recommendation.customerName == null) {
            throw new DataParserError('no customer name found', {property: 'customerName', value: recommendation.customerName})
        }
        if(recommendation.customerEmail == null) {
            throw new DataParserError('no customer email found', {property: 'customerEmail', value: recommendation.customerEmail})
        }
        if(recommendation.text == null) {
            throw new DataParserError('no text found', {property: 'text', value: recommendation.text})
        }
        if(recommendation.rating == null) {
            throw new DataParserError('no rating found', {property: 'rating', value: recommendation.rating})
        }
    }

    async registerNanny(firstName: string, lastName: string, email: string, password: string, yearsOfExperience: number) {
        const nanny: Nanny = {
            firstName,
            lastName,
            email,
            yearsOfExperience,
            password,
            createdAt: new Date()
        }
        console.log(nanny)
        const data = await this.jsonPost('/auth/register/', nanny)
        
        return data

    }

    async login(email: string, password: string) {
        return this.jsonPost(`/auth/login/`, {email, password})
    }

}

// export singleton
export default new NannyNetClient();

export const login = async (email: string, password: string) => {

}

