import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

describe("HeroesComponent (deep)", () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroeService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: "Jakub Farobek", strength: 24 },
            { id: 2, name: "Helmuth Voss", strength: 31 },
            { id: 3, name: "Emil Sebe", strength: 42 },
        ];
        mockHeroeService = jasmine.createSpyObj(['getHeroes', 'deleteHero', 'addHero']);
        TestBed.configureTestingModule({
            declarations: [HeroesComponent, HeroComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroeService },
            ],
            schemas: [NO_ERRORS_SCHEMA], // ignore child component in the html.
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
        mockHeroeService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        // Components are actually Directives (wth)
        const heroCompDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroCompDebugElements.length).toEqual(HEROES.length);

        for (let i = 0; i < heroCompDebugElements.length; ++i) {
            expect(heroCompDebugElements[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });
});