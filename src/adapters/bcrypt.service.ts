import bcrypt from 'bcrypt';


class BcryptService {

    async  passwordHash(password:string) {
        const salt = await bcrypt.genSalt(10);
          return bcrypt.hash(password, salt);
}

    async checkPassword(password:string, hash:string) {
        return await bcrypt.compare(password, hash);
    }
}

export const bcryptService = new BcryptService();
