<template>
    <div class="bg-white p-6 rounded-xl shadow h-96">
        <h2 class="text-lg font-semibold mb-4">Thống kê mượn sách 7 ngày qua</h2>
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
        <p v-else class="text-gray-500 text-sm">Đang tải biểu đồ...</p>
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

export default {
    name: 'BorrowChart',
    components: {
        Bar
    },
    props: {
        chartData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        };
    }
};
</script>
