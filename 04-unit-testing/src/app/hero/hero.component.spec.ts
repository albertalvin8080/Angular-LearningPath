import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HeroComponent } from "./hero.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

describe("HeroComponent (shallow tests)", () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA], // Tells angular to not validate the html template.
        });
        fixture = TestBed.createComponent(HeroComponent);
    });

    it("should add correct hero", () => {
        const hero = { id: 1, name: "Johan Liebert", strength: 0 };
        fixture.componentInstance.hero = hero;

        expect(fixture.componentInstance.hero.name).toEqual(hero.name);
    });

    it("should populate the anchor tag", () => {
        const hero = { id: 1, name: "Johan Liebert", strength: 0 };
        fixture.componentInstance.hero = hero;
        fixture.detectChanges(); // enables binding to html template

        expect(fixture.nativeElement.querySelector('a').textContent).toContain(hero.name);
        const debugElementA = fixture.debugElement.query(By.css('a'));
        expect(debugElementA.nativeElement.textContent).toContain(hero.name);
    });
});