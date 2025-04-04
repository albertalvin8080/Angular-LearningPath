import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component";

describe('HeroesComponent', () => {
    let mockHeroeService;
    let heroesComponent: HeroesComponent;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: "Jakub Farobek", strength: 24},
            {id: 2, name: "Helmuth Voss", strength: 31},
            {id: 3, name: "Emil Sebe", strength: 42},
        ];

        mockHeroeService = jasmine.createSpyObj(['deleteHero', 'getHero', 'addHero']);
        heroesComponent = new HeroesComponent(mockHeroeService);
    });

    it('should delete hero from list when requested', () => {
        mockHeroeService.deleteHero.and.returnValue(of(true)); // rxjs.of
        heroesComponent.heroes = HEROES;

        heroesComponent.delete(HEROES[1]);

        expect(heroesComponent.heroes.length).toBe(2);
        // expect(heroesComponent.heroes).toContain(HEROES[1]);
        expect(heroesComponent.heroes).not.toContain(HEROES[1]);
    });

    it('should call deleteHero when hero is deleted', () => {
        mockHeroeService.deleteHero.and.returnValue(of(true)); // rxjs.of
        heroesComponent.heroes = HEROES;

        heroesComponent.delete(HEROES[1]);

        expect(mockHeroeService.deleteHero).toHaveBeenCalledOnceWith(HEROES[1]);
    });
});