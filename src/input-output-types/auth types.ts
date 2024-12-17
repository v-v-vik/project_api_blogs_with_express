

export type PasswordRecoveryModel = {
    email: string;
}

export type NewPwRecoveryInputModel = {
    newPassword: string;
    recoveryCode: string
}

export type PayloadRT = {
    userId: string,
    deviceId: string,
    iat: number,
    exp: number
}

export type PayloadAT = {
    userId: string,
    iat: number,
    exp: number
}

export type CodePayload = {
    email: string,
    iat: number,
    exp: number
}