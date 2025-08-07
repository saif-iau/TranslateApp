import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private baseUrl = 'https://api.mymemory.translated.net/get';

   constructor(private http: HttpClient) { }


translate(text: string, from: string = 'en', to: string = 'fr'): Observable<string> {
  const params = new HttpParams()
    .set('q', text)
    .set('langpair', `${from}|${to}`);

  return this.http.get<any>(this.baseUrl, { params }).pipe(
    map(response => {
   
      return response.responseData.translatedText;

    
    })
  );
}

}
