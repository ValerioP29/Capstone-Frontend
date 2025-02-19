import { NewHotelComponent } from './components/hotel/new-hotel/new-hotel.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MyHotelComponent } from './components/hotel/my-hotel/my-hotel.component';
import { RoleGuard } from './auth/role.guard';
import { ScoreRankingComponent } from './components/score-ranking/score-ranking.component';
import { DashboardClientComponent } from './components/dashboard-client/dashboard-client.component';
import { ScoreComponent } from './components/score/score.component';
import { RewardComponent } from './components/reward/reward.component';
import { FeedbackClientComponent } from './components/feedback-client/feedback-client.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rotte protette dall'AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: {roles: ['ROLE_HOTEL']} },


  // SOLO HOTEL
  { path: 'feedback', component: FeedbackComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_HOTEL'] } },
  { path: 'score-ranking', component: ScoreRankingComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_HOTEL'] } },
  { path: 'my-hotel', component: MyHotelComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_HOTEL'] } },
  { path: 'new-hotel', component: NewHotelComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_HOTEL'] } },
  {path: 'dashboard', component: DashboardComponent, canActivate:[RoleGuard], data: { roles: ['ROLE_HOTEL']}},
  {path: 'details/:id', component: DetailsComponent, canActivate: [RoleGuard], data: {roles: ['ROLE_HOTEL']}},

  //SOLO CLIENT
  {path: 'dashboard-client', component: DashboardClientComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_CLIENT']}},
  {path: 'score', component: ScoreComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_CLIENT']}},
  {path: 'reward', component: RewardComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_CLIENT']}},
  {path: 'feedback-client', component: FeedbackClientComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_CLIENT']}},
  {path: 'profile', component: ProfileComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_CLIENT']}},

  // Wildcard alla fine
  { path: '**', redirectTo: 'login' },


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
