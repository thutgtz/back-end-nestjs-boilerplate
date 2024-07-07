import { Type, applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { CustomResponse } from '../interceptors/models/custom-response.model'

type SwaggerApiResponseType = 'array' | 'object'
export const SwaggerApiResponse = <TModel extends Type<unknown>>(
  model?: TModel,
  type: SwaggerApiResponseType = 'object'
) => {
  const properties = { data: {} }

  if (model && type === 'array') {
    properties.data = {
      type: 'array',
      items: {
        $ref: getSchemaPath(model),
      },
    }
  }
  if (model && type === 'object') {
    properties.data = {
      $ref: getSchemaPath(model),
    }
  }

  return applyDecorators(
    model ? ApiExtraModels(CustomResponse, model) : ApiExtraModels(CustomResponse),
    ApiResponse({
      status: 200,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(CustomResponse),
          },
          {
            properties,
          },
        ],
      },
    })
  )
}
