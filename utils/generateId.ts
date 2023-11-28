export function generateRandomID() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;

    // Generate 4 random letters
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    // Get current date and format it
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2); // Last two digits of the year
    const month = ('0' + (now.getMonth() + 1)).slice(-2); // Month (0-11, so add 1)
    const day = ('0' + now.getDate()).slice(-2);
    const hour = ('0' + now.getHours()).slice(-2);
    const minute = ('0' + now.getMinutes()).slice(-2);

    // Append formatted date to the result
    result += year + month + day + hour + minute;

    return result;
}