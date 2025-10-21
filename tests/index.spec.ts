import { z } from "zod/v4";
import * as zm from "zod/mini";
import { toFormikValidationSchema, toFormikValidate } from "../index";

describe("toFormikValidationSchema", () => {
  it("should pass validate without errors", async () => {
    // given
    const object = { name: "mock", age: 32 };
    const { schema, schemaMini } = makeSut();
    const { validate } = toFormikValidationSchema(schema);
    const { validate: validateMini  } = toFormikValidationSchema(schemaMini);

    // when
    const errors = await validate(object);
    const errorsMini = await validateMini(object);

    // then
    expect(errors).toEqual(undefined);
    expect(errorsMini).toEqual(undefined);
  });

  it("should fail validate with error object", async () => {
    // given
    const object = { name: undefined, age: "32" } as any;
    const { schema, schemaMini } = makeSut();
    const { validate } = toFormikValidationSchema(schema);
    const { validate: validateMini  } = toFormikValidationSchema(schemaMini);

    const error = {} as any;
    error.inner = [
      {
        path: "name",
        message: "Invalid input: expected string, received undefined",
      },
      {
        path: "age",
        message: "Invalid input: expected number, received string",
      },
    ];

    // when
    await expect(validate(object)).rejects.toMatchObject(error);
    await expect(validateMini(object)).rejects.toMatchObject(error);
  });
});

describe("toFormikValidate", () => {
  it("should pass validate without errors", async () => {
    // given
    const object = { name: "mock", age: 32 };
    const { schema, schemaMini } = makeSut();
    const validate = toFormikValidate(schema);
    const validateMini = toFormikValidate(schemaMini);

    // when
    const errors = await validate(object);
    const errorsMini = await validateMini(object);

    // then
    expect(errors).toEqual(undefined);
    expect(errorsMini).toEqual(undefined);
  });

  it("should fail validate with error object", async () => {
    // given
    const object = { name: undefined, age: "32" } as any;
    const { schema, schemaMini } = makeSut();
    const validate = toFormikValidate(schema);
    const validateMini = toFormikValidate(schemaMini);

    const error = {
      name: "Invalid input: expected string, received undefined",
      age: "Invalid input: expected number, received string",
    };

    // when
    const errors = await validate(object);
    const errorsMini = await validateMini(object);

    // then
    expect(errors).toMatchObject(error);
    expect(errorsMini).toMatchObject(error);
  });
});

function makeSut() {
  const schema = z.object({
    name: z.string(), // obrigatory name
    age: z.number().optional(), // optional age
  });
  const schemaMini = zm.object({
    name: zm.string(), // obrigatory name
    age: zm.optional(zm.number()), // optional age
  });

  return {
    schema,
    schemaMini
  };
}
