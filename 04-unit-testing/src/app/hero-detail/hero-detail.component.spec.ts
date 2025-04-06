import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "../hero.service";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";

describe('HeroDetailComponent', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockHeroSvc, mockActivatedRoute, mockLocation;

    beforeAll(() => {
        mockLocation = jasmine.createSpyObj(['back']);
        mockHeroSvc = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockActivatedRoute = {
            snapshot: { paramMap: { get: (paramName: string) => { return '3' } } }
        }

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroSvc },
                { provide: Location, useValue: mockLocation },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
        });

        fixture = TestBed.createComponent(HeroDetailComponent);
    });

    it('should add hero name to h2 tag', () => {
        mockHeroSvc.getHero.and.returnValue(of(
            { id: 3, name: 'detestatio sacrorum', strength: 1e-5 }
        ));
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('h2').textContent)
            .toContain('detestatio sacrorum'.toUpperCase());
    });
});