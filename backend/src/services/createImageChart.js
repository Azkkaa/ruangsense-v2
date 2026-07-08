import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import whatsappWeb from 'whatsapp-web.js';
import SensorLog from '../models/SensorLog.js'; // 1. Import model langsung di sini

const width = 800; 
const height = 500;
const { MessageMedia } = whatsappWeb;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export const handleCombineChart = async (deviceId, totalDays, interval) => {
  try {
    const totalDaysParsed = parseInt(totalDays, 10) || 1;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - totalDaysParsed);

    let groupFormat = {};

    if (interval === '1h') {
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' }
      };
    } else if (interval === '6h') {
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hourBlock: {
          $subtract: [
            { $hour: '$createdAt' },
            { $mod: [{ $hour: '$createdAt' }, 6] }
          ]
        }
      };
    } else if (interval === '1d') {
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    }

    const logs = await SensorLog.aggregate([
      {
        $match: {
          device_id: deviceId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupFormat,
          avgTemp: { $avg: '$temp' },
          avgHumid: { $avg: '$humid' },
          avgGas: { $avg: '$gas' },
          sampleDate: { $first: '$createdAt' }
        }
      },
      {
        $sort: { sampleDate: 1 }
      },
      {
        $limit: 100
      }
    ]);

    if (!logs || logs.length === 0) {
      return "❌ Data log kosong untuk rentang waktu tersebut, tidak bisa membuat grafik.";
    }

    // 2. Adaptive X-Axis Label Format
    const labelsWaktu = logs.map(log => {
      const tgl = new Date(log.sampleDate);
      
      const jam = String(tgl.getHours()).padStart(2, '0');
      const menit = String(tgl.getMinutes()).padStart(2, '0');
      
      if (interval === '1h') {
        return `${jam}:${menit}`;
      } 
      
      const opsiTanggal = { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' };
      const formatTanggal = tgl.toLocaleDateString('id-ID', opsiTanggal);
      
      if (interval === '6h') {
        return `${formatTanggal} ${jam}:00`;
      }

      return formatTanggal;
    });

    // 3. Extract Sensor Mean Values ​​dari Array Aggregation
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

    // 5. Render Chart to Image Buffer (PNG)
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    // 6. Convert Buffer to WhatsApp Media object
    const media = new MessageMedia('image/png', imageBuffer.toString('base64'), 'grafik-monitoring.png');

    // 7. WA caption text
    let infoRentang = `${totalDaysParsed} Hari Terakhir`;
    if (totalDaysParsed % 30 === 0) infoRentang = `${totalDaysParsed / 30} Bulan Terakhir`;
    if (totalDaysParsed % 7 === 0 && totalDaysParsed < 30) infoRentang = `${totalDaysParsed / 7} Minggu Terakhir`;

    return {
      media: media,
      caption: `📊 *Grafik Analisis Multivariabel*\n━━━━━━━━━━━━━━━━━━\n🆔 ID Device : *${deviceId}*\n📅 Periode    : *${infoRentang}*\n📈 Kompresi   : Rata-rata per *${interval === '1h' ? 'Jam' : interval === '6h' ? '6 Jam' : 'Hari'}*`
    };

  } catch (err) {
    console.error("[handleCombineChart Error]:", err.message);
    return "❌ Gagal memproses grafik langsung dari database. Silakan coba beberapa saat lagi.";
  }
};