import ReactECharts from 'echarts-for-react'
import series from "@/data/series.json";
type SeriesChartProps = {
    teams: string[]
}

type SeriesEntry = {
    team: string;
    score: number;
    pos: number;
    time: number;
}

const getSeries = (key: string): (SeriesEntry[])|undefined => {
    return (series as any)[key] as (SeriesEntry[]);
}

const SeriesChart = ({ teams, ...props }: SeriesChartProps) => {
    const data = teams.map(t => getSeries(t)).filter(t => t) as (SeriesEntry[][]);

    if (!data) {
        return <>Loading...</>;
    }
    if (data.length === 0 || data.filter((team) => team.length > 0).length === 0) {
        return <></>;
    }

    const series = data.map((team, i) => (
        {
            name: teams[i],
            type: 'line',
            showSymbol: false,
            data: team.map((e) => [
                e.time * 1000,
                e.score,
            ])
        }
    ))
    return (
        <>
            <ReactECharts option={{
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: 'false',
                    },
                },
                legend: {
                    data: teams,
                },
                xAxis: {
                    type: 'time',
                },
                yAxis: {
                    type: 'value',
                },
                series: series,
            }}
                notMerge={true}
            />
        </>
    )
}

export default SeriesChart;
