import { z } from "zod";
import { toFormikValidationSchema } from "../index";

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
        message: "Required",
      },
      {
        path: "age",
        message: "Expected number, received string",
      },
    ];

    // when
    await expect(validate(object)).rejects.toMatchObject(error);
  });
  it("should pass validate without errors", async () => {
    // given
    const object = { name: "mock", age: 32 };
    const { schema } = makeSut();
    const { validateAt } = toFormikValidationSchema(schema);

    // when
    const nameErrors = await validateAt("name", object);
    const ageErrors = await validateAt("age", object);

    // then
    expect(nameErrors).toEqual(undefined);
    expect(ageErrors).toEqual(undefined);
  });

  it("should fail validate with error object", async () => {
    // given
    const object = { name: undefined, age: "32" } as any;
    const { schema } = makeSut();
    const { validateAt } = toFormikValidationSchema(schema);

    // when
    await expect(validateAt("name", object)).rejects.toMatchObject({
      message: "Required",
    });

    // when
    await expect(validateAt("age", object)).rejects.toMatchObject({
      message: "Expected number, received string",
    });
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
