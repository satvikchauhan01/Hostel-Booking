export const RATE_LIMIT= Object.freeze({
    BOOKING:{
        LIMIT: 10,
        WINDOW:60
    },
    LOGIN:{
        LIMIT: 5,
        WINDOW:300
    },
    REGISTER:{
        LIMIT: 10,
        WINDOW:3600
    }
})
