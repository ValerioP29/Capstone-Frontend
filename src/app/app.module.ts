import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthModule } from './auth/auth.module';
import { HTTP_INTERCEPTORS, provideHttpClient,withInterceptorsFromDi} from '@angular/common/http';
import { MyHotelComponent } from './components/hotel/my-hotel/my-hotel.component';
import { RoleGuard } from './auth/role.guard';
import { NewHotelComponent } from './components/hotel/new-hotel/new-hotel.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScoreRankingComponent } from './components/score-ranking/score-ranking.component';
import { DashboardClientComponent } from './components/dashboard-client/dashboard-client.component';
import { ScoreComponent } from './components/score/score.component';
import { FeedbackClientComponent } from './components/feedback-client/feedback-client.component';
import { RewardComponent } from './components/reward/reward.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthInterceptor } from './auth/auth.interceptor';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FeedbackComponent,
    ScoreRankingComponent,
    NavbarComponent,
    MyHotelComponent,
    NewHotelComponent,
    ScoreRankingComponent,
    DashboardClientComponent,
    ScoreComponent,
    FeedbackClientComponent,
    RewardComponent,
    ProfileComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
