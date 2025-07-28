import { Badge } from "../components/SuperAdmin";

export const serialNumberFormatter = (page, sizePerPage, index) => {
  return (page - 1) * sizePerPage + index + 1;
};
export const textFormatter = (data) => {
  return data && data?.charAt(0)?.toUpperCase() + data.slice(1);
};
export const capitalAfterSpaceFormatter = (data) => {
  if (!data || typeof data !== "string") return "";
  return data
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const statusFormatter = (status) => {
  const statusStyles = {
    active: { bg: "outline-success", label: "Active" },
    inactive: { bg: "outline-danger", label: "Inactive" },
    pending: { bg: "outline-warning", label: "Pending" },
    completed: { bg: "outline-success", label: "Completed" },
    rejected: { bg: "outline-danger", label: "Rejected" },
    deleted: { bg: "outline-secondary", label: "Deleted" },
    trial: { bg: "outline-info", label: "Trial" },
    draft: { bg: "outline-secondary", label: "Draft" },
    published: { bg: "outline-success", label: "Published" },
    scheduled: { bg: "outline-warning", label: "Scheduled" },
    Draft: { bg: "outline-secondary", label: "Draft" },
    Published: { bg: "outline-success", label: "Published" },
    Scheduled: { bg: "outline-warning", label: "Scheduled" },
    closed: { bg: "outline-success", label: "Closed" },
    open: { bg: "outline-success", label: "Open" },
    resolved: { bg: "outline-info", label: "Resolved" },
    'in progress': { bg: "outline-warning", label: "In Progress" },
    "pending signature": { bg: "outline-warning" },
    "payment pending": { bg: "outline-primary" },
    terminated: { bg: "outline-danger" },
    cancelled: { bg: "outline-secondary" },
    'Student Coaching': { bg: "outline-primary" },
    // Add more as needed...
  };
  const key = String(status).toLowerCase();

  const style = statusStyles[key] || {
    bg: "outline-dark",
    label: status,
  };
  return (
    <Badge
      bg={style.bg}
      extraClass="badge-dim"
      label={capitalAfterSpaceFormatter(style.label || status)}
      size="sm"
    />
  );
};
export function otpRegex() {
  let regex = /^[0-9]+$/;
  return regex;
}

export const formatDateToDDMMYYYY = (val) => {
  if (!val) return "";

  const date = new Date(val);
  if (isNaN(date)) return ""; // Invalid date safeguard

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateToYYYYMMDD = (val) => {
  if (!val) return "";

  const date = new Date(val);
  if (isNaN(date)) return ""; // Invalid date safeguard

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};
export function getInitialsName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    return "N/A";
  }
  return (
    name
      .trim()
      .split(/\s+/)
      .filter((word) => /^[A-Za-z]/.test(word))
      .map((word) => word[0].toUpperCase())
      .join("") || "N/A"
  );
}
export function checkValidData(data) {
  if (data === null || data === undefined || data === "") {
    return "N/A";
  }
  return data;
}

export function formatMonthWiseDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
export function getContractTypeBadges(types = []) {
  return (
    <div className="d-flex align-items-center flex-wrap col-gap-1">
      {types.map((type, index) => (
        <Badge key={index} pill bg="light" text="dark" label={type} size="sm" />
      ))}
    </div>
  );
}
