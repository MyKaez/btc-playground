export interface ContactDescription {
    name: string;
    description: string;
    images: Image[];
    quote: string;
    cites: string[];
    paragraphs: string[];
    socialMedia?: SocialMediaInfo[]
}

export interface Image {
    srcFile: string;
    displayDuration?: number;
}

export interface SocialMediaInfo {
    type: "twitter" | "github" | "youtube";
    url: string;
}

export class Display {
    private index: number = 0;

    private constructor(private contact: ContactDescription) {
    }

    static create(contact: ContactDescription): Display {
        const display = new Display(contact);
        if (contact.images.length > 1) {
            display.updateImage();
        }
        return display;
    }

    isMatch(contact: ContactDescription): boolean {
        return contact == this.contact;
    }

    get activeImage(): Image {
        return this.contact.images[this.index];
    }

    private updateImage() {
        setTimeout(() => {
            this.index++;
            if (this.index > this.contact.images.length - 1) {
                this.index = 0;
            }
            this.updateImage();
        }, this.activeImage.displayDuration ?? 5000);
    }
}
