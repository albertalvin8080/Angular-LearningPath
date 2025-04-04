import { MessageService } from "./message.service";

describe('MessageService', () => {

    it('should be empty when initialized', () => {
        const service = new MessageService(); 

        expect(service.messages.length).toBe(0);
    });

    it('should store a message when one is added', () => {
        const service = new MessageService(); 
        const msg = 'Msg 1';

        service.add(msg);

        expect(service.messages.length).toBe(1);
        expect(service.messages.at(0)).toEqual(msg);
    });
});