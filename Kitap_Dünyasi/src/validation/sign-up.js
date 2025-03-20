import * as yup from "yup";

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("İsim zorunludur")
    .min(2, "İsim en az 2 karakter olmalıdır"),
  email: yup
    .string()
    .email("Geçerli bir e-posta girin")
    .required("E-posta zorunludur"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
});

export default registerSchema;
