/// <reference lib="dom" />

// import ApiClient, { InvalidResponseError, StatusCodeError } from 'simple-api-client';
import BaseError from '@/lib/base-error'

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
        accessToken: string
        refreshToken: string
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

    async jsonFetch(url: string) {
        try {
            const response = await fetch(`${this.host}${url}`, {
                method: 'GET',
                headers: this.getDefaultHeaders()
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

    async jsonFetchPost(url: string, body: string) {
        if(body == null) {
            throw new DataParserError('no body found', {property: 'body', value: body})
        }
        try {
            const response = await fetch(`${this.host}${url}`, {
                method: 'POST',
                headers: this.getDefaultHeaders(),
                body: body
            })
            //Success
            if(response.status == 201) {
                return response.json()
            }
            if(response.status == 401) {
                throw new Error('Unauthorized to call POST endpoint')
            }
            if(response.status == 500) {
                throw new Error('POST ednpoint internal server error')
            }
        } catch(err) {
            // network error
            // TODO: retry
            throw new NetworkError('network error', { url })
        }
    }

    async fetchNannies() {
        const nannies: Nanny[] = await this.jsonFetch('/nannies')
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
        //Check if nanny properties are valid
        this.nannyTypeCheck(nanny)
        //Check if email already exists
        const response = await this.jsonFetch(`/nannies/email/${email}`)
        if(response.length > 0) {
            throw new DataParserError('email already exists', {property: 'email', value: email})
        }

        //Post nanny registration
        const postResponse = await this.jsonFetchPost('/nannies', JSON.stringify(nanny))

    }

    async login(email: string, password: string) {
        
    }

}

// export singleton
export default new NannyNetClient();

export const login = async (email: string, password: string) => {

}

