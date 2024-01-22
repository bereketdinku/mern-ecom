"use client"
import {Chart as ChartJs,BarElement,CategoryScale,LinearScale,Tooltip,Legend} from 'chart.js'
import { Bar } from 'react-chartjs-2'
ChartJs.register(BarElement,CategoryScale,LinearScale,Tooltip,Legend);
interface BarGraphprops{
    data:GraphData[]
}
type GraphData={
day:string;
date:string;
totalAmount:number;
}
const BarGraph:React.FC<BarGraphprops> = ({data}) => {
    const labels=data.map(item=>item.day)
    const amounts=data.map(item=>item.totalAmount)
    const chartData={
        labels:labels,
        datasets:[{
            label:'Sale Amount',
            data:amounts,
            backgroundColor:'rgbs(75.192,192,0)',
            borderWidth:1
        }]
    }

    const options={
        scales:{
            y:{
                beginAtZero:true
            }
        }
    }
    return (<Bar data={chartData} options={options}/> );
}
 
export default BarGraph;