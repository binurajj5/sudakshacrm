import { applyDecorators, Type } from '@nestjs/common';
// Swagger will be added later
// import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  // Temporary placeholder - will add swagger documentation later
  return applyDecorators();
};