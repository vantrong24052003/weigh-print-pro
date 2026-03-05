import * as yup from 'yup'

export const weighingSchema = yup.object().shape({
  licensePlate: yup.string().required('Biển số xe không được để trống'),
  date: yup.string().required('Ngày không được để trống'),
  time: yup.string().required('Giờ không được để trống'),
  axles: yup.array().of(
    yup.object().shape({
      left: yup.number()
        .typeError('Phải là số')
        .min(0, 'Không được âm')
        .required('Trống'),
      right: yup.number()
        .typeError('Phải là số')
        .min(0, 'Không được âm')
        .required('Trống'),
    })
  ).min(1, 'Phải có ít nhất 1 trục')
})
