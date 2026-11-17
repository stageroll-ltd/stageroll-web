// Where the app lives. Both are placeholders until the listings exist; the
// badges render either way so the page's shape is final.
export const APP_STORE_URL = '#'
export const GOOGLE_PLAY_URL = '#'

// The pages that take the home page's look (home.css): the framed header and
// footer, the column and its rails. The home page and the department pages.
export const framed = (path: string) => path === '/' || path.startsWith('/departments/')
