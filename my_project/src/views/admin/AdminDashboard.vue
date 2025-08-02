<template>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Tổng quan -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow">
            <h2 class="text-gray-500 text-sm mb-1">Tổng độc giả</h2>
            <p class="text-2xl font-semibold text-gray-800">{{ dashboardData.totalReaders }}</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow">
            <h2 class="text-gray-500 text-sm mb-1">Tổng sách</h2>
            <p class="text-2xl font-semibold text-gray-800">{{ dashboardData.totalBooks }}</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow">
            <h2 class="text-gray-500 text-sm mb-1">Tổng đơn mượn</h2>
            <p class="text-2xl font-semibold text-gray-800">{{ dashboardData.totalBorrows }}</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow">
            <h2 class="text-gray-500 text-sm mb-1">Tổng tiền phạt</h2>
            <p class="text-2xl font-semibold text-gray-800">
                {{ dashboardData.totalFines.toLocaleString() }}đ
            </p>
        </div>
    </div>



    <!-- Hai bảng thông tin -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Độc giả gần đây -->
        <div class="bg-white p-6 rounded-xl shadow">
            <h2 class="text-lg font-semibold mb-4">Độc giả gần đây</h2>
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="text-gray-500 border-b">
                        <th class="py-2">Tên</th>
                        <th class="py-2">Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reader in dashboardData.recentUsers" :key="reader._id" class="border-b">
                        <td class="py-2">{{ reader.name }}</td>
                        <td class="py-2">{{ reader.email }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Sách mới gần đây -->
        <div class="bg-white p-6 rounded-xl shadow">
            <h2 class="text-lg font-semibold mb-4">Sách mới gần đây</h2>
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="text-gray-500 border-b">
                        <th class="py-2">Tên sách</th>
                        <th class="py-2">Tác giả</th>
                        <th class="py-2">Thể loại</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="book in dashboardData.recentBooks" :key="book._id" class="border-b">
                        <td class="py-2">{{ book.title }}</td>
                        <td class="py-2">{{ book.author.name }}</td>
                        <td class="py-2">{{ book.category.name }}</td>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Thêm vào dưới phần tổng quan -->
    <div class="mt-10">
        <BorrowChart :chart-data="chartData" />
    </div>
</template>

<script>
import AdminLayout from '@/components/admin/AdminLayout.vue'
import BorrowChart from '@/components/admin/BorrowChart.vue'
import api from '@/services/api.service'


export default {
    name: 'AdminDashboard',
    components: {
        AdminLayout,
        BorrowChart
    },
    data() {
        return {
            dashboardData: {
                totalReaders: 0,
                totalBooks: 0,
                totalBorrows: 0,
                totalFines: 0,
                recentUsers: [],
                recentBooks: [],
                borrowStatsLast7Days: []
            },
            chartData: null,
        }
    },
    created() {
        this.fetchDashboardData();
    },
    methods: {
        async fetchDashboardData() {
            try {
                const response = await api.get('/api/dashboard/overview');
                this.dashboardData = response.data;
                const stats = response.data.borrowStatsLast7Days;

                // Tạo danh sách 7 ngày gần nhất
                const today = new Date();
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(today.getDate() - (6 - i));
                    return date;
                });

                const formatDateKey = (date) => {
                    const y = date.getFullYear();
                    const m = (date.getMonth() + 1).toString().padStart(2, '0');
                    const d = date.getDate().toString().padStart(2, '0');
                    return `${y}-${m}-${d}`;
                };

                const formatLabel = (date) => {
                    const d = date.getDate().toString().padStart(2, '0');
                    const m = (date.getMonth() + 1).toString().padStart(2, '0');
                    return `${d}/${m}`;
                };

                // Tạo map từ dữ liệu thống kê trả về
                const countMap = {};
                stats.forEach(item => {
                    countMap[item._id] = item.count;
                });

                // Tạo dữ liệu biểu đồ đầy đủ 7 ngày
                const labels = last7Days.map(formatLabel);
                const data = last7Days.map(date => {
                    const key = formatDateKey(date);
                    return countMap[key] || 0;
                });

                this.chartData = {
                    labels,
                    datasets: [
                        {
                            label: 'Số sách mượn',
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: '#3B82F6',
                            data,
                            fill: true,
                            tension: 0.3
                        }
                    ]
                };
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu dashboard:", error);
            }
        }
    },
    mounted() {
        if (!sessionStorage.getItem('reloaded')) {
            sessionStorage.setItem('reloaded', 'true');
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloaded');
        }
    },
}
</script>
