import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import whatsappWeb from 'whatsapp-web.js';
import api from '../utils/api.js';

const width = 800; 
const height = 500;
const { MessageMedia } = whatsappWeb
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export const handleCombineChart = async (deviceId, totalDays, interval) => {
  try {
    const res = await api.get(`/api/sensor-log/${deviceId}`, {
      params: { 
        days: totalDays,
        interval: interval
      }
    });

    const logs = res.data.logs;

    if (!logs || logs.length === 0) {
      return "❌ Data log kosong untuk rentang waktu tersebut, tidak bisa membuat grafik.";
    }

    // 2. Adaptive X-Axis Label Format
    const labelsWaktu = logs.map(log => {
      const rawDate = log.sampleDate || log.createdAt || log.created_at;
      const tgl = new Date(log.sampleDate);
      
      const jam = String(tgl.getHours()).padStart(2, '0');
      const menit = String(tgl.getMinutes()).padStart(2, '0');
      
      // If the interval is hourly, display the Time format (Hour:Minute)
      if (interval === '1h') {
        return `${jam}:${menit}`;
      } 
      
      // If the interval is 6 hours or 1 day, display the Date format (Date Name-Month)
      // Example: "16 June"
      const opsiTanggal = { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' };
      const formatTanggal = tgl.toLocaleDateString('id-ID', opsiTanggal);
      
      // If the interval is 6h, we add the hour info behind it for details (Example: "June 16, 06:00")
      if (interval === '6h') {
        return `${formatTanggal} ${jam}:00`;
      }

      return formatTanggal;
    });

    // 3. Extract Sensor Mean Values ​​from Backend Aggregation Array
    const dataSuhu = logs.map(log => log.avgTemp !== null && log.avgTemp !== undefined ? log.avgTemp.toFixed(1) : null);
    const dataKelembapan = logs.map(log => log.avgHumid !== null && log.avgHumid !== undefined ? log.avgHumid.toFixed(1) : null);
    const dataGas = logs.map(log => log.avgGas !== null && log.avgGas !== undefined ? Math.round(log.avgGas) : null);

    // 4. Configuration Chart.js
    const configuration = {
      type: 'line',
      data: {
        labels: labelsWaktu,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: dataSuhu,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            yAxisID: 'yTemp',
            tension: 0.2,
            pointRadius: logs.length > 50 ? 0 : 3
          },
          {
            label: 'Kelembapan (%)',
            data: dataKelembapan,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            yAxisID: 'yHumid',
            tension: 0.2,
            pointRadius: logs.length > 50 ? 0 : 3
          },
          {
            label: 'Gas (PPM)',
            data: dataGas,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            yAxisID: 'yGas',
            tension: 0.2,
            pointRadius: logs.length > 50 ? 0 : 3
          }
        ]
      },
      options: {
        responsive: false,
        scales: {
          yTemp: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: 'Suhu (°C)', color: 'rgb(255, 99, 132)' },
            grid: { drawOnChartArea: true }
          },
          yHumid: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Kelembapan (%)', color: 'rgb(54, 162, 235)' },
            grid: { drawOnChartArea: false }
          },
          yGas: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Gas (PPM)', color: 'rgb(75, 192, 192)' },
            grid: { drawOnChartArea: false },
            stack: 'demo',
            offset: true
          }
        }
      }
    };

    // 5. Render Chart to Image Buffer form (PNG)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    // 6. Convert Buffer to WhatsApp Media object
    const media = new MessageMedia('image/png', imageBuffer.toString('base64'), 'grafik-monitoring.png');

    // 7. Prepare the caption text for your WA message
    let infoRentang = `${totalDays} Hari Terakhir`;
    if (totalDays % 30 === 0) infoRentang = `${totalDays / 30} Bulan Terakhir`;
    if (totalDays % 7 === 0 && totalDays < 30) infoRentang = `${totalDays / 7} Minggu Terakhir`;

    return {
      media: media,
      caption: `📊 *Grafik Analisis Multivariabel*\n━━━━━━━━━━━━━━━━━━\n🆔 ID Device : *${deviceId}*\n📅 Periode    : *${infoRentang}*\n📈 Kompresi   : Rata-rata per *${interval === '1h' ? 'Jam' : interval === '6h' ? '6 Jam' : 'Hari'}*`
    };

  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    return "❌ Gagal mengambil data sensor dari server. Silakan coba beberapa saat lagi."
  }
};