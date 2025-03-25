export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === undefined || amount === null) return "0 ₫";
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: showSymbol ? "currency" : "decimal",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export const formatDate = (date, includeTime = false) => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "Ngày không hợp lệ";

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
  }

  return dateObj.toLocaleDateString("vi-VN", options);
};

export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
  };

  return statusMap[status] || status;
};

export const formatPaymentStatus = (status) => {
  const statusMap = {
    pending: "Chưa thanh toán",
    paid: "Đã thanh toán",
    failed: "Thanh toán thất bại",
  };

  return statusMap[status] || status;
};

export const formatPaymentMethod = (method) => {
  const methodMap = {
    cod: "Thanh toán khi nhận hàng",
    banking: "Chuyển khoản ngân hàng",
    momo: "Ví MoMo",
    zalopay: "ZaloPay",
  };

  return methodMap[method] || method;
};

export const truncateString = (str, maxLength = 50) => {
  if (!str) return "";

  if (str.length <= maxLength) return str;

  return str.substring(0, maxLength) + "...";
};

export const formatAddress = (address) => {
  if (!address) return "";

  const { houseNumber, street, ward, district, city } = address;
  const parts = [];

  if (houseNumber) parts.push(houseNumber);
  if (street) parts.push(street);
  if (ward) parts.push(`Phường/Xã ${ward}`);
  if (district) parts.push(`Quận/Huyện ${district}`);
  if (city) parts.push(city);

  return parts.join(", ");
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length !== 10) return phone;
  return `${cleaned.substring(0, 4)} ${cleaned.substring(
    4,
    7
  )} ${cleaned.substring(7, 10)}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatOrderCode = (id, length = 8) => {
  if (!id) return "";
  return id.substring(id.length - length);
};

export const formatRelativeTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "Thời gian không hợp lệ";

  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} năm trước`;
  }
};

export const formatNumber = (number) => {
  if (number === undefined || number === null) return "0";

  return new Intl.NumberFormat("vi-VN").format(number);
};

export const formatPercent = (value, decimalPlaces = 2) => {
  if (value === undefined || value === null) return "0%";

  return value.toFixed(decimalPlaces) + "%";
};
