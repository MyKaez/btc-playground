export class Helper {
    static repeat(intervalInMs: number, cancelOn: () => boolean, action: () => void) {
        const interval = window.setInterval(() => {
            action();
            if(cancelOn()) window.clearInterval(interval);            
        }, intervalInMs);
    }
}