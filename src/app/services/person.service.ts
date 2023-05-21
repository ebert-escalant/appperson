import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PersonService {
	baseUrl = 'http://localhost/appapiperson/public/api';
	constructor(private http: HttpClient) {}

	all(page: number): Observable<any> {
		return this.http.get(`${this.baseUrl}/person/all?page=${page}`);
	}

	getById(id: string): Observable<any> {
		return this.http.get(`${this.baseUrl}/person/getbyid/${id}`);
	}

	insert(data: any) {
		return this.http.post(`${this.baseUrl}/person/insert`, data);
	}

	update(id: string, data: any) {
		return this.http.put(`${this.baseUrl}/person/edit/${id}`, data);
	}

	delete(id: string) {
		return this.http.delete(`${this.baseUrl}/person/delete/${id}`);
	}
}
