import { MUser } from '/@/api/models/user'
import { Request } from '/@/utils/request'

export interface IUserService {
  info(): Promise<MUser>
}

enum UserApi {
  info = '/user/info',
}

class UserService implements IUserService {
  info() {
    return Request.get<MUser>(UserApi.info, { loading: true })
  }
}

export default new UserService()
