import { HttpModule as AxiosHttpModule, HttpService } from '@nestjs/axios'
import { Global, Module, OnModuleInit } from '@nestjs/common'
import { CustomLogger } from '../customLogger/custom-logger'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

@Global()
@Module({
  imports: [AxiosHttpModule],
  providers: [CustomLogger],
  exports: [AxiosHttpModule],
})
export class HttpModule extends AxiosHttpModule implements OnModuleInit {
  constructor(private httpService: HttpService, private customLogger: CustomLogger) {
    super()
  }

  onModuleInit(): any {
    const { axiosRef: axios } = this.httpService

    axios.interceptors.request.use(
      (config) => {
        return this.onRequest(config)
      },
      (err) => {
        throw err
      }
    )
    axios.interceptors.response.use(
      (res) => {
        return this.onResponse(res)
      },
      (err: AxiosError) => {
        this.onResponse(err.response)
        throw err
      }
    )
  }

  private onRequest(config: InternalAxiosRequestConfig<any>) {
    config.headers['correlationId'] = this.customLogger.getCorrelationId()
    return config
  }

  private onResponse(res: AxiosResponse<any, any>) {
    this.customLogger.logAxiosHttpResponse(res)
    return res
  }
}
