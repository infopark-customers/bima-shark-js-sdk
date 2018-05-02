'use strict'

import uuidv1 from 'uuid/v1'

const Config = {
  secret: uuidv1(),
  serviceTokenUrl: '/doorkeeper/service_token'
}

export default Config