import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { PunteggiComponent } from './components/punteggi/punteggi.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthModule } from './auth/auth.module';
import { provideHttpClient,withInterceptorsFromDi} from '@angular/common/http';
import { MyHotelComponent } from './components/hotel/my-hotel/my-hotel.component';
import { RoleGuard } from './auth/role.guard';
import { NewHotelComponent } from './components/hotel/new-hotel/new-hotel.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FeedbackComponent,
    PunteggiComponent,
    NavbarComponent,
    MyHotelComponent,
    NewHotelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
