export const dump_cookies: string = "dump1=value1;dump2=value2"
export const dump_cookies2: Array<any> = ["dump1", "value1", "dump2", "value2"]
export const dump_cookies3: Object = { dump1: "value1", dump2: "value2" }
export const user_agent: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15"
export const api_key: string = process.env.KEY
export const proxy: any = {
    type: process.env.PROXY_TYPE,
    address: process.env.PROXY_ADDRESS,
    port: process.env.PROXY_PORT,
    username: process.env.PROXY_LOGIN,
    password: process.env.PROXY_PASSWORD 
}
export const acceptable_errors: string[] = ["ERROR_CAPTCHA_UNSOLVABLE", "ERROR_MAXIMUM_TIME_EXCEED", "ERROR_NO_SLOT_AVAILABLE"]