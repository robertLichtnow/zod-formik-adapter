import { z } from "zod/v4";
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

  it("should rethrow errors that are not zod errors", async () => {
    // given
    const object = { name: "mock" };
    const { schema } = makeThrowingSut();
    const { validate } = toFormikValidationSchema(schema);

    // when
    await expect(validate(object)).rejects.toThrow("unexpected failure");
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

  it("should return nested errors for arrays of objects, including index 0", async () => {
    // given
    const schema = z.object({
      items: z.array(z.object({ name: z.string(), age: z.number() })),
    });
    const object = {
      items: [{ name: 1, age: 10 }, { name: "ok", age: 10 }, { name: "ok" }],
    } as any;
    const validate = toFormikValidate(schema);

    // when
    const errors = await validate(object);

    // then
    expect(errors).toEqual({
      items: [
        { name: "Invalid input: expected string, received number" },
        undefined,
        { age: "Invalid input: expected number, received undefined" },
      ],
    });
  });

  it("should return nested errors for nested objects", async () => {
    // given
    const schema = z.object({
      address: z.object({ street: z.string(), number: z.number() }),
    });
    const object = { address: { street: "ok", number: "1" } } as any;
    const validate = toFormikValidate(schema);

    // when
    const errors = await validate(object);

    // then
    expect(errors).toEqual({
      address: { number: "Invalid input: expected number, received string" },
    });
  });

  it("should return errors for arrays of primitives", async () => {
    // given
    const schema = z.object({ tags: z.array(z.string()) });
    const object = { tags: [1, "ok"] } as any;
    const validate = toFormikValidate(schema);

    // when
    const errors = await validate(object);

    // then
    expect(errors).toEqual({
      tags: ["Invalid input: expected string, received number"],
    });
  });

  it("should keep the first error when a field has several issues", async () => {
    // given
    const schema = z.object({
      password: z.string().min(8, "too short").regex(/\d/, "needs a digit"),
    });
    const validate = toFormikValidate(schema);

    // when
    const errors = await validate({ password: "abc" });

    // then
    expect(errors).toEqual({ password: "too short" });
  });

  it("should keep root-level errors under an empty key", async () => {
    // given
    const schema = z
      .object({ a: z.string(), b: z.string() })
      .refine((v) => v.a === v.b, "must match");
    const validate = toFormikValidate(schema);

    // when
    const errors = await validate({ a: "x", b: "y" });

    // then
    expect(errors).toEqual({ "": "must match" });
  });

  it("should rethrow errors that are not zod errors", async () => {
    // given
    const object = { name: "mock" };
    const { schema } = makeThrowingSut();
    const validate = toFormikValidate(schema);

    // when
    await expect(validate(object)).rejects.toThrow("unexpected failure");
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

function makeThrowingSut() {
  const schema = z.object({ name: z.string() }).refine(() => {
    throw new Error("unexpected failure");
  });

  return {
    schema,
  };
}
