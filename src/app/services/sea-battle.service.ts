import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WidgetSettings } from '../components/units/models';

@Injectable({
    providedIn: 'root',
})
export class SeaBattleService {
    constructor(private http: HttpClient) {}

    public saveSettings(widgetSettings: WidgetSettings, widgetCode: string) {
        return this.http.post(`/api/SeaBattleWidget?widgetCode=${widgetCode}`, widgetSettings);
    }

    public getSettings(widgetCode: string) {
        return this.http.get<WidgetSettings>(`/api/SeaBattleWidget?widgetCode=${widgetCode}`);
    }
}