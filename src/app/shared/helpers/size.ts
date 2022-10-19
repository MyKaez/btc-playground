export function calculateSize(bytes: number): string {
    let sizes = ['bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes', 'petabytes', 'exabytes'];
    for (let i in sizes) {
        if (bytes < 1_000) {
            return bytes + ' ' + sizes[i];
        }
        bytes /= 1_000;
    }
    return bytes + ' ' + sizes[sizes.length - 1];
}