import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir email adresi giriniz")
    .required("Email alanı boş bırakılamaz"),
  password: Yup.string().required("Şifre alanı boş bırakılamaz"),
});
