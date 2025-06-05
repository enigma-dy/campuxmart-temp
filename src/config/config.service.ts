export default class ConfigService {
  get jwt() {
    return {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    };
  }

  get admin() {
    return {
      defaultEmail: process.env.ADMIN_EMAIL,
      defaultPassword: process.env.ADMIN_PASSWORD,
    };
  }
}