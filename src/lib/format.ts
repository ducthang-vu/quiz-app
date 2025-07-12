export function format(str: string): string {
    return str
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, '"')
        .replace(/&#039;s/g, '')
        .replace(/&#039;/g, "'")
        .replace(/&eacute;/g, 'é')
        .replace(/&rsquo;/g, "'")
        .replace(/&divide;/, '/');
}
