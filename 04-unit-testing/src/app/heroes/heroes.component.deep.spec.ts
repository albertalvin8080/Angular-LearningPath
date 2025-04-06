import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { Component, Directive, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any;

    onClick() {
        // If navigatedTo contains linkParams, then the routerLink is wired successfully.
        this.navigatedTo = this.linkParams;
    }
}

describe("HeroesComponent (deep)", () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: "Jakub Farobek", strength: 24 },
            { id: 2, name: "Helmuth Voss", strength: 31 },
            { id: 3, name: "Emil Sebe", strength: 42 },
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'deleteHero', 'addHero']);
        TestBed.configureTestingModule({
            declarations: [HeroesComponent, HeroComponent, RouterLinkStub],
            providers: [
                { provide: HeroService, useValue: mockHeroService },
            ],
            // schemas: [NO_ERRORS_SCHEMA], // ignore child component in the html - not necessary anymore since were stubbing routerLink.
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        // Components are actually Directives
        const heroCompDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroCompDebugElements.length).toEqual(HEROES.length);

        for (let i = 0; i < heroCompDebugElements.length; ++i) {
            expect(heroCompDebugElements[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });

    it(`should call the delete function when the Hero Component's button is pressed`, () => {
        // NOTE: this.heroService.deleteHero is being called inside the HeroesComponent,
        // but because we're replacing the method delete() with a spy, deleteHero() doesn't get
        // called and the test doesn't break.
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        // DebugEelement[]
        const heroCompDE = fixture.debugElement.queryAll(By.directive(HeroComponent));
        // V1 -> Testing alongside the html
        // heroCompDE[0].query(By.css('button')).triggerEventHandler('click', { stopPropagation: () => { } });
        // V2 -> Ignoring the html and testing only the emission to the parent.
        // (<HeroComponent>heroCompDE[0].componentInstance).delete.emit(undefined);
        // V3
        heroCompDE[0].triggerEventHandler('delete');

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    it('should add hero to heroes list', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        const name = 'NEW HERO';
        mockHeroService.addHero.and.returnValue(of({ id: 4, name, strength: 11 }));

        const input = fixture.debugElement.query(By.css("input"));
        input.nativeElement.value = name;
        const btn = fixture.debugElement.query(By.css("label+button")); // takes the btn
        btn.triggerEventHandler('click', null);
        fixture.detectChanges(); // Makes Angular update the html

        const ul = fixture.debugElement.query(By.css('ul'));
        expect(ul.nativeElement.textContent).toContain(name);
    });

    it('should set navigatedTo to right url', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        const heroComponentDebugElements = fixture.debugElement
            .queryAll(By.directive(HeroComponent));

        const routerLinkStub = heroComponentDebugElements[0]
            .query(By.directive(RouterLinkStub)) // anchor tag <a></a>
            .injector.get(RouterLinkStub) // class RouterLinkStub

        heroComponentDebugElements[0]
            .query(By.directive(RouterLinkStub)) // anchor tag <a></a>
            .triggerEventHandler('click', null)

        expect(routerLinkStub.navigatedTo).toEqual('/detail/1');
    });
});