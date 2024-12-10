// import ApiClient, { InvalidResponseError, StatusCodeError } from 'simple-api-client';
import BaseError from '@/lib/base-error'

class StatusCodeError extends BaseError<{status: number, url: string}> {}
class NetworkError extends BaseError<{ url: string }> {}
class JSONParseError extends BaseError<{ bodyText?: string }> {}
class DataParserError extends BaseError<{ property: string, value: any }> {}

export interface Nanny {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    yearsOfExperience: number
    createdAt: Date
}
export interface workHistory {
    id: number
    nannyId: number;
    jobTitle: string;
    description?: string;
    startDate: string;
    endDate?: string;
}
export interface Recommendations {
    id: number;
    nannyId: number;
    customerName: string;
    customerEmail: string;
    text: string;
    rating: number;
}

class NannyNetClient {
    host: string
    defaultHeaders: Headers
    constructor() {
        this.host = '/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        }
    }

    async fetch(url: string) {
        try {
            const response = await fetch(`${this.host}${url}`, {
                method: 'GET',
                headers: this.defaultHeaders
            })
            if(response.status == 200) {
                // success
                let bodyText
                try {
                    bodyText = await response.text()
                } catch (err) {
                    throw new NetworkError('network error: receiving body', { url })
                }
                try {
                    const bodyJSON = JSON.parse(bodyText)
                    return bodyJSON;
                } catch (err) {
                    throw new JSONParseError('json parse error', { bodyText })
                }
            } else {
                // failure, check status code
                throw new StatusCodeError(response.statusText ?? "status code error", { status: response.status, url })
            }
        } catch(err) {
            // network error
            // TODO: retry
            throw new NetworkError('network error', { url })
        }
    }

    async fetchNannies() {
        const nannies: Nanny[] = await this.fetch('/nanny')
        console.log(nannies)
        nannies.forEach(nanny => this.nannyTypeCheck(nanny))
        
        return nannies
    }

    nannyTypeCheck(nanny: Nanny) {
        if(nanny.id == null) {
            throw new DataParserError('no id found', {property: 'id', value: nanny.id})
        } 
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

    async fetchWorkHistory(nannyId: number) {
        // nannyId required to make request
        if(nannyId == null) {
            throw new DataParserError('no nanny id found', {property: 'nannyId', value: nannyId})
        }
       const workHistory = await this.fetch(`/work-history/${nannyId}`)
       if(workHistory.id == null) {
            throw new DataParserError('no id found', {property: 'id', value: workHistory.id})
        }  
        if(workHistory.jobTitle == null) {
            throw new DataParserError('no job title found', {property: 'jobTitle', value: workHistory.jobTitle})
        }
        if(workHistory.startDate == null) {
            throw new DataParserError('no start date found', {property: 'startDate', value: workHistory.startDate})
        }
        return workHistory
    }

    async fetchRecommendations(nannyId: number) {
        const recommendations = await this.fetch(`/recommendations/${nannyId}`)
        if(nannyId == null) {
            throw new DataParserError('no nanny id found')
        }
        if(recommendations.id == null) {
            throw new DataParserError('no id found', {property: 'id', value: recommendations.id})
        }
        if(recommendations.customerName == null) {
            throw new DataParserError('no customer name found', {property: 'customerName', value: recommendations.customerName})
        }
        if(recommendations.customerEmail == null) {
            throw new DataParserError('no customer email found', {property: 'customerEmail', value: recommendations.customerEmail})
        }
        if(recommendations.text == null) {
            throw new DataParserError('no text found', {property: 'text', value: recommendations.text})
        }
        if(recommendations.rating == null) {
            throw new DataParserError('no rating found', {property: 'rating', value: recommendations.rating})
        }
        return recommendations
    }
}

// export singleton
export default new NannyNetClient();


