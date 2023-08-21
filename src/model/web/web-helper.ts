export class WebHelper {
    private static isYoutubeIframeEnsured = false;
    /**
     * Adds an iframe to youtube loading the needed API to use embedded videos
     * @see https://github.com/angular/components/tree/main/src/youtube-player#readme
     */
    public static ensureYoutubeIframe(){
        if(WebHelper.isYoutubeIframeEnsured) return;
        WebHelper.isYoutubeIframeEnsured = true;
        
        // This code loads the IFrame Player API code asynchronously, according to the instructions at
        // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }

    public static async waitSeconds(seconds: number) {
        return new Promise(res => {
            window.setTimeout(res, seconds * 1000);
        });
    }
}