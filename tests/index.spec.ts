import { z } from "zod";
import { toFormikValidationSchema, toFormikValidate } from "../index";

describe("toFormikValidationSchema", () => {
  it("should pass validate without errors", async () => {
    // given
    const object = { name: "mock", age: 32 };
    const { schema } = makeSut();
    const { validate } = toFormikValidationSchema(schema);

    // when
    const errors = await validate(object);

    // then
    expect(errors).toEqual(undefined);
  });

  it("should fail validate with error object", async () => {
    // given
    const object = { name: undefined, age: "32" } as any;
    const { schema } = makeSut();
    const { validate } = toFormikValidationSchema(schema);

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
  });
});

describe("toFormikValidate", () => {
  it("should pass validate without errors", async () => {
    // given
    const object = { name: "mock", age: 32 };
    const { schema } = makeSut();
    const validate = toFormikValidate(schema);

    // when
    const errors = await validate(object);

    // then
    expect(errors).toEqual(undefined);
  });

  it("should fail validate with error object", async () => {
    // given
    const object = { name: undefined, age: "32" } as any;
    const { schema } = makeSut();
    const validate = toFormikValidate(schema);

    const error = {
      name: "Invalid input: expected string, received undefined",
      age: "Invalid input: expected number, received string",
    };

    // when
    const errors = await validate(object);

    // then
    expect(errors).toMatchObject(error);
  });
});

function makeSut() {
  const schema = z.object({
    name: z.string(), // obrigatory name
    age: z.number().optional(), // optional age
  });

  return {
    schema,
  };
}
