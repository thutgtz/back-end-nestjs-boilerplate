/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpService } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import axios from 'axios'
import { mockEnvConfiguration } from '../mock-implement/config.service'
import { HttpModule } from '../../src/utilities/customHttpModule/custom-http.module'

let requestInterceptors: (v: any) => void
let responseInterceptors: (v: any) => void

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    interceptors: {
      request: {
        use: (fn) => {
          requestInterceptors = fn
        },
      },
      response: {
        use: (fn) => {
          responseInterceptors = fn
        },
      },
    },
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockAxios = axios as jest.Mocked<typeof axios>
describe('HttpModule', () => {
  let app: TestingModule
  let httpService: HttpService

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [mockEnvConfiguration],
          isGlobal: true,
        }),
        HttpModule,
      ],
    }).compile()
    await app.init()
    httpService = app.get<HttpService>(HttpService)
  })

  afterEach(async () => await app.close())

  describe('HttpService', () => {
    it('should return "Hello World!"', async () => {
      // requestInterceptors({})
      // responseInterceptors({})
      mockAxios.get.mockImplementation(() => Promise.resolve({ status: 200, data: null }))
      const response = await httpService.axiosRef.get('http://mock.mock')

      expect(response.status).toBe(200)
    })
  })
})
