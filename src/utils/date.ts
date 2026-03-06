export const getCurrentDate = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${day}-${month}-${year}`
}

export const getCurrentTime = (): string => {
  const now = new Date()
  return now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

export const parseDate = (value: string | number | undefined): string => {
  if (!value) return ''
  const str = String(value).trim()

  const ddmmyyyy = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(str)
  if (ddmmyyyy) {
    return `${ddmmyyyy[1]}-${ddmmyyyy[2]}-${ddmmyyyy[3]}`
  }

  const yyyymmdd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
  if (yyyymmdd) {
    return `${yyyymmdd[3]}-${yyyymmdd[2]}-${yyyymmdd[1]}`
  }

  const mmddyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str)
  if (mmddyyyy) {
    return `${mmddyyyy[2]}-${mmddyyyy[1]}-${mmddyyyy[3]}`
  }

  return str
}

export const parseTime = (value: string | number | undefined): string => {
  if (!value) return ''
  return String(value).trim()
}
