import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir e-posta girin")
    .required("E-posta zorunludur"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
});

export default loginSchema;
