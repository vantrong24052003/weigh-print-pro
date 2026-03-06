import * as yup from 'yup'

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/

export const weighingSchema = yup.object().shape({
  no: yup.string().required('Số phiếu không được để trống'),
  operator: yup.string().required('Nhân viên không được để trống'),
  licensePlate: yup.string().required('Biển số xe không được để trống'),
  date: yup
    .string()
    .required('Ngày không được để trống')
    .matches(dateRegex, 'Định dạng ngày: dd-mm-yyyy'),
  time: yup.string().required('Giờ không được để trống'),
  axles: yup
    .array()
    .of(
      yup.object().shape({
        left: yup.number().typeError('Phải là số').min(0, 'Không được âm').required('Trống'),
        right: yup.number().typeError('Phải là số').min(0, 'Không được âm').required('Trống')
      })
    )
    .min(1, 'Phải có ít nhất 1 trục')
})
