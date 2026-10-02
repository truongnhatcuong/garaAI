const safetyReminder = "> **Cảnh báo an toàn:** Triệu chứng bạn mô tả có thể ảnh hưởng đến an toàn xe. Nếu đang lái, hãy tấp vào nơi an toàn khi có thể. Nếu phanh hoặc tay lái bất thường, lốp xẹp, có khói hay mùi khét, đừng tiếp tục lái; hãy liên hệ cứu hộ hoặc gara. Chỉ đọc và nhắn tin khi xe đã dừng an toàn.";

function normalizeVietnamese(value: string) {
  return value.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

export function describesDrivingHazard(question: string) {
  const text = normalizeVietnamese(question);
  const brakeProblem = /\b(phanh|thang|abs)\b/.test(text)
    && /\b(khong an|mat|yeu|rung|keu|rit|ken ket|tieng la|kim loai|lun|ket|bo|mon)\b/.test(text);
  const steeringProblem = /\b(vo lang|tay lai|he thong lai)\b/.test(text)
    && /\b(mat|khong dieu khien|ket|nang|rung|lech|bat thuong)\b/.test(text);
  const tireProblem = /\b(lop|banh xe)\b/.test(text)
    && /\b(no|xep|thung|rach|non)\b/.test(text);
  const otherHazard = /\b(mat lai|boc khoi|mui khet|qua nhiet|ro ri xang|ro xang|ro nhien lieu|den canh bao phanh)\b/.test(text);

  return brakeProblem || steeringProblem || tireProblem || otherHazard;
}

export function withSafetyReminder(question: string, reply: string) {
  if (!describesDrivingHazard(question) || /^>\s*\*\*Cảnh báo an toàn:/im.test(reply)) return reply;
  return `${safetyReminder}\n\n${reply}`;
}
