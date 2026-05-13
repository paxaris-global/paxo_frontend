import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, NavigationEnd, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { User } from './user';

describe('User', () => {
  let fixture: ComponentFixture<User>;

  beforeEach(async () => {
    const routerEvents = new Subject<NavigationEnd>();
    await TestBed.configureTestingModule({
      imports: [User],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ section: 'users' }),
            snapshot: { data: { section: 'users' } },
            queryParamMap: of(convertToParamMap({})),
          },
        },
        {
          provide: Router,
          useValue: {
            url: '/dashboard/product/users',
            events: routerEvents.asObservable(),
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(User);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
