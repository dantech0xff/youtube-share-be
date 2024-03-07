export class RegisterNewUserRequest {
  email: string
  password: string
  username: string

  constructor(obj: any) {
    this.email = obj.email
    this.password = obj.password
    this.username = obj.username
  }
}
