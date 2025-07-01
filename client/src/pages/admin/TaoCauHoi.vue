<template>
  <div class="editor">
    <div class="left-panel">
      <button @click="themCauHoi" class="btn add-question">+ Thêm câu hỏi</button>
    </div>

    <div class="main-panel">
      <h2 class="title">Bắt đầu nhập câu hỏi</h2>

      <input
        type="text"
        v-model="noiDung"
        placeholder="Nhập nội dung câu hỏi..."
        class="question-input"
      />

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
            :placeholder="'Đáp án ' + (index + 1)"
            class="answer-input"
          />
          <input
            type="radio"
            :value="index"
            v-model="dapAnDung"
            class="radio-right"
          />
        </div>
      </div>

      <button @click="themDapAn" class="btn small">+ Thêm đáp án</button>
      <button class="btn submit" @click="taoCauHoi">Tạo câu hỏi</button>

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
      } catch {}
    }

    const taoCauHoi = async () => {
      if (!noiDung.value || dapAnList.value.some(d => !d) || dapAnDung.value === '') {
        return
      }

      try {
        await axios.post(`${apiUrl}/cau-hoi`, {
          noiDung: noiDung.value,
          luaChon: dapAnList.value,
          dapAnDung: parseInt(dapAnDung.value),
        })
        noiDung.value = ''
        dapAnList.value = ['', '', '', '']
        dapAnDung.value = ''
        await loadDanhSach()
      } catch {}
    }

    const themDapAn = () => {
      if (dapAnList.value.length < 6) {
        dapAnList.value.push('')
        shapes.push('⬠')
        colors.push('#9c27b0')
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
/* giữ nguyên style như cũ vì không gây lỗi */
</style>
