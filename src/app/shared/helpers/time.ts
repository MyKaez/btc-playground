export function calculateTime(seconds: number): string {
    if (seconds < 60) {
        return seconds.toFixed(0).padStart(2, '0') + ' Sekunden';
    }
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (minutes < 60) {
        return minutes.toFixed(0).padStart(2, '0') + ':' + seconds.toFixed(0).padStart(2, '0') + ' Minuten';
    }
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (hours < 24) {
        return hours.toFixed(0).padStart(2, '0') + ':' + minutes.toFixed(0).padStart(2, '0') + ':' + seconds.toFixed(0).padStart(2, '0') + ' Stunden';
    }
    let days = Math.floor(hours / 24);
    hours = hours % 24;
    if (days < 365.25) {
        return days.toFixed(0) + ' Tage ' + hours.toFixed(0) + ' Stunde/n';
    }
    let years = days / 365.25;
    days = days % 365.25;
    return years.toFixed(0) + ' Jahre';
}