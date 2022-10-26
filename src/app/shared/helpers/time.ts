export function calculateTime(seconds: number): string {
    if (seconds < 60) {
        return seconds.toFixed(0).padStart(2, '0') + ' Sekunden';
    }
    let minutes = seconds / 60;
    seconds = seconds % 60;
    if (minutes < 60) {
        return minutes.toFixed(0).padStart(2, '0') + ':' + seconds.toFixed(0).padStart(2, '0') + ' Minuten';
    }
    let hours = minutes / 24;
    minutes = minutes % 24;
    if (hours < 24) {
        return hours.toFixed(0).padStart(2, '0') + ':' + minutes.toFixed(0).padStart(2, '0') + ':' + seconds.toFixed(0).padStart(2, '0') + ' Stunden';
    }
    let days = hours / 365.25;
    hours = hours % 365.25;
    if (days < 365) {
        return days.toFixed(0) + ' Tagen';
    }
    let years = days / 365.25;
    days = days % 365.25;
    return years.toFixed(0) + ' Jahre';
}