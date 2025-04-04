import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

describe("HeroesComponent (shallow)", () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroeService;
    let HEROES;

    @Component({
      selector: "app-hero",
      template: "<div></div>",
    })
    class FakeHeroComponent {
      @Input() hero: Hero;
    //   @Output() delete = new EventEmitter();
    
    //   onDeleteClick($event): void {
    //     $event.stopPropagation();
    //     this.delete.next();
    //   }
    }

    beforeEach(() => {
        HEROES = [
            { id: 1, name: "Jakub Farobek", strength: 24 },
            { id: 2, name: "Helmuth Voss", strength: 31 },
            { id: 3, name: "Emil Sebe", strength: 42 },
        ];
        mockHeroeService = jasmine.createSpyObj(['getHeroes', 'deleteHero', 'addHero']);
        TestBed.configureTestingModule({
            declarations: [HeroesComponent, FakeHeroComponent],
            // schemas: [NO_ERRORS_SCHEMA], // ignore child component in the html.
            providers: [
                { provide: HeroService, useValue: mockHeroeService },
            ],
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should populate heroes property', () => {
        mockHeroeService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges(); // also calls ngOnInit()

        // toBe() also checks if the OBJECT is the same, not just the content.
        expect(fixture.componentInstance.heroes).toEqual(HEROES);
    });

    it('should create one li for each hero', () => {
        mockHeroeService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('li')).length).toEqual(3);
    });
});