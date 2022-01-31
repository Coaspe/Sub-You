const fromNowENtoKR: { [key: string]: string } = {
    'few': '몇 초 전',
    'minutes': '분 전',
    'minute': '1분 전',
    'hours': '시간 전',
    'hour':'시간 전',
    'days': '일 전',
    'day': '하루 전',
    'years': '년 전',
    'year': '1년 전',
    'weeks': '주 전',
    'week': '1주 전',
}

const unit: { [key: number]: string } = {
    
}

export const ENToKR = (time: string) => {
    const inteager = time.split(" ")[0] === 'a' ? "" : time.split(" ")[0]
    let ch: string = fromNowENtoKR[time.split(" ")[1]]

    if (ch === "몇 초 전") {
        return ch
    } else {
        return `${inteager}${ch}`
    }
}

export const subUnit = (sub: number) => {
    const aa = sub.toString().length
}