import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WanderDataService {

  private readonly mapUrl = this.baseUrl + 'api/map';

  constructor(
    private http: HttpClient, 
    @Inject('BASE_URL') private baseUrl: string
    ) {}

  public saveWanderData(profile: string, data: any) {
    this.http.post(this.mapUrl+`?profile=${profile}`, data).subscribe(
      result => { console.log(result); },
      error => { console.error(error); }
    );
  }

  public getWanderData(profile: string): Observable<string> {
    return this.http.get<string>(this.mapUrl+`?profile=${profile}`);
  }
}
