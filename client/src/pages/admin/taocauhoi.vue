<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center">Tạo câu hỏi</h2>
    
    <form @submit.prevent="taoCauHoi">
      <div class="mb-3">
        <label for="noiDung" class="form-label">Nội dung</label>
        <input
          type="text"
          id="noiDung"
          v-model="noiDung"
          class="form-control"
          placeholder="Nhập nội dung câu hỏi"
          required
        />
      </div>

      <div class="mb-3" v-for="(dapAn, index) in dapAnList" :key="index">
        <label :for="'dapAn' + index" class="form-label">Đáp án {{ index + 1 }}</label>
        <input
          type="text"
          :id="'dapAn' + index"
          v-model="dapAnList[index]"
          class="form-control"
          :placeholder="'Nhập đáp án ' + (index + 1)"
          required
        />
      </div>

      <div class="mb-3">
        <label for="dapAnDung" class="form-label">Chọn đáp án đúng</label>
        <select v-model="dapAnDung" id="dapAnDung" class="form-select" required>
          <option disabled value="">-- Chọn một đáp án đúng --</option>
          <option v-for="(dapAn, index) in dapAnList" :key="index" :value="index">
            Đáp án {{ index + 1 }}
          </option>
        </select>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary">Tạo câu hỏi</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      noiDung: '',
      dapAnList: ['', '', '', ''],
      dapAnDung: '',
    }
  },
  methods: {
    async taoCauHoi() {
            console.log('Dữ liệu gửi:', {
  noiDung: this.noiDung,
  dapAn: this.dapAnList,
  dapAnDung: this.dapAnList[this.dapAnDung], // nếu bạn sửa thành gửi nội dung đáp án
})
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/cau-hoi`, {
        noiDung: this.noiDung,
        dapAn: this.dapAnList,
        dapAnDung: this.dapAnDung,
      })
      alert('Thêm câu hỏi thành công!')
      this.noiDung = ''
      this.dapAnList = ['', '', '', '']
      this.dapAnDung = ''
    } catch (err) {
      console.error('Lỗi chi tiết:', err.response?.data || err.message)
      alert(`Lỗi khi thêm câu hỏi: ${err.response?.data?.message || 'Không xác định'}`)
    }
    },
  },
}
</script>
