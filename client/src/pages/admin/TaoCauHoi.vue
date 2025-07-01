<template>
  <div class="editor">
    <div class="left-panel">
      <button @click="themCauHoi" class="btn add-question">+ Thêm câu hỏi</button>
    </div>

    <div class="main-panel">
      <h2 class="title">Bắt đầu nhập câu hỏi</h2>

      <!-- Hình ảnh/Media -->
      <div class="media-upload">
        <label class="upload-box">
          <span>📷 Tải tệp tin lên hoặc kéo vào đây</span>
          <input type="file" hidden />
        </label>
      </div>

      <!-- Câu hỏi -->
      <input
        type="text"
        v-model="noiDung"
        placeholder="Nhập nội dung câu hỏi..."
        class="question-input"
      />

      <!-- Đáp án -->
      <div class="answers-grid">
        <div
          class="answer-box"
          v-for="(dapAn, index) in dapAnList"
          :key="index"
          :style="{ backgroundColor: colors[index] }"
        >
          <span class="shape">{{ shapes[index] }}</span>
          <input
            type="text"
            v-model="dapAnList[index]"
            :placeholder="'Thêm đáp án ' + (index + 1)"
            class="answer-input"
          />
          <input
            type="radio"
            :value="index"
            v-model="dapAnDung"
            class="radio-right"
            :title="'Chọn đáp án đúng'"
          />
        </div>
      </div>

      <button @click="themDapAn" class="btn small">+ Thêm đáp án</button>

      <!-- Gửi -->
      <button class="btn submit" @click="taoCauHoi">Tạo câu hỏi</button>

      <h3 style="margin-top: 40px;">📋 Danh sách câu hỏi đã tạo</h3>
<ul>
  <li v-for="c in danhSachCauHoi" :key="c._id">
    {{ c.noiDung }} – <strong>{{ c.luaChon[c.dapAnDung] }}</strong>
  </li>
</ul>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const noiDung = ref('')
    const dapAnList = ref(['', '', '', ''])
    const dapAnDung = ref('')
    const danhSachCauHoi = ref([])

    const shapes = ['▲', '◆', '●', '■']
    const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50']
    const apiUrl = import.meta.env.VITE_API || ''

    const loadDanhSach = async () => {
      try {
        const res = await axios.get(`${apiUrl}/cau-hoi`)
        danhSachCauHoi.value = res.data
      } catch (err) {
        console.error('❌ Lỗi lấy câu hỏi:', err)
      }
    }

    const taoCauHoi = async () => {
      if (!apiUrl) return alert('Chưa cấu hình VITE_API')

      if (!noiDung.value || dapAnList.value.some(d => !d) || dapAnDung.value === '') {
        return alert('Vui lòng điền đủ câu hỏi và đáp án, chọn đáp án đúng!')
      }

      try {
        await axios.post(`${apiUrl}/cau-hoi`, {
          noiDung: noiDung.value,
          luaChon: dapAnList.value,
          dapAnDung: parseInt(dapAnDung.value),
        })
        alert('✅ Thêm câu hỏi thành công')
        noiDung.value = ''
        dapAnList.value = ['', '', '', '']
        dapAnDung.value = ''
        await loadDanhSach()
      } catch (err) {
        alert('Lỗi tạo câu hỏi: ' + (err.response?.data?.message || 'Không xác định'))
      }
    }

    const themDapAn = () => {
      if (dapAnList.value.length < 6) {
        dapAnList.value.push('')
        shapes.push('⬠')
        colors.push('#9c27b0')
      } else {
        alert('Tối đa 6 đáp án!')
      }
    }

    const themCauHoi = () => {
      noiDung.value = ''
      dapAnList.value = ['', '', '', '']
      dapAnDung.value = ''
    }

    onMounted(loadDanhSach)

    return {
      noiDung,
      dapAnList,
      dapAnDung,
      danhSachCauHoi,
      shapes,
      colors,
      taoCauHoi,
      themCauHoi,
      themDapAn
    }
  }
}
</script>
<style scoped>
.editor {
  display: flex;
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}

.left-panel {
  width: 200px;
  border-right: 1px solid #ccc;
  padding-right: 15px;
}

.main-panel {
  flex: 1;
  padding: 0 40px;
}

.title {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.media-upload {
  background: #f1f1f1;
  border: 2px dashed #bbb;
  height: 150px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-box {
  font-size: 16px;
  color: #666;
  cursor: pointer;
}

.question-input {
  width: 100%;
  font-size: 22px;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 30px;
  border: 1px solid #ccc;
}

.answers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.answer-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  position: relative;
}

.answer-input {
  flex: 1;
  border: none;
  font-size: 18px;
  padding: 6px 10px;
  border-radius: 6px;
}

.radio-right {
  position: absolute;
  right: 10px;
  top: 10px;
  transform: scale(1.4);
}

.shape {
  font-size: 28px;
  margin-right: 6px;
}

.btn {
  background: #4a148c;
  color: white;
  padding: 12px 22px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px 0;
}

.btn:hover {
  background: #6a1b9a;
}

.btn.small {
  padding: 6px 12px;
  font-size: 14px;
  background: #aaa;
}

.btn.submit {
  margin-top: 20px;
  width: 100%;
}
</style>
