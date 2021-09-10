# zod-formik-adapter

This library adapts a [zod](https://www.npmjs.com/package/zod) schema to work as a `validationSchema` prop on [Formik](https://www.npmjs.com/package/formik)

**IMPORTANT: Currently, this library does not work with zod union. See more [here](https://github.com/robertLichtnow/zod-formik-adapter/issues/2).**

## Install

```sh
# npm
$ npm install zod-formik-adapter

# yarn
$ yarn add zod-formik-adapter
```

## Usage

```JSX
const { z } = require('zod');
const { Formik } = require('formik');
const { toFormikValidationSchema } = require('zod-formik-adapter');


const Schema = z.object({
  name: z.string(),
  age: z.number(),
});

function Component = () => (
  <Formik
    validationSchema={toFormikValidationSchema(Schema)}
  >
    {...}
  </Formik>
)

```
