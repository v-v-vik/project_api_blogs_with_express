import bcrypt from 'bcrypt';


export const bcryptService = {

    async  passwordHash(password:string) {

        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hash(password, salt);
},

    async checkPassword(password:string, hash:string) {
        return await bcrypt.compare(password, hash);
    }



}

