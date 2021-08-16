const { Formik } = require("formik");
const { z } = require("zod");
const { toFormikValidationSchema } = require("zod-formik-adapter");

const Schema = z.object({
  name: z.string(),
  age: z.number(),
});

const initialValues = {
  name: "",
  age: 1,
}

export function SampleForm() {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(Schema)}
      onSubmit={console.log}
    >
      {({ errors, values, handleChange }) => (
        <form>
          <input value={values.name} onChange={handleChange("name")} />
          <span>{errors.name}</span>

          <input value={values.age} onChange={handleChange("age")} />
          <span>{errors.age}</span>
        </form>
      )}
    </Formik>
  )
}