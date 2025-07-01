<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-4 space-y-4">
      <div class="text-xl font-bold text-purple-700">Tạo Kahoot</div>
      <div class="border rounded-lg p-3 text-sm text-gray-600">
        <p>1. Trắc nghiệm</p>
        <p class="text-gray-400">Câu hỏi</p>
      </div>
      <button class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Thêm câu hỏi</button>
      <button class="w-full border py-2 rounded text-gray-600 hover:bg-gray-100">Thêm slide</button>
    </aside>

    <!-- Main content -->
    <main class="flex-1 px-8 py-6 bg-cover bg-center" style="background-image: url('/images/classroom-bg.jpg')">
      <div class="bg-white bg-opacity-80 p-6 rounded-xl shadow-md">
        <!-- Câu hỏi -->
        <input
          v-model="noiDungCauHoi"
          type="text"
          placeholder="Bắt đầu nhập câu hỏi"
          class="w-full text-xl font-semibold border-b py-2 mb-4 bg-transparent focus:outline-none"
        />

        <!-- Ảnh -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 bg-white cursor-pointer hover:border-purple-500"
        >
          <p class="font-semibold">Tải lên hình ảnh hoặc kéo thả vào đây</p>
        </div>

        <!-- Đáp án -->
        <div class="grid grid-cols-2 gap-4 mt-6">
          <div
            v-for="(dapAn, i) in danhSachDapAn"
            :key="i"
            class="relative rounded-lg p-4 bg-white border-2 shadow group hover:border-purple-500"
            :class="{
              'border-red-500': i === 0,
              'border-blue-500': i === 1,
              'border-yellow-500': i === 2,
              'border-green-500': i === 3,
            }"
          >
            <input
              v-model="danhSachDapAn[i]"
              type="text"
              :placeholder="`Thêm đáp án ${i + 1}`"
              class="w-full text-sm font-medium bg-transparent focus:outline-none"
            />
            <input
              type="radio"
              v-model="dapAnDung"
              :value="i"
              class="absolute top-2 right-2 accent-purple-600"
            />
          </div>
        </div>

        <button
          class="mt-6 bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700"
          @click="submitTaoCauHoi"
        >
          Lưu câu hỏi
        </button>

        <p v-if="thongBaoThanhCong" class="mt-4 text-green-600 font-medium">{{ thongBaoThanhCong }}</p>
        <p v-if="thongBaoLoi" class="mt-4 text-red-600 font-medium">{{ thongBaoLoi }}</p>
      </div>
    </main>

    <!-- Sidebar phải -->
    <aside class="w-64 bg-white p-4 border-l">
      <h3 class="text-sm font-semibold mb-2">Loại câu hỏi</h3>
      <select class="select-box">
        <option>Trắc nghiệm</option>
      </select>

      <h3 class="text-sm font-semibold mt-4 mb-2">Giới hạn thời gian</h3>
      <select class="select-box">
        <option>20 giây</option>
        <option>30 giây</option>
      </select>

      <h3 class="text-sm font-semibold mt-4 mb-2">Điểm</h3>
      <select class="select-box">
        <option>Tiêu chuẩn</option>
      </select>

      <h3 class="text-sm font-semibold mt-4 mb-2">Đáp án để chọn</h3>
      <select class="select-box">
        <option>Chọn một đáp án</option>
      </select>

      <div class="mt-6 space-x-2 text-sm">
        <button class="px-4 py-1 border rounded hover:bg-gray-100">Xoá</button>
        <button class="px-4 py-1 border rounded hover:bg-gray-100">Sao chép</button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const noiDungCauHoi = ref('')
const danhSachDapAn = ref(['', '', '', ''])
const dapAnDung = ref(null)

const thongBaoThanhCong = ref('')
const thongBaoLoi = ref('')

const submitTaoCauHoi = async () => {
  thongBaoThanhCong.value = ''
  thongBaoLoi.value = ''

  if (dapAnDung.value === null) {
    thongBaoLoi.value = 'Vui lòng chọn đáp án đúng.'
    return
  }

  try {
    await axios.post('http://localhost:5000/api/cau-hoi', {
      noiDung: noiDungCauHoi.value,
      luaChon: danhSachDapAn.value,
      dapAnDung: dapAnDung.value,
    })

    thongBaoThanhCong.value = '✅ Đã lưu câu hỏi!'
    noiDungCauHoi.value = ''
    danhSachDapAn.value = ['', '', '', '']
    dapAnDung.value = null
  } catch (err) {
    thongBaoLoi.value = '❌ Có lỗi xảy ra khi lưu.'
  }
}
</script>

<style scoped>
.select-box {
  @apply w-full border px-3 py-2 rounded bg-white text-sm text-gray-700;
}
</style>
