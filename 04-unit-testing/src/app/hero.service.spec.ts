import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";

describe("HeroService", () => {
    let mockMsgSvc;
    let heroSvc: HeroService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        mockMsgSvc = jasmine.createSpyObj(['add']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HeroService,
                { provide: MessageService, useValue: mockMsgSvc }
            ]
        });

        // Takes the controller from the Dependency Injection Registry
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    describe("getHero", () => {
        it('should call the correct url', () => {
            heroSvc = TestBed.inject(HeroService);

            heroSvc.getHero(4).subscribe(hero => {
                expect(hero.id).toBe(4);
            });

            const req = httpTestingController.expectOne("api/heroes/4");
            req.flush({id: 4, name: 'Helmuth Voss', strength: 0});

            expect(req.request.method).toEqual("GET");
            httpTestingController.verify();
        });
    });
});