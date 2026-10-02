import assert from "node:assert/strict";
import test from "node:test";
import { describesDrivingHazard, withSafetyReminder } from "../src/lib/customer-assistant-safety";

test("nhắc an toàn với triệu chứng có thể ảnh hưởng điều khiển xe", () => {
  assert.equal(describesDrivingHazard("Xe phanh gấp nghe tiếng ken két và chân phanh rung"), true);
  assert.equal(describesDrivingHazard("Vô lăng bị kẹt khi vào cua"), true);
  assert.equal(describesDrivingHazard("Lốp xe bị xẹp giữa đường"), true);
  assert.match(withSafetyReminder("Phanh yếu", "Nên đến gara kiểm tra."), /^> \*\*Cảnh báo an toàn:/);
});

test("không gắn cảnh báo cho câu hỏi dịch vụ thông thường", () => {
  const reply = "Giá má phanh chưa được xác nhận.";
  assert.equal(describesDrivingHazard("Gara có bán má phanh không?"), false);
  assert.equal(withSafetyReminder("Hóa đơn thay má phanh của tôi bao nhiêu?", reply), reply);
});

test("không lặp thẻ cảnh báo do AI đã cung cấp", () => {
  const reply = "> **Cảnh báo an toàn:** Hãy dừng xe ở nơi an toàn.\n\n### Nên làm ngay";
  assert.equal(withSafetyReminder("Phanh bị rung", reply), reply);
});
