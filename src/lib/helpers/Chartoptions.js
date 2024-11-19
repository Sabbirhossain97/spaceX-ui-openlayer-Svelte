let dynamicLabel;
let hasData;
export function getChartOptions(data, label) {
    hasData = data.some((item) => item > 0);
    dynamicLabel = hasData ? "Landing Pads" : "No Data"
    return {
        series: hasData ? data : [100],
        labels: label,
        colors: hasData ? [] : ["#e8e6e6"],
        chart: {
            height: 222,
            width: "100%",
            type: "donut",
        },
        stroke: {
            colors: ["transparent"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: hasData ? 20 : 10,
                        },
                        total: {
                            showAlways: true,
                            show: true,
                            label: dynamicLabel,
                            fontFamily: "Inter, sans-serif",
                            formatter: function (w) {
                                if (hasData) {
                                    return w.globals.seriesTotals.length;
                                } else {
                                    return
                                }
                            },
                        },
                        value: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: -20,
                            formatter: function (value) {
                                return value;
                            },
                        },
                    },
                    size: "80%",
                },
            },
        },
        grid: {
            padding: {
                top: -2,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    if (value === 100) {
                        return "0%"
                    } else {
                        return `${value}%`;
                    }

                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return `${value}%`;
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    };
}