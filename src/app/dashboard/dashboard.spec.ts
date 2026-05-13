import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DashboardComponent } from './dashboard';
import { DashboardService } from '../services/dashboard';
import { ApiGatewayService } from '../services/api-gateway.service';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) },
        },
        {
          provide: DashboardService,
          useValue: {
            getRealmUser: (): Observable<string> => of('Unknown Realm'),
          },
        },
        {
          provide: ApiGatewayService,
          useValue: {
            getProducts: (): Observable<unknown[]> => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
