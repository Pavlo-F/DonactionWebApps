export class Utils {
    public static readImageFile(data: Blob): Promise<string> {
        const reader = new FileReader();
    
        return new Promise((resolve) => {
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(data);
        });
    }
}
