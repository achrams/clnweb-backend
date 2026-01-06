import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from "../../app/models/user.js"

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.create({
      fullName:"Admin test",
      email:"admin@mail.com",
      password:"qwertyuiop"
    })
  }
}